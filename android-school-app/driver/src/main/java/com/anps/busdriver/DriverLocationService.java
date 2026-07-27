package com.anps.busdriver;

import android.Manifest;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.os.IBinder;

import org.json.JSONObject;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Iterator;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class DriverLocationService extends Service implements LocationListener {
    public static final String ACTION_START = "com.anps.busdriver.START_TRACKING";
    public static final String ACTION_STOP = "com.anps.busdriver.STOP_TRACKING";
    public static final String EXTRA_ENDPOINT = "endpoint";
    public static final String EXTRA_PAYLOAD = "payload";

    private static final String CHANNEL_ID = "driver_gps_tracking";
    private static final int NOTIFICATION_ID = 2244;
    private static final long MIN_TIME_MS = 3000;
    private static final float MIN_DISTANCE_M = 2f;
    private static final long MAX_LAST_KNOWN_AGE_MS = 120000;

    private final ExecutorService sender = Executors.newSingleThreadExecutor();
    private LocationManager locationManager;
    private String endpoint = "";
    private JSONObject basePayload = new JSONObject();

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String action = intent == null ? "" : intent.getAction();
        if (ACTION_STOP.equals(action)) {
            stopTracking();
            return START_NOT_STICKY;
        }
        if (intent != null) {
            endpoint = intent.getStringExtra(EXTRA_ENDPOINT) == null ? "" : intent.getStringExtra(EXTRA_ENDPOINT);
            try {
                basePayload = new JSONObject(intent.getStringExtra(EXTRA_PAYLOAD) == null ? "{}" : intent.getStringExtra(EXTRA_PAYLOAD));
            } catch (Exception ignored) {
                basePayload = new JSONObject();
            }
        }
        startForeground(NOTIFICATION_ID, buildNotification("Tracking ready"));
        startTracking();
        return START_STICKY;
    }

    private void startTracking() {
        if (endpoint.trim().isEmpty() || !hasLocationPermission()) {
            stopSelf();
            return;
        }
        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        if (locationManager == null) {
            stopSelf();
            return;
        }
        try {
            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, MIN_TIME_MS, MIN_DISTANCE_M, this);
        } catch (Exception ignored) {}
        try {
            locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, MIN_TIME_MS, MIN_DISTANCE_M, this);
        } catch (Exception ignored) {}
        try {
            Location last = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
            if (last == null) last = locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER);
            if (last != null && System.currentTimeMillis() - last.getTime() <= MAX_LAST_KNOWN_AGE_MS) {
                sendLocation(last, "running");
            }
        } catch (Exception ignored) {}
    }

    private boolean hasLocationPermission() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) return true;
        return checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                || checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED;
    }

    @Override
    public void onLocationChanged(Location location) {
        if (location != null) sendLocation(location, "running");
    }

    @Override public void onStatusChanged(String provider, int status, Bundle extras) {}
    @Override public void onProviderEnabled(String provider) {}
    @Override public void onProviderDisabled(String provider) {}

    private void sendLocation(Location location, String status) {
        sender.execute(() -> {
            HttpURLConnection connection = null;
            try {
                JSONObject payload = clonePayload();
                payload.put("lat", location.getLatitude());
                payload.put("lng", location.getLongitude());
                payload.put("speed_kmph", Math.max(0, location.getSpeed() * 3.6f));
                payload.put("heading", location.hasBearing() ? location.getBearing() : 0);
                payload.put("accuracy_m", location.hasAccuracy() ? location.getAccuracy() : 0);
                payload.put("provider", location.getProvider() == null ? "" : location.getProvider());
                payload.put("status", status);

                byte[] body = payload.toString().getBytes(StandardCharsets.UTF_8);
                connection = (HttpURLConnection) new URL(endpoint).openConnection();
                connection.setRequestMethod("POST");
                connection.setConnectTimeout(10000);
                connection.setReadTimeout(10000);
                connection.setDoOutput(true);
                connection.setRequestProperty("Content-Type", "application/json");
                connection.setRequestProperty("Content-Length", String.valueOf(body.length));
                try (OutputStream output = connection.getOutputStream()) {
                    output.write(body);
                }
                int code = connection.getResponseCode();
                String responseText = readResponse(connection);
                if (code >= 200 && code < 300) {
                    if (responseText.contains("\"accepted\":false")) {
                        updateNotification("GPS accuracy low");
                    } else {
                        updateNotification("Live GPS sending");
                    }
                } else {
                    updateNotification("GPS retrying");
                }
            } catch (Exception ignored) {
                updateNotification("GPS retrying");
            } finally {
                if (connection != null) connection.disconnect();
            }
        });
    }

    private String readResponse(HttpURLConnection connection) {
        try {
            InputStream stream = connection.getInputStream();
            StringBuilder builder = new StringBuilder();
            byte[] buffer = new byte[1024];
            int count;
            while ((count = stream.read(buffer)) != -1) {
                builder.append(new String(buffer, 0, count, StandardCharsets.UTF_8));
            }
            stream.close();
            return builder.toString();
        } catch (Exception ignored) {
            return "";
        }
    }

    private JSONObject clonePayload() throws Exception {
        JSONObject copy = new JSONObject();
        Iterator<String> keys = basePayload.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            copy.put(key, basePayload.get(key));
        }
        return copy;
    }

    private void stopTracking() {
        if (locationManager != null) {
            try {
                locationManager.removeUpdates(this);
            } catch (Exception ignored) {}
        }
        stopForeground(true);
        stopSelf();
    }

    private void updateNotification(String text) {
        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager != null) manager.notify(NOTIFICATION_ID, buildNotification(text));
    }

    private Notification buildNotification(String text) {
        createChannel();
        Intent launchIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(
                this,
                0,
                launchIntent,
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.M ? PendingIntent.FLAG_IMMUTABLE : 0
        );
        Notification.Builder builder = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? new Notification.Builder(this, CHANNEL_ID)
                : new Notification.Builder(this);
        return builder
                .setContentTitle("ANPS Driver GPS")
                .setContentText(text)
                .setSmallIcon(R.drawable.ic_driver_logo)
                .setContentIntent(pendingIntent)
                .setOngoing(true)
                .build();
    }

    private void createChannel() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) return;
        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager == null || manager.getNotificationChannel(CHANNEL_ID) != null) return;
        NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Driver GPS Tracking",
                NotificationManager.IMPORTANCE_LOW
        );
        channel.setDescription("Keeps driver GPS running during trips.");
        manager.createNotificationChannel(channel);
    }

    @Override
    public void onDestroy() {
        if (locationManager != null) {
            try {
                locationManager.removeUpdates(this);
            } catch (Exception ignored) {}
        }
        sender.shutdownNow();
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}

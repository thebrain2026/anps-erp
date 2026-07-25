package com.anps.schoolerp;

import android.annotation.SuppressLint;
import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.os.Bundle;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.speech.RecognitionListener;
import android.speech.RecognizerIntent;
import android.speech.SpeechRecognizer;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.google.firebase.messaging.FirebaseMessaging;

import org.json.JSONObject;

import java.util.ArrayList;

public class MainActivity extends Activity {
    private WebView webView;
    private LinearLayout offlineView;
    private ProgressBar progressBar;
    private String currentPushToken = "";
    private PermissionRequest pendingAudioPermissionRequest;
    private boolean pendingNativeSpeechStart = false;
    private SpeechRecognizer speechRecognizer;
    private boolean nativeSpeechDoneRequested = false;
    private boolean nativeSpeechCompleted = false;
    private StringBuilder nativeSpeechBuffer = new StringBuilder();
    private String nativeSpeechLastPartial = "";
    private final Handler mainHandler = new Handler(Looper.getMainLooper());

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FrameLayout root = new FrameLayout(this);
        webView = new WebView(this);
        offlineView = buildOfflineView();
        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setMax(100);
        progressBar.setVisibility(View.GONE);

        root.addView(webView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
        ));
        root.addView(progressBar, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                dp(4)
        ));
        root.addView(offlineView, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT
        ));
        setContentView(root);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            settings.setSafeBrowsingEnabled(true);
        }

        webView.addJavascriptInterface(new NativeBridge(), "AnpsNative");

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                progressBar.setProgress(newProgress);
                progressBar.setVisibility(newProgress >= 100 ? View.GONE : View.VISIBLE);
            }

            @Override
            public void onPermissionRequest(PermissionRequest request) {
                runOnUiThread(() -> handleWebPermissionRequest(request));
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return false;
            }

            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                offlineView.setVisibility(View.GONE);
                webView.setVisibility(View.VISIBLE);
                progressBar.setVisibility(View.VISIBLE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                progressBar.setVisibility(View.GONE);
                offlineView.setVisibility(View.GONE);
                webView.setVisibility(View.VISIBLE);
                sendPushTokenToWeb();
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    showOfflineView();
                }
            }
        });

        requestNotificationPermission();
        refreshPushToken();
        loadApp();
    }

    private class NativeBridge {
        @JavascriptInterface
        public String getPushToken() {
            return currentPushToken == null ? "" : currentPushToken;
        }

        @JavascriptInterface
        public boolean hasNativeSpeechInput() {
            return true;
        }

        @JavascriptInterface
        public void startVoiceInput() {
            runOnUiThread(() -> startNativeSpeechRecognition());
        }

        @JavascriptInterface
        public void stopVoiceInput() {
            runOnUiThread(() -> stopNativeSpeechRecognition());
        }
    }

    private void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= 33 && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, 201);
        }
    }

    private void handleWebPermissionRequest(PermissionRequest request) {
        if (request == null || !isAudioCaptureRequest(request)) {
            if (request != null) request.deny();
            return;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
                && checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            pendingAudioPermissionRequest = request;
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, 202);
            return;
        }
        request.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
    }

    private boolean isAudioCaptureRequest(PermissionRequest request) {
        for (String resource : request.getResources()) {
            if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(resource)) {
                return true;
            }
        }
        return false;
    }

    private void startNativeSpeechRecognition() {
        if (!SpeechRecognizer.isRecognitionAvailable(this)) {
            sendNativeSpeechResult(false, "", "Voice input is not available on this phone.");
            return;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
                && checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
            pendingNativeSpeechStart = true;
            requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, 202);
            return;
        }
        nativeSpeechDoneRequested = false;
        nativeSpeechCompleted = false;
        nativeSpeechBuffer = new StringBuilder();
        nativeSpeechLastPartial = "";
        beginNativeSpeechCycle();
    }

    private void beginNativeSpeechCycle() {
        if (nativeSpeechCompleted) {
            return;
        }
        if (speechRecognizer != null) {
            speechRecognizer.destroy();
        }
        speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this);
        speechRecognizer.setRecognitionListener(new RecognitionListener() {
            @Override public void onReadyForSpeech(Bundle params) {}
            @Override public void onBeginningOfSpeech() {}
            @Override public void onRmsChanged(float rmsdB) {}
            @Override public void onBufferReceived(byte[] buffer) {}
            @Override public void onEndOfSpeech() {}
            @Override
            public void onPartialResults(Bundle partialResults) {
                ArrayList<String> matches = partialResults.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                nativeSpeechLastPartial = matches == null || matches.isEmpty() ? "" : matches.get(0);
                sendNativeSpeechPartial(nativeSpeechLastPartial);
            }
            @Override public void onEvent(int eventType, Bundle params) {}

            @Override
            public void onError(int error) {
                if (nativeSpeechCompleted) {
                    return;
                }
                if (nativeSpeechDoneRequested) {
                    finishNativeSpeechWithBufferOrError(speechErrorMessage(error));
                    return;
                }
                if (error == SpeechRecognizer.ERROR_NO_MATCH
                        || error == SpeechRecognizer.ERROR_SPEECH_TIMEOUT
                        || error == SpeechRecognizer.ERROR_CLIENT) {
                    restartNativeSpeechCycle();
                    return;
                }
                nativeSpeechCompleted = true;
                sendNativeSpeechResult(false, "", speechErrorMessage(error));
            }

            @Override
            public void onResults(Bundle results) {
                if (nativeSpeechCompleted) {
                    return;
                }
                ArrayList<String> matches = results.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION);
                String text = matches == null || matches.isEmpty() ? "" : matches.get(0);
                appendNativeSpeechText(text);
                if (nativeSpeechDoneRequested) {
                    finishNativeSpeechWithBufferOrError("No voice detected. Tap Start Mic and speak closer to the phone.");
                } else {
                    restartNativeSpeechCycle();
                }
            }
        });

        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "en-IN");
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "en-IN");
        intent.putExtra(RecognizerIntent.EXTRA_ONLY_RETURN_LANGUAGE_PREFERENCE, false);
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Speak fee command");
        intent.putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true);
        intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, 6000);
        intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS, 6000);
        intent.putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_MINIMUM_LENGTH_MILLIS, 20000);
        speechRecognizer.startListening(intent);
    }

    private void stopNativeSpeechRecognition() {
        nativeSpeechDoneRequested = true;
        appendNativeSpeechText(nativeSpeechLastPartial);
        if (speechRecognizer != null) {
            speechRecognizer.stopListening();
            mainHandler.postDelayed(() -> {
                if (nativeSpeechDoneRequested && !nativeSpeechCompleted && nativeSpeechBuffer.length() > 0) {
                    finishNativeSpeechWithBufferOrError("");
                }
            }, 1200);
        } else {
            finishNativeSpeechWithBufferOrError("No voice detected. Tap Start Mic and speak closer to the phone.");
        }
    }

    private void restartNativeSpeechCycle() {
        mainHandler.postDelayed(() -> {
            if (!nativeSpeechDoneRequested && !nativeSpeechCompleted) {
                beginNativeSpeechCycle();
            }
        }, 150);
    }

    private void appendNativeSpeechText(String text) {
        String cleanText = text == null ? "" : text.trim();
        if (cleanText.isEmpty()) {
            return;
        }
        String currentText = nativeSpeechBuffer.toString().trim();
        if (cleanText.equalsIgnoreCase(currentText) || currentText.toLowerCase().endsWith(cleanText.toLowerCase())) {
            return;
        }
        if (nativeSpeechBuffer.length() > 0) {
            nativeSpeechBuffer.append(" ");
        }
        nativeSpeechBuffer.append(cleanText);
    }

    private void finishNativeSpeechWithBufferOrError(String fallbackError) {
        if (nativeSpeechCompleted) {
            return;
        }
        nativeSpeechCompleted = true;
        if (speechRecognizer != null) {
            speechRecognizer.destroy();
            speechRecognizer = null;
        }
        String finalText = nativeSpeechBuffer.toString().trim();
        if (finalText.isEmpty()) {
            sendNativeSpeechResult(false, "", fallbackError == null || fallbackError.isEmpty()
                    ? "No voice detected. Tap Start Mic and speak closer to the phone."
                    : fallbackError);
            return;
        }
        sendNativeSpeechResult(true, finalText, "");
    }

    private String speechErrorMessage(int error) {
        switch (error) {
            case SpeechRecognizer.ERROR_AUDIO:
                return "Microphone audio error. Check mic permission and try again.";
            case SpeechRecognizer.ERROR_CLIENT:
                return "Voice input stopped. Tap Start Mic and try again.";
            case SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS:
                return "Microphone permission blocked. Allow microphone access, then try again.";
            case SpeechRecognizer.ERROR_NETWORK:
            case SpeechRecognizer.ERROR_NETWORK_TIMEOUT:
                return "Voice service could not connect. Check internet and try again.";
            case SpeechRecognizer.ERROR_NO_MATCH:
            case SpeechRecognizer.ERROR_SPEECH_TIMEOUT:
                return "No voice detected. Tap Start Mic and speak closer to the phone.";
            case SpeechRecognizer.ERROR_RECOGNIZER_BUSY:
                return "Mic is busy. Wait a moment and try again.";
            case SpeechRecognizer.ERROR_SERVER:
                return "Voice service is temporarily unavailable. Try again.";
            default:
                return "Voice input failed. Type the command manually.";
        }
    }

    private void sendNativeSpeechResult(boolean ok, String text, String error) {
        String script = "window.onAnpsNativeSpeechResult && window.onAnpsNativeSpeechResult({"
                + "ok:" + ok
                + ",text:" + JSONObject.quote(text == null ? "" : text)
                + ",error:" + JSONObject.quote(error == null ? "" : error)
                + "});";
        webView.post(() -> webView.evaluateJavascript(script, null));
    }

    private void sendNativeSpeechPartial(String text) {
        String cleanText = text == null ? "" : text.trim();
        if (cleanText.isEmpty()) {
            return;
        }
        String script = "window.onAnpsNativeSpeechPartial && window.onAnpsNativeSpeechPartial("
                + JSONObject.quote(cleanText)
                + ");";
        webView.post(() -> webView.evaluateJavascript(script, null));
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode != 202) {
            return;
        }
        PermissionRequest request = pendingAudioPermissionRequest;
        boolean shouldStartNativeSpeech = pendingNativeSpeechStart;
        pendingAudioPermissionRequest = null;
        pendingNativeSpeechStart = false;
        boolean granted = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
        if (shouldStartNativeSpeech) {
            if (granted) {
                startNativeSpeechRecognition();
            } else {
                sendNativeSpeechResult(false, "", "Microphone permission blocked. Allow microphone access, then try again.");
            }
        }
        if (request == null) {
            return;
        }
        if (granted) {
            request.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
        } else {
            request.deny();
        }
    }

    @Override
    protected void onDestroy() {
        if (speechRecognizer != null) {
            speechRecognizer.destroy();
            speechRecognizer = null;
        }
        super.onDestroy();
    }

    private void refreshPushToken() {
        SharedPreferences prefs = getSharedPreferences("anps_push", Context.MODE_PRIVATE);
        currentPushToken = prefs.getString("token", "");
        FirebaseMessaging.getInstance().getToken().addOnCompleteListener(task -> {
            if (!task.isSuccessful() || task.getResult() == null) {
                return;
            }
            currentPushToken = task.getResult();
            prefs.edit().putString("token", currentPushToken).apply();
            sendPushTokenToWeb();
        });
    }

    private void sendPushTokenToWeb() {
        if (webView == null || currentPushToken == null || currentPushToken.trim().isEmpty()) {
            return;
        }
        String escapedToken = currentPushToken
                .replace("\\", "\\\\")
                .replace("'", "\\'");
        webView.post(() -> webView.evaluateJavascript(
                "window.registerNativePushToken && window.registerNativePushToken('" + escapedToken + "');",
                null
        ));
    }

    private void loadApp() {
        if (!isOnline()) {
            showOfflineView();
            return;
        }
        offlineView.setVisibility(View.GONE);
        webView.setVisibility(View.VISIBLE);
        progressBar.setVisibility(View.VISIBLE);
        webView.loadUrl(BuildConfig.APP_URL);
    }

    private LinearLayout buildOfflineView() {
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setGravity(android.view.Gravity.CENTER);
        layout.setPadding(dp(24), dp(24), dp(24), dp(24));
        layout.setBackgroundColor(Color.rgb(248, 250, 252));
        layout.setVisibility(View.GONE);

        TextView title = new TextView(this);
        title.setText(R.string.offline_title);
        title.setTextColor(Color.rgb(23, 55, 97));
        title.setTextSize(20);
        title.setGravity(android.view.Gravity.CENTER);

        TextView message = new TextView(this);
        message.setText(R.string.offline_message);
        message.setTextColor(Color.rgb(71, 85, 105));
        message.setTextSize(15);
        message.setGravity(android.view.Gravity.CENTER);
        message.setPadding(0, dp(10), 0, dp(20));

        Button retryButton = new Button(this);
        retryButton.setText(R.string.retry);
        retryButton.setTextColor(Color.WHITE);
        retryButton.setBackgroundColor(Color.rgb(23, 55, 97));
        retryButton.setOnClickListener(view -> loadApp());

        layout.addView(title, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        ));
        layout.addView(message, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        ));
        layout.addView(retryButton, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        ));
        return layout;
    }

    private void showOfflineView() {
        progressBar.setVisibility(View.GONE);
        webView.setVisibility(View.GONE);
        offlineView.setVisibility(View.VISIBLE);
    }

    private boolean isOnline() {
        ConnectivityManager manager = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        if (manager == null) return false;
        Network network = manager.getActiveNetwork();
        if (network == null) return false;
        NetworkCapabilities capabilities = manager.getNetworkCapabilities(network);
        return capabilities != null && capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
    }

    private int dp(int value) {
        return (int) (value * getResources().getDisplayMetrics().density + 0.5f);
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }
}

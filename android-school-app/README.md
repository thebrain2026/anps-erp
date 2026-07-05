# ANPS School Android App

This module wraps the hosted Alfred Nobel Public School student app in a native Android WebView shell so it can be built as an Android App Bundle for Google Play.

## Before building

1. Deploy `school-erp-prototype/` and its backend to a public HTTPS domain.
2. Update `BuildConfig.APP_URL` in `app/build.gradle`:

```gradle
buildConfigField "String", "APP_URL", "\"https://anps.thebrainerp.com/anps-mobile-app.html\""
```

3. If the backend API is on a different domain, set the `school-api-base` meta tag in `school-erp-prototype/index.html` to that HTTPS API origin.

## Build for Google Play

Open this folder in Android Studio and use **Build > Generate Signed App Bundle / APK**.

If Gradle is installed locally, you can also run:

```bash
gradle bundleRelease
```

Upload the generated `.aab` from `app/build/outputs/bundle/release/` to Google Play Console.

Google Play will require a signed release, store listing, privacy policy, data safety answers, app icon, screenshots and school/organization details.

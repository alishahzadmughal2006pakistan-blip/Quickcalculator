# Android Integration Guide (AdMob & RevenueCat)

This file contains the complete code snippets you need to copy and paste into your Android Studio project. Follow these instructions exactly to connect your native Android app to the web app's features.

**Your Package Name:** Make sure to replace `com.yourdomain.quickcalculator` with your app's actual package name in all the files.

---

## 1. Add Dependencies (`app/build.gradle.kts`)

Open your `app` level `build.gradle.kts` file and add these lines to the `dependencies` block.

```kotlin
// In your app/build.gradle.kts file

dependencies {

    // ... your other dependencies like core-ktx, appcompat, etc.

    // RevenueCat for In-App Purchases
    implementation("com.revenuecat.purchases:purchases:7.7.0")
    
    // AdMob for Ads
    implementation("com.google.android.gms:play-services-ads:23.0.0")
}
```

---

## 2. Configure Android Manifest (`app/src/main/AndroidManifest.xml`)

Copy and paste the following, making sure to replace the existing `<application>` tag. This adds internet permissions and your AdMob App ID.

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Required permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="com.android.vending.BILLING" />

    <application
        android:name=".MainApplication"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.QuickCalculator"
        tools:targetApi="31">

        <!-- Your AdMob App ID -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-6877561239291582~4136825863"/>

        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
```

---

## 3. Create Application Class (`app/src/main/java/com/yourdomain/quickcalculator/MainApplication.kt`)

Create a new Kotlin file named `MainApplication.kt` in your main package folder and paste this code. This initializes RevenueCat when the app starts.

```kotlin
package com.yourdomain.quickcalculator

import android.app.Application
import com.revenuecat.purchases.Purchases
import com.revenuecat.purchases.PurchasesConfiguration

class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // Your RevenueCat Public Google API Key
        val builder = PurchasesConfiguration.Builder(this, "goog_YDCdABbihLyFKRtAuJLBioecDWZ")
        Purchases.configure(builder.build())
    }
}
```
---

## 4. Set Up the WebView (`app/src/main/java/com/yourdomain/quickcalculator/MainActivity.kt`)

Replace the entire contents of your `MainActivity.kt` with this code. It sets up the WebView, the native banner ad, and the JavaScript bridge.

```kotlin
package com.yourdomain.quickcalculator

import android.os.Bundle
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.MobileAds
import com.yourdomain.quickcalculator.R // Make sure this import is correct

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var adView: AdView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Initialize AdMob
        MobileAds.initialize(this) {}

        // --- WebView Setup ---
        webView = findViewById(R.id.webview)
        // IMPORTANT: Enable JavaScript
        webView.settings.javaScriptEnabled = true
        // Add the interface, naming it "Android" to match window.Android in the JS
        webView.addJavascriptInterface(WebAppInterface(this, webView), "Android")
        // Load your Firebase Hosting URL
        webView.loadUrl("https://studio-2681875480-fe389.web.app")

        // --- Banner Ad Setup ---
        adView = findViewById(R.id.adView)
        val adRequest = AdRequest.Builder().build()
        adView.loadAd(adRequest)
    }

    // Handle back press to navigate in WebView history
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
```

And for `res/layout/activity_main.xml`, use this:
```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_above="@+id/adView" />

    <com.google.android.gms.ads.AdView
        android:id="@+id/adView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:layout_centerHorizontal="true"
        app:adSize="BANNER"
        app:adUnitId="ca-app-pub-6877561239291582/1254871023">
    </com.google.android.gms.ads.AdView>

</RelativeLayout>
```
---

## 5. Create the Bridge (`app/src/main/java/com/yourdomain/quickcalculator/WebAppInterface.kt`)

Create a new Kotlin file named `WebAppInterface.kt` and paste this code. This is the bridge that handles all communication from the web app.

```kotlin
package com.yourdomain.quickcalculator

import android.app.Activity
import android.webkit.JavascriptInterface
import android.webkit.WebView
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.admanager.AdManagerAdRequest
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
import com.revenuecat.purchases.Package
import com.revenuecat.purchases.Purchases
import com.revenuecat.purchases.getOfferingsWith
import com.revenuecat.purchases.purchasePackageWith
import com.revenuecat.purchases.restorePurchasesWith


class WebAppInterface(private val activity: Activity, private val webView: WebView) {

    // --- Helper functions to send events back to the WebView ---
    private fun dispatchJavaScriptEvent(eventName: String) {
        val js = "window.dispatchEvent(new Event('$eventName'));"
        webView.post { webView.evaluateJavascript(js, null) }
    }

    // --- RevenueCat Methods ---

    @JavascriptInterface
    fun purchasePremium() {
        activity.runOnUiThread {
            Purchases.sharedInstance.getOfferingsWith(
                onError = { /* Handle error, maybe dispatch a 'purchaseFailed' event */ },
                onSuccess = { offerings ->
                    offerings.current?.availablePackages?.firstOrNull()?.let { packageToPurchase ->
                        Purchases.sharedInstance.purchasePackageWith(
                            activity,
                            packageToPurchase,
                            onError = { error, userCancelled ->
                                if (!userCancelled) { /* Handle purchase error */ }
                            },
                            onSuccess = { _, customerInfo ->
                                if (customerInfo.entitlements.all["premium"]?.isActive == true) {
                                    dispatchJavaScriptEvent("purchaseSuccess")
                                }
                            }
                        )
                    }
                }
            )
        }
    }

    @JavascriptInterface
    fun restorePurchase() {
        activity.runOnUiThread {
            Purchases.sharedInstance.restorePurchasesWith(
                onError = { /* Handle error */ },
                onSuccess = { customerInfo ->
                    if (customerInfo.entitlements.all["premium"]?.isActive == true) {
                        dispatchJavaScriptEvent("purchaseRestored")
                    } else {
                        dispatchJavaScriptEvent("noPurchaseFound")
                    }
                }
            )
        }
    }
    
    // --- AdMob Rewarded Ad Method ---

    @JavascriptInterface
    fun showRewardedAd() {
        activity.runOnUiThread {
            val adRequest = AdManagerAdRequest.Builder().build()
            RewardedAd.load(activity, "ca-app-pub-6877561239291582/9245041684", adRequest, object : RewardedAdLoadCallback() {
                override fun onAdLoaded(ad: RewardedAd) {
                    ad.show(activity) {
                        // User earned the reward
                        dispatchJavaScriptEvent("rewardedAdCompleted")
                    }
                }

                override fun onAdFailedToLoad(adError: LoadAdError) {
                    // Ad failed to load. Notify the web app.
                    dispatchJavaScriptEvent("rewardedAdFailed")
                }
            })
        }
    }
}
```

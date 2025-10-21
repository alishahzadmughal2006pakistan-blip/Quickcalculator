# Android Integration Guide (AdMob & RevenueCat)

This file contains your specific IDs and a guide for integrating them into your native Android project.

## 1. AdMob Configuration

### App ID

Your AdMob App ID needs to be placed in your `AndroidManifest.xml` file.

**Your App ID:** `ca-app-pub-6877561239291582~4136825863`

**File:** `app/src/main/AndroidManifest.xml`

Add a `<meta-data>` tag within the `<application>` tag as shown below:

```xml
<manifest>
    <application>
        <!-- ... other tags -->

        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-6877561239291582~4136825863"/>

    </application>
</manifest>
```

### Ad Unit IDs

These IDs are used in your Kotlin/Java code to load specific ads.

#### Banner Ad

This ad should be a native `AdView` in your main activity's layout file, positioned at the bottom of the screen (below the WebView).

**Your Banner Ad Unit ID:** `ca-app-pub-6877561239291582/1254871023`

**Example (in your Activity):**
```kotlin
// In your MainActivity.kt or equivalent
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdView
// ...

lateinit var mAdView : AdView
// ...

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    // ...
    mAdView = findViewById(R.id.adView) // Make sure you have an AdView with this ID in your layout XML
    val adRequest = AdRequest.Builder().build()
    mAdView.loadAd(adRequest)
}
```

#### Rewarded Ad

This is loaded and shown from your `WebAppInterface` when the web app calls `window.Android.showRewardedAd()`.

**Your Rewarded Ad Unit ID:** `ca-app-pub-6877561239291582/9245041684`

**Example (in your `WebAppInterface.kt`):**
```kotlin
// In your WebAppInterface.kt or wherever you handle the rewarded ad logic
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
// ...

@JavascriptInterface
fun showRewardedAd() {
    // Make sure to run UI-related code on the main thread
    activity.runOnUiThread {
        val adRequest = AdRequest.Builder().build()
        RewardedAd.load(activity, "ca-app-pub-6877561239291582/9245041684", adRequest, object : RewardedAdLoadCallback() {
            override fun onAdLoaded(ad: RewardedAd) {
                ad.show(activity) {
                    // This block is called when the user earns the reward
                    dispatchRewardGranted() // Notify the web app
                }
            }

            override fun onAdFailedToLoad(adError: LoadAdError) {
                // Ad failed to load. Notify the web app so it can show a toast.
                dispatchAdFailed()
            }
        })
    }
}
```

## 2. RevenueCat Configuration

Your RevenueCat API keys should be configured according to their official documentation, usually during your Application's `onCreate` method. The `WebAppInterface` will then call your purchase and restore logic that you build using the RevenueCat SDK.

# Android Integration Guide (AdMob & RevenueCat)

This file contains your specific IDs and a guide for integrating them into your **native Android project (Kotlin/Java)**.

**Important:** These keys and code snippets belong in your Android Studio project, not in the web application code. The web app calls functions like `window.Android.showRewardedAd()`, and your native Android code must listen for these calls and use the keys below to show the actual ads.

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

To configure RevenueCat, you need to initialize their SDK when your Android application starts and then handle the purchase/restore calls from the WebView.

**Your Public Google API Key:** `goog_YDCdABbihLyFKRtAuJLBioecDWZ`

### Step 2.1: Initialize the SDK

This is typically done in your `Application` class. If you don't have one, you'll need to create it and register it in your `AndroidManifest.xml`.

**File:** `(YourApplication).kt`
```kotlin
import android.app.Application
import com.revenuecat.purchases.Purchases
import com.revenuecat.purchases.PurchasesConfiguration

class MainApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        val builder = PurchasesConfiguration.Builder(this, "goog_YDCdABbihLyFKRtAuJLBioecDWZ")
        Purchases.configure(builder.build())
    }
}
```
**File:** `AndroidManifest.xml` (make sure to add the `android:name` attribute)
```xml
<application
    android:name=".MainApplication"
    ...>
    <!-- ... -->
</application>
```

### Step 2.2: Implement Purchase Logic in `WebAppInterface`

Your `WebAppInterface.kt` will use the RevenueCat SDK to handle calls from the web app.

**File:** `WebAppInterface.kt`
```kotlin
// In your WebAppInterface.kt
import android.app.Activity
import android.webkit.JavascriptInterface
import com.revenuecat.purchases.Purchases
import com.revenuecat.purchases.getOfferingsWith
import com.revenuecat.purchases.purchasePackageWith
import com.revenuecat.purchases.restorePurchasesWith

// ... (assuming your WebAppInterface has access to the main Activity)
class WebAppInterface(private val activity: Activity, ...) {

    @JavascriptInterface
    fun purchasePremium() {
        // Run on the main UI thread
        activity.runOnUiThread {
            Purchases.sharedInstance.getOfferingsWith(
                onError = { /* Handle error */ },
                onSuccess = { offerings ->
                    offerings.current?.let {
                        // Assuming you have a package in your "default" offering
                        val packageToPurchase = it.availablePackages.firstOrNull()
                        if (packageToPurchase != null) {
                            Purchases.sharedInstance.purchasePackageWith(
                                activity,
                                packageToPurchase,
                                onError = { error, userCancelled ->
                                    if (!userCancelled) {
                                        // Handle error, maybe dispatch a 'purchaseFailed' event
                                    }

                                },
                                onSuccess = { _, customerInfo ->
                                    // Check if the user now has the 'premium' entitlement
                                    if (customerInfo.entitlements.all["premium"]?.isActive == true) {
                                        dispatchPurchaseSuccess()
                                    }
                                }
                            )
                        }
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
                        dispatchPurchaseRestored()
                    } else {
                        dispatchNoPurchaseFound()
                    }
                }
            )
        }
    }
    
    // ... include the dispatch functions here (dispatchPurchaseSuccess, etc.)
}
```

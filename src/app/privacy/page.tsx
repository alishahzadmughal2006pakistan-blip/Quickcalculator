
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-muted/40 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
          <ArrowLeft size={16} />
          Back to Calculator
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Privacy Policy for Quick Calculator+</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm sm:prose-base max-w-none">
            <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
            
            <Separator className="my-4" />

            <p>This Privacy Policy describes how your personal information is handled in the Quick Calculator+ mobile application (the "App").</p>

            <h3 className="font-semibold mt-4">1. Information We Collect</h3>
            <p>Quick Calculator+ is designed to respect your privacy. We do not collect, store, or transmit any personally identifiable information (PII) from your device.</p>
            <ul>
                <li><strong>Calculation Data:</strong> All calculations you perform are processed on your device and are not sent to our servers. Calculation history is stored locally on your device and can be cleared at any time from the settings.</li>
                <li><strong>In-App Purchases:</strong> If you choose to make a one-time purchase to upgrade to the premium version, the transaction is processed securely through the Google Play Store. We receive transaction confirmation but do not collect or store your payment details, such as credit card numbers.</li>
                <li><strong>Advertising:</strong> The free version of our App uses Google AdMob to display advertisements. AdMob may collect data to provide personalized ads. This may include your device's advertising ID. You can manage your ad personalization settings in your device's settings. Please refer to Google's Privacy Policy for more information on how they handle data.</li>
            </ul>

            <h3 className="font-semibold mt-4">2. How We Use Your Information</h3>
            <p>Since we do not collect personal information, we do not use it for any purpose. The non-personal, aggregated data collected by third-party services like Google AdMob is used for:</p>
            <ul>
                <li>Serving relevant advertisements in the free version of the App.</li>
                <li>Monitoring app performance and identifying crashes to improve stability.</li>
            </ul>
            
            <h3 className="font-semibold mt-4">3. Data Storage</h3>
            <p>All app-related data, such as your calculation history and premium status, is stored exclusively on your device. If you uninstall the app, this data will be deleted.</p>

            <h3 className="font-semibold mt-4">4. Third-Party Services</h3>
            <p>We rely on the following third-party services, which have their own privacy policies:</p>
            <ul>
                <li><strong>Google Play Services (for In-App Billing):</strong> Manages the one-time purchase to unlock the premium version.</li>
                <li><strong>Google AdMob (for Ads):</strong> Displays ads in the free version of the App.</li>
            </ul>

            <h3 className="font-semibold mt-4">5. Your Choices</h3>
            <ul>
                <li><strong>Premium Upgrade:</strong> You can choose to upgrade to the premium version of the App to remove all advertisements.</li>
                <li><strong>Clear History:</strong> You can clear your entire calculation history at any time from the App's settings menu.</li>
            </ul>

            <h3 className="font-semibold mt-4">6. Changes to This Privacy Policy</h3>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>

            <h3 className="font-semibold mt-4">7. Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us at [Your Support Email Address].</p>

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;

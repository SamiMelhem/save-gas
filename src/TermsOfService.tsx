import { useNavigate } from "react-router-dom";

export function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-blue-500 hover:text-blue-600"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        
        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using SaveGas, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Description of Service</h2>
            <p>SaveGas provides real-time information about gas prices and station locations. While we strive for accuracy, we cannot guarantee the completeness or accuracy of the information provided.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. User Responsibilities</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must provide accurate location information to use the service</li>
              <li>You agree not to misuse or attempt to manipulate the provided data</li>
              <li>You are responsible for maintaining the confidentiality of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Data Usage</h2>
            <p>We collect and use location data to provide you with relevant gas price information. Your data is handled in accordance with our Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Service Availability</h2>
            <p>We strive to provide uninterrupted service, but we cannot guarantee that the service will be available at all times. We reserve the right to modify or discontinue the service at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Third-Party Services</h2>
            <p>Our service integrates with third-party services including Google Maps and gas price data providers. Your use of these services is subject to their respective terms of service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Limitation of Liability</h2>
            <p>SaveGas is not liable for any damages arising from your use of the service or any inaccuracies in the provided information.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">8. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the service after such modifications constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">9. Contact Information</h2>
            <p>For any questions regarding these terms, please contact us at support@savegas.com</p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
} 
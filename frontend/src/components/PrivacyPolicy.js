import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12">
        <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        
        <p className="text-gray-600 mb-4">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to Buzzed Out - Pass the Card ("we," "our," or "us"). This Privacy Policy explains 
              how we collect, use, and protect your information when you use our online multiplayer game.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-2">Information You Provide</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Player names (used only for gameplay, not stored permanently)</li>
              <li>Game codes (temporary, session-based)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-2">Automatically Collected Information</h3>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Usage data and game interactions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <h3 className="text-xl font-semibold mb-2">Google AdSense</h3>
            <p className="text-gray-700 mb-4">
              We use Google AdSense to display advertisements on our website. Google AdSense uses cookies 
              and similar technologies to serve ads based on your prior visits to our website or other websites.
            </p>
            <p className="text-gray-700 mb-4">
              You can opt out of personalized advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                Google's Ad Settings
              </a>.
            </p>

            <h3 className="text-xl font-semibold mb-2">Google Analytics</h3>
            <p className="text-gray-700 mb-4">
              We use Google Analytics to understand how visitors interact with our website. This helps us 
              improve our services. Google Analytics uses cookies to collect anonymous usage data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>To provide and maintain our game service</li>
              <li>To improve user experience</li>
              <li>To analyze usage patterns</li>
              <li>To display relevant advertisements</li>
              <li>To ensure game functionality and prevent abuse</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Storage</h2>
            <p className="text-gray-700 mb-4">
              Game data (player names, game codes, scores) is stored temporarily during active game sessions 
              and is not permanently stored on our servers. Once a game ends, this data is deleted.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p className="text-gray-700 mb-4">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Maintain game sessions</li>
              <li>Remember your preferences</li>
              <li>Analyze website traffic</li>
              <li>Serve personalized advertisements</li>
            </ul>
            <p className="text-gray-700 mb-4">
              You can control cookies through your browser settings. However, disabling cookies may affect 
              the functionality of our game.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="text-gray-700 mb-4">
              Our game is not intended for children under 13. We do not knowingly collect personal information 
              from children under 13. If you believe we have collected information from a child under 13, 
              please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-gray-700 mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-gray-700 mb-4">
              <li>Access your personal information</li>
              <li>Request deletion of your data</li>
              <li>Opt out of personalized advertising</li>
              <li>Disable cookies in your browser</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-700 mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-gray-700">
              Website: <a href="https://buzzed-out.onrender.com" className="text-blue-600 hover:underline">buzzed-out.onrender.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

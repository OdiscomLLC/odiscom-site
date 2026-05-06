export default function PrivacyPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">
        Effective Date: April 23, 2026<br />
        Last Updated: April 23, 2026
      </p>

      <div className="space-y-8 text-sm leading-relaxed">
        <p>
          Odiscom LLC ("Odiscom," "we," "us," or "our") respects your privacy.
          This Privacy Policy explains how we collect, use, disclose, and safeguard
          information when you visit odiscom.com (the "Site") or interact with our services,
          including our Microsoft 365 sign-in portal.
        </p>

        <section>
          <h2 className="font-semibold text-lg mb-2">1. Information We Collect</h2>
          <p className="font-medium">Information you provide directly:</p>
          <ul className="list-disc ml-6">
            <li>Name, email address, phone number, company, and submitted information</li>
            <li>Project-related information</li>
            <li>Microsoft 365 account credentials and profile data</li>
          </ul>

          <p className="font-medium mt-4">Information collected automatically:</p>
          <ul className="list-disc ml-6">
            <li>IP address, browser type, operating system</li>
            <li>Usage data, pages viewed, timestamps</li>
          </ul>

          <p className="font-medium mt-4">Information from third parties:</p>
          <ul className="list-disc ml-6">
            <li>Microsoft authentication data</li>
            <li>Public business data relevant to projects</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">2. How We Use Information</h2>
          <ul className="list-disc ml-6">
            <li>Provide services and respond to inquiries</li>
            <li>Manage engineering and consulting work</li>
            <li>Authenticate users</li>
            <li>Meet legal and licensing obligations</li>
            <li>Maintain system security</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">3. How We Share Information</h2>
          <ul className="list-disc ml-6">
            <li>Service providers (Microsoft 365, cloud systems)</li>
            <li>Clients and project partners</li>
            <li>Legal authorities when required</li>
            <li>Business successors</li>
          </ul>
          <p className="mt-2">We do not sell personal information.</p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">4. Data Security</h2>
          <p>
            We use administrative, technical, and physical safeguards to protect
            information. However, no system is completely secure.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">5. Data Retention</h2>
          <p>
            Information is retained as required for business operations,
            legal compliance, and engineering recordkeeping obligations.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">6. Cookies</h2>
          <p>
            We use cookies for functionality and analytics. You can control
            cookies via your browser settings.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">7. Your Rights</h2>
          <p>
            You may request access, correction, or deletion of your data.
            Texas residents may have additional rights under applicable law.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">8. Children's Privacy</h2>
          <p>
            We do not knowingly collect data from children under 13.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">9. Changes</h2>
          <p>
            Updates will be reflected by the “Last Updated” date.
          </p>
        </section>

        <section>
          <h2 className="font-semibold text-lg mb-2">10. Contact</h2>
          <p>
            Odiscom LLC<br />
            League City, Texas<br />
            Email: admin@odiscom.com<br />
            https://odiscom.com
          </p>
        </section>
      </div>
    </main>
  );
}
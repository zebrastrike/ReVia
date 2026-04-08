import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for ReVia Research Supply LLC. Learn how we collect, use, and protect your personal information when you visit our site or purchase research peptides.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <h1>Privacy Policy</h1>
      <p className="text-sm text-gray-500">
        Last Updated: April 2026
      </p>
      <p>
        ReVia Research Supply LLC (&quot;ReVia,&quot; &quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;) is committed to protecting the
        privacy of our customers and website visitors. This Privacy Policy
        describes how we collect, use, disclose, and safeguard your personal
        information when you visit our website at revialife.com (the
        &quot;Site&quot;) or make a purchase. By using the Site, you consent to
        the practices described in this policy.
      </p>

      <h2>1. Information We Collect</h2>

      <h3>1.1 Personal Information</h3>
      <p>We may collect the following personal information when you create an account, place an order, or contact us:</p>
      <ul>
        <li>Full name</li>
        <li>Email address</li>
        <li>Phone number</li>
        <li>Billing and shipping address</li>
        <li>Institutional or organizational affiliation</li>
        <li>Account login credentials</li>
      </ul>

      <h3>1.2 Payment Information</h3>
      <p>
        When you make a purchase, we collect payment-related information such as
        credit or debit card numbers, billing address, and transaction details.
        Payment information is processed by our third-party payment processors
        and is not stored on our servers.
      </p>

      <h3>1.3 Browsing and Usage Data</h3>
      <p>We automatically collect certain information when you visit the Site, including:</p>
      <ul>
        <li>IP address and approximate geolocation</li>
        <li>Browser type and version</li>
        <li>Operating system</li>
        <li>Referring website or URL</li>
        <li>Pages visited and time spent on each page</li>
        <li>Click patterns and navigation behavior</li>
        <li>Device identifiers</li>
      </ul>

      <h3>1.4 Cookies and Tracking Technologies</h3>
      <p>
        We use cookies, web beacons, and similar technologies to enhance your
        experience, analyze usage patterns, and deliver relevant content. For
        detailed information, please refer to our{" "}
        <a href="/policies/cookies" className="text-blue-600 hover:underline">
          Cookie Policy
        </a>
        .
      </p>

      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect for the following purposes:</p>
      <ul>
        <li>Processing and fulfilling your orders</li>
        <li>Communicating with you about your account, orders, and inquiries</li>
        <li>Providing customer support</li>
        <li>Improving our Site, products, and services</li>
        <li>Personalizing your experience on the Site</li>
        <li>Sending transactional emails (order confirmations, shipping updates)</li>
        <li>Detecting and preventing fraud and unauthorized access</li>
        <li>Complying with legal obligations</li>
        <li>Conducting analytics and market research</li>
      </ul>

      <h2>3. Third-Party Sharing</h2>
      <p>
        We do not sell your personal information to third parties. We may share
        your information with the following categories of service providers who
        assist us in operating the Site and conducting our business:
      </p>
      <ul>
        <li>
          <strong>Payment processors:</strong> To securely process your
          transactions.
        </li>
        <li>
          <strong>Shipping carriers:</strong> To deliver your orders (e.g.,
          USPS, UPS, FedEx).
        </li>
        <li>
          <strong>Analytics providers:</strong> To analyze Site usage and
          performance (e.g., Google Analytics).
        </li>
        <li>
          <strong>Email service providers:</strong> To send transactional and
          promotional communications.
        </li>
        <li>
          <strong>Cloud hosting providers:</strong> To host and maintain the
          Site infrastructure.
        </li>
      </ul>
      <p>
        We may also disclose your information when required by law, to respond
        to legal process, to protect our rights and safety, or in connection
        with a merger, acquisition, or sale of assets.
      </p>

      <h2>4. Data Retention</h2>
      <p>
        We retain your personal information for as long as necessary to fulfill
        the purposes for which it was collected, including to satisfy legal,
        accounting, or reporting requirements. Order records and transaction data
        are retained for a minimum of seven (7) years to comply with tax and
        regulatory obligations. You may request deletion of your account data at
        any time, subject to our legal retention requirements.
      </p>

      <h2>5. Data Security</h2>
      <p>
        We implement appropriate technical and organizational security measures
        to protect your personal information against unauthorized access,
        alteration, disclosure, or destruction. These measures include:
      </p>
      <ul>
        <li>SSL/TLS encryption for all data transmitted between your browser and our servers</li>
        <li>PCI-DSS compliant payment processing</li>
        <li>Access controls limiting employee access to personal data on a need-to-know basis</li>
        <li>Regular security assessments and vulnerability testing</li>
        <li>Encrypted data storage</li>
      </ul>
      <p>
        While we strive to protect your information, no method of transmission
        over the Internet or electronic storage is completely secure, and we
        cannot guarantee absolute security.
      </p>

      <h2>6. Your Rights</h2>
      <p>
        Depending on your jurisdiction, you may have the following rights
        regarding your personal information:
      </p>
      <ul>
        <li>
          <strong>Right to Access:</strong> You may request a copy of the
          personal information we hold about you.
        </li>
        <li>
          <strong>Right to Correction:</strong> You may request that we correct
          inaccurate or incomplete personal information.
        </li>
        <li>
          <strong>Right to Deletion:</strong> You may request that we delete
          your personal information, subject to certain legal exceptions.
        </li>
        <li>
          <strong>Right to Data Portability:</strong> You may request your data
          in a structured, commonly used, machine-readable format.
        </li>
        <li>
          <strong>Right to Object:</strong> You may object to certain processing
          of your personal information, including direct marketing.
        </li>
        <li>
          <strong>Right to Restrict Processing:</strong> You may request that we
          restrict the processing of your personal information under certain
          circumstances.
        </li>
      </ul>
      <p>
        To exercise any of these rights, please contact us at{" "}
        <a
          href="mailto:info@revialife.com"
          className="text-blue-600 hover:underline"
        >
          info@revialife.com
        </a>
        . We will respond to your request within thirty (30) days.
      </p>

      <h2>7. GDPR Compliance</h2>
      <p>
        If you are located in the European Economic Area (EEA), the United
        Kingdom, or Switzerland, you have additional rights under the General
        Data Protection Regulation (GDPR). We process your personal data based
        on the following legal bases:
      </p>
      <ul>
        <li>
          <strong>Contractual necessity:</strong> Processing necessary to
          fulfill our contract with you (e.g., order fulfillment).
        </li>
        <li>
          <strong>Legitimate interest:</strong> Processing necessary for our
          legitimate business interests (e.g., fraud prevention, analytics).
        </li>
        <li>
          <strong>Consent:</strong> Where you have provided explicit consent
          (e.g., marketing communications).
        </li>
        <li>
          <strong>Legal obligation:</strong> Processing necessary to comply with
          applicable laws.
        </li>
      </ul>
      <p>
        You may withdraw consent at any time. You also have the right to lodge a
        complaint with your local data protection supervisory authority.
      </p>

      <h2>8. Children&apos;s Privacy</h2>
      <p>
        The Site is not intended for use by individuals under the age of
        eighteen (18). We do not knowingly collect personal information from
        anyone under 18. If we become aware that we have collected personal
        information from a minor, we will take steps to delete that information
        promptly. If you believe we have inadvertently collected information
        from a minor, please contact us immediately at{" "}
        <a
          href="mailto:info@revialife.com"
          className="text-blue-600 hover:underline"
        >
          info@revialife.com
        </a>
        .
      </p>

      <h2>9. International Data Transfers</h2>
      <p>
        If you are accessing the Site from outside the United States, please be
        aware that your information may be transferred to, stored, and processed
        in the United States, where our servers are located. By using the Site,
        you consent to the transfer of your information to the United States,
        which may have data protection laws that differ from those in your
        country. We take appropriate safeguards to ensure your data is protected
        in accordance with this Privacy Policy and applicable law.
      </p>

      <h2>10. Changes to This Privacy Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The &quot;Last
        Updated&quot; date at the top of this page reflects the most recent
        revision. We encourage you to review this Privacy Policy periodically.
        Your continued use of the Site after any changes constitutes your
        acceptance of the revised policy.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        If you have any questions or concerns about this Privacy Policy or our
        data practices, please contact us at:
      </p>
      <address className="not-prose text-sm leading-7 text-gray-700">
        <strong>ReVia Research Supply LLC</strong>
        <br />
        Florida, USA
        <br />
        Email:{" "}
        <a
          href="mailto:info@revialife.com"
          className="text-blue-600 hover:underline"
        >
          info@revialife.com
        </a>
      </address>
    </>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie Policy for ReVia Research Supply LLC. Learn about the cookies and tracking technologies we use on our website.",
};

export default function CookiePolicyPage() {
  return (
    <>
      <h1>Cookie Policy</h1>
      <p className="text-sm text-gray-500">
        Last Updated: April 2026
      </p>
      <p>
        ReVia Research Supply LLC (&quot;ReVia,&quot; &quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;) uses cookies and similar tracking
        technologies on our website at revialife.com (the &quot;Site&quot;). This
        Cookie Policy explains what cookies are, how we use them, and how you
        can manage your preferences.
      </p>

      <h2>1. What Are Cookies?</h2>
      <p>
        Cookies are small text files that are placed on your device (computer,
        tablet, or mobile phone) when you visit a website. Cookies are widely
        used to make websites function properly, improve performance, and
        provide information to site owners. Cookies may be &quot;session&quot;
        cookies (deleted when you close your browser) or &quot;persistent&quot;
        cookies (remaining on your device for a set period or until you delete
        them).
      </p>

      <h2>2. Types of Cookies We Use</h2>

      <h3>2.1 Essential Cookies</h3>
      <p>
        These cookies are strictly necessary for the operation of the Site. They
        enable core functionality such as security, account authentication,
        session management, and shopping cart operations. The Site cannot
        function properly without these cookies, and they cannot be disabled.
      </p>
      <ul>
        <li>Session identification</li>
        <li>Authentication tokens</li>
        <li>Shopping cart state</li>
        <li>Security and fraud prevention (CSRF tokens)</li>
      </ul>

      <h3>2.2 Analytics Cookies</h3>
      <p>
        These cookies help us understand how visitors interact with the Site by
        collecting and reporting information anonymously. They allow us to
        measure traffic, identify popular pages, and improve the user
        experience.
      </p>
      <ul>
        <li>Google Analytics (traffic analysis, user behavior, page performance)</li>
        <li>Aggregate usage statistics</li>
      </ul>

      <h3>2.3 Functional Cookies</h3>
      <p>
        These cookies enable enhanced functionality and personalization, such as
        remembering your preferences, language settings, and display options.
        They may be set by us or by third-party providers whose services we have
        integrated into our pages.
      </p>
      <ul>
        <li>User preference storage (e.g., theme, language)</li>
        <li>Recently viewed products</li>
        <li>Form auto-fill data</li>
      </ul>

      <h3>2.4 Marketing Cookies</h3>
      <p>
        These cookies may be set through our Site by advertising partners. They
        may be used to build a profile of your interests and show you relevant
        advertisements on other sites. They do not directly store personal
        information but are based on uniquely identifying your browser and
        device.
      </p>

      <h2>3. Third-Party Cookies</h2>
      <p>
        In addition to our own cookies, we may use cookies set by third parties
        to provide certain features and services:
      </p>
      <ul>
        <li>
          <strong>Google Analytics:</strong> Used to analyze Site traffic and
          usage patterns. Google&apos;s privacy policy is available at{" "}
          <a
            href="https://policies.google.com/privacy"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            policies.google.com/privacy
          </a>
          .
        </li>
        <li>
          <strong>Payment Processors:</strong> Our payment providers
          may set cookies to facilitate secure payment processing and
          fraud detection.
        </li>
      </ul>

      <h2>4. Local Storage</h2>
      <p>
        In addition to cookies, we use browser local storage to store certain
        data on your device. This includes:
      </p>
      <ul>
        <li>
          <strong>Cart data:</strong> Items added to your shopping cart are
          stored locally so they persist across browser sessions.
        </li>
        <li>
          <strong>User preferences:</strong> Display settings and other
          preferences may be stored using local storage.
        </li>
      </ul>
      <p>
        Local storage data remains on your device until you clear your browser
        data or the data is programmatically removed.
      </p>

      <h2>5. Session Cookies vs. Persistent Cookies</h2>
      <div className="not-prose overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">Type</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">Duration</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium">Session Cookies</td>
              <td className="px-4 py-3">Deleted when you close your browser</td>
              <td className="px-4 py-3">Maintain your session while browsing (e.g., keeping you logged in)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Persistent Cookies</td>
              <td className="px-4 py-3">Remain for a set period (days to years)</td>
              <td className="px-4 py-3">Remember preferences, analytics tracking, and returning user recognition</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>6. How to Manage Cookies</h2>
      <p>
        You can control and manage cookies through your browser settings. Most
        browsers allow you to:
      </p>
      <ul>
        <li>View what cookies are stored on your device</li>
        <li>Delete all or specific cookies</li>
        <li>Block cookies from specific or all websites</li>
        <li>Block third-party cookies</li>
        <li>Accept or reject cookies on a case-by-case basis</li>
      </ul>
      <p>
        Please note that disabling essential cookies may impair the
        functionality of the Site, including the ability to log in, add items to
        your cart, or complete purchases.
      </p>
      <p>
        To opt out of Google Analytics tracking, you can install the{" "}
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          Google Analytics Opt-out Browser Add-on
        </a>
        .
      </p>

      <h2>7. Cookie Consent</h2>
      <p>
        When you first visit the Site, you may be presented with a cookie
        consent banner allowing you to accept or customize your cookie
        preferences. Essential cookies are always active and cannot be disabled.
        You may update your cookie preferences at any time through the cookie
        settings on the Site.
      </p>

      <h2>8. Changes to This Cookie Policy</h2>
      <p>
        We may update this Cookie Policy from time to time to reflect changes in
        our practices or applicable laws. The &quot;Last Updated&quot; date at
        the top of this page indicates the most recent revision.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        If you have any questions about our use of cookies, please contact us
        at:
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

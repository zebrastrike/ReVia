import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CCPA Notice",
  description:
    "California Consumer Privacy Act (CCPA) Notice for ReVia Research Supply LLC. Learn about your privacy rights as a California resident.",
};

export default function CCPANoticePage() {
  return (
    <>
      <h1>California Consumer Privacy Act (CCPA) Notice</h1>
      <p className="text-sm text-gray-500">
        Last Updated: March 2025
      </p>
      <p>
        This CCPA Notice supplements the information contained in the{" "}
        <a href="/policies/privacy" className="text-blue-600 hover:underline">
          Privacy Policy
        </a>{" "}
        of ReVia Research Supply LLC (&quot;ReVia,&quot; &quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;) and applies solely to residents of
        the State of California (&quot;consumers&quot; or &quot;you&quot;). This
        notice is provided in accordance with the California Consumer Privacy
        Act of 2018 (CCPA), as amended by the California Privacy Rights Act of
        2020 (CPRA).
      </p>

      <h2>1. Your Rights Under the CCPA</h2>
      <p>
        As a California resident, you have the following rights regarding your
        personal information:
      </p>

      <h3>1.1 Right to Know</h3>
      <p>
        You have the right to request that we disclose the categories and
        specific pieces of personal information we have collected about you, the
        categories of sources from which we collected your personal information,
        the business or commercial purpose for collecting your personal
        information, and the categories of third parties with whom we share your
        personal information.
      </p>

      <h3>1.2 Right to Delete</h3>
      <p>
        You have the right to request that we delete personal information we
        have collected from you, subject to certain exceptions. We may deny your
        deletion request if retaining the information is necessary for us or our
        service providers to complete a transaction, detect security incidents,
        comply with legal obligations, or exercise other rights permitted by law.
      </p>

      <h3>1.3 Right to Opt-Out of Sale</h3>
      <p>
        You have the right to opt out of the &quot;sale&quot; of your personal
        information. ReVia does not sell personal information in the traditional
        sense. However, certain activities such as targeted advertising may
        constitute a &quot;sale&quot; under the broad CCPA definition. You may
        exercise your right to opt out by contacting us or using the &quot;Do
        Not Sell My Personal Information&quot; mechanism described below.
      </p>

      <h3>1.4 Right to Non-Discrimination</h3>
      <p>
        We will not discriminate against you for exercising any of your CCPA
        rights. We will not deny you goods or services, charge you different
        prices or rates, provide you a different level or quality of goods or
        services, or suggest that you may receive a different price or rate or
        different level or quality of goods or services as a result of
        exercising your rights.
      </p>

      <h3>1.5 Right to Correct</h3>
      <p>
        You have the right to request that we correct inaccurate personal
        information that we maintain about you.
      </p>

      <h2>2. Categories of Personal Information Collected</h2>
      <p>
        In the preceding twelve (12) months, we may have collected the following
        categories of personal information from California consumers:
      </p>
      <div className="not-prose overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">Category</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">Examples</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium">Identifiers</td>
              <td className="px-4 py-3">Name, email address, phone number, postal address, account name</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium">Commercial Information</td>
              <td className="px-4 py-3">Products purchased, order history, transaction details</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium">Internet/Network Activity</td>
              <td className="px-4 py-3">Browsing history, search history, interaction with our Site</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-3 font-medium">Geolocation Data</td>
              <td className="px-4 py-3">Approximate location based on IP address</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-medium">Professional/Employment Info</td>
              <td className="px-4 py-3">Institutional affiliation, job title, research credentials</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>3. How to Submit a Request</h2>
      <p>
        To exercise any of your rights under the CCPA, you may submit a
        verifiable consumer request through the following methods:
      </p>
      <ul>
        <li>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:info@revialife.com"
            className="text-blue-600 hover:underline"
          >
            info@revialife.com
          </a>{" "}
          with the subject line &quot;CCPA Request&quot;
        </li>
      </ul>
      <p>
        Your request must provide sufficient information to allow us to
        reasonably verify that you are the person about whom we collected
        personal information (or an authorized representative) and describe your
        request with enough detail to allow us to understand, evaluate, and
        respond to it. We cannot respond to your request or provide personal
        information if we cannot verify your identity or authority to make the
        request.
      </p>

      <h2>4. Verification Process</h2>
      <p>
        Upon receiving your request, we will verify your identity by matching
        information you provide with information we already have on file. We may
        request additional information to confirm your identity. Only you, or an
        authorized agent registered with the California Secretary of State, may
        make a verifiable consumer request related to your personal information.
        You may make a verifiable consumer request on behalf of your minor child.
      </p>

      <h2>5. Do Not Sell My Personal Information</h2>
      <p>
        ReVia does not sell personal information in exchange for monetary
        consideration. To the extent any sharing of data with third parties may
        be considered a &quot;sale&quot; under the CCPA, you may opt out by
        contacting us at{" "}
        <a
          href="mailto:info@revialife.com"
          className="text-blue-600 hover:underline"
        >
          info@revialife.com
        </a>{" "}
        with the subject line &quot;Do Not Sell My Personal Information.&quot;
        We will process your request within fifteen (15) business days.
      </p>

      <h2>6. Response Timeframe</h2>
      <p>
        We will acknowledge receipt of your verifiable consumer request within
        ten (10) business days. We will respond to your request within
        forty-five (45) days of receipt. If we require additional time, we will
        inform you of the reason and the extension period in writing. Any
        extension will not exceed an additional forty-five (45) days. If we are
        unable to fulfill your request, we will explain the reasons in our
        response.
      </p>

      <h2>7. Authorized Agent</h2>
      <p>
        You may designate an authorized agent to submit requests on your behalf.
        To do so, you must provide the authorized agent with written permission
        signed by you, and we may require you to verify your own identity
        directly with us. Alternatively, the authorized agent may provide a
        power of attorney pursuant to California Probate Code sections 4000 to
        4465.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        For questions about this CCPA Notice or to exercise your rights, please
        contact us at:
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

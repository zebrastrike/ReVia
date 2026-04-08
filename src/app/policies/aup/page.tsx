import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description:
    "Acceptable Use Policy for ReVia Research Supply LLC. Understand the permitted and prohibited uses of our research-use-only peptide products.",
};

export default function AcceptableUsePolicyPage() {
  return (
    <>
      <h1>Acceptable Use Policy</h1>
      <p className="text-sm text-gray-500">
        Last Updated: April 2026
      </p>
      <p>
        This Acceptable Use Policy (&quot;AUP&quot;) governs the purchase and
        use of all products sold by ReVia Research Supply LLC (&quot;ReVia,&quot;
        &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) through our website
        at revialife.com. By purchasing or using any ReVia product, you agree to
        comply with this AUP. Violation of this policy may result in immediate
        account termination and legal action.
      </p>

      <h2>1. Research Use Only</h2>
      <p>
        All products sold by ReVia are designated{" "}
        <strong>
          &quot;For Research Use Only &mdash; Not for Human Consumption.&quot;
        </strong>{" "}
        Products are intended exclusively for in-vitro research, laboratory
        testing, and scientific investigation. No product sold by ReVia is
        intended for, or may be used for, human or animal consumption,
        diagnosis, treatment, cure, or prevention of any disease or medical
        condition.
      </p>

      <h2>2. Buyer Representation</h2>
      <p>
        By purchasing products from ReVia, you represent and warrant that:
      </p>
      <ul>
        <li>
          You are a qualified researcher, scientist, or represent a research
          institution, laboratory, or educational organization.
        </li>
        <li>
          You have the necessary training, expertise, and facilities to handle
          research peptides and related materials safely and appropriately.
        </li>
        <li>
          You will use all purchased products solely for legitimate research
          purposes.
        </li>
        <li>
          You are at least eighteen (18) years of age and are legally authorized
          to purchase research materials.
        </li>
      </ul>
      <p>
        ReVia reserves the right to request verification of your qualifications,
        institutional affiliation, or intended use at any time.
      </p>

      <h2>3. Prohibited Uses</h2>
      <p>
        You agree that you will <strong>not</strong> use any product purchased
        from ReVia for the following purposes:
      </p>
      <ul>
        <li>Human consumption, injection, ingestion, or topical application on humans</li>
        <li>Animal consumption or veterinary use</li>
        <li>Use as a food additive, dietary supplement, or cosmetic ingredient</li>
        <li>Diagnosis, treatment, cure, mitigation, or prevention of any disease or condition in humans or animals</li>
        <li>Any use that violates applicable federal, state, or local laws and regulations</li>
        <li>Manufacturing of finished pharmaceutical products</li>
        <li>Any application not consistent with in-vitro research use</li>
      </ul>

      <h2>4. Proper Handling and Storage</h2>
      <p>
        The buyer assumes all responsibility for the proper handling, storage,
        and disposal of products purchased from ReVia. You agree to:
      </p>
      <ul>
        <li>
          Follow all handling and storage instructions provided with the product,
          including temperature, light exposure, and humidity requirements.
        </li>
        <li>
          Use appropriate personal protective equipment (PPE) and laboratory
          safety protocols when handling products.
        </li>
        <li>
          Store products in a secure location accessible only to authorized
          personnel.
        </li>
        <li>
          Dispose of products in accordance with all applicable environmental
          and safety regulations.
        </li>
      </ul>

      <h2>5. No Unauthorized Resale</h2>
      <p>
        Products purchased from ReVia may not be resold, redistributed, or
        transferred to any third party without the prior written authorization
        of ReVia Research Supply LLC. Unauthorized resale is strictly prohibited
        and constitutes a material breach of this AUP and our Terms of Service.
      </p>

      <h2>6. Misrepresentation</h2>
      <p>
        Any misrepresentation of intended use, qualifications, or institutional
        affiliation in connection with the purchase of products from ReVia
        constitutes grounds for:
      </p>
      <ul>
        <li>Immediate cancellation of any pending orders</li>
        <li>Permanent termination of your account</li>
        <li>Forfeiture of any products purchased under false pretenses</li>
        <li>Pursuit of all available legal remedies, including but not limited to civil litigation and referral to appropriate regulatory authorities</li>
      </ul>

      <h2>7. Compliance with Laws and Regulations</h2>
      <p>
        You agree to comply with all applicable federal, state, local, and
        international laws and regulations governing the purchase, possession,
        handling, transportation, use, and disposal of research chemicals and
        peptides. It is your sole responsibility to determine the legality of
        purchasing and using our products in your jurisdiction.
      </p>

      <h2>8. Assumption of Risk</h2>
      <p>
        The buyer assumes all risk associated with the use of products purchased
        from ReVia. ReVia shall not be liable for any injury, damage, loss, or
        expense arising from the use, misuse, handling, storage, or disposal of
        any product. By purchasing from ReVia, you agree to indemnify and hold
        harmless ReVia from any claims arising from your use of our products.
      </p>

      <h2>9. Enforcement</h2>
      <p>
        ReVia reserves the right to investigate suspected violations of this
        AUP. We may, at our sole discretion, take any action we deem
        appropriate, including but not limited to suspending or terminating your
        account, refusing future orders, and reporting violations to relevant
        authorities. Violations of this AUP may also constitute violations of
        law and may result in civil or criminal penalties.
      </p>

      <h2>10. Contact Information</h2>
      <p>
        If you have questions about this Acceptable Use Policy, please contact
        us at:
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

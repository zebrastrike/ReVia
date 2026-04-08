import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Legal disclaimer for ReVia Research Supply LLC. All products are for research use only and are not intended for human consumption.",
};

export default function DisclaimerPage() {
  return (
    <>
      <h1>Disclaimer</h1>
      <p className="text-sm text-gray-500">
        Last Updated: April 2026
      </p>
      <p>
        This Disclaimer applies to all products sold by ReVia Research Supply
        LLC (&quot;ReVia,&quot; &quot;we,&quot; &quot;us,&quot; or
        &quot;our&quot;) through our website at revialife.com and to all content
        published on the Site. By accessing the Site or purchasing any product,
        you acknowledge that you have read, understood, and agree to this
        Disclaimer.
      </p>

      <h2>1. Research Use Only</h2>
      <p>
        <strong>
          All products sold by ReVia Research Supply LLC are strictly for
          research use only. Products are not intended for human consumption,
          veterinary use, or any clinical application.
        </strong>
      </p>
      <p>
        Our products are chemical reagents and reference materials designed
        exclusively for in-vitro laboratory research conducted by qualified
        professionals in controlled settings. They are not manufactured,
        packaged, or labeled for use as drugs, food additives, dietary
        supplements, cosmetics, or household chemicals.
      </p>

      <h2>1A. Manufacturing Standards</h2>
      <p>
        Our products are manufactured in cGMP-compliant, ISO-certified,
        FDA-registered facilities in the United States. Certificates of
        compliance and Safety Data Sheets (SDS) are available upon request at{" "}
        <a
          href="mailto:orders@revialife.com"
          className="text-blue-600 hover:underline"
        >
          orders@revialife.com
        </a>
        .
      </p>

      <h2>2. Not Intended for Human Consumption</h2>
      <p>
        No product sold by ReVia is intended for ingestion, injection,
        inhalation, topical application, or any other form of human or animal
        consumption. The purchase of any product from ReVia does not constitute
        a recommendation, endorsement, or suggestion for any use other than
        legitimate scientific research.
      </p>

      <h2>3. No FDA Approval</h2>
      <p>
        Products sold by ReVia have <strong>not</strong> been evaluated,
        approved, or cleared by the United States Food and Drug Administration
        (FDA) or any other regulatory agency for safety, efficacy, or any
        intended use. Our products are not registered as drugs, biologics, or
        medical devices. No claims of therapeutic, diagnostic, preventive, or
        curative properties are made or implied.
      </p>

      <h2>4. No Therapeutic Claims</h2>
      <p>
        ReVia makes no claims, representations, or warranties&mdash;express or
        implied&mdash;that any product sold through the Site has therapeutic,
        medicinal, nutritional, or health-related benefits. We do not claim that
        our products can:
      </p>
      <ul>
        <li>Diagnose, treat, cure, or prevent any disease or medical condition</li>
        <li>Improve physical performance or body composition</li>
        <li>Provide any health benefit to humans or animals</li>
        <li>Serve as a substitute for any medication or medical treatment</li>
      </ul>
      <p>
        Any product descriptions, research summaries, or informational content
        on the Site are provided solely for educational and informational
        purposes to assist qualified researchers.
      </p>

      <h2>5. Assumption of Risk</h2>
      <p>
        By purchasing any product from ReVia, the buyer assumes all risk
        associated with the use, handling, storage, transportation, and disposal
        of the product. The buyer acknowledges that:
      </p>
      <ul>
        <li>
          They possess the necessary knowledge, training, and facilities to
          handle research chemicals safely.
        </li>
        <li>
          They will comply with all applicable laws, regulations, and
          institutional guidelines governing the use of research materials.
        </li>
        <li>
          They are solely responsible for any consequences arising from the use
          or misuse of products purchased from ReVia.
        </li>
      </ul>

      <h2>6. Not a Substitute for Professional Medical Advice</h2>
      <p>
        Nothing on the Site or in any product listing, description, or
        communication from ReVia constitutes medical advice, professional
        diagnosis, or treatment recommendation. The Site is not a substitute
        for consultation with a qualified healthcare professional. If you have
        questions about a medical condition, consult a licensed physician or
        other qualified healthcare provider.
      </p>

      <h2>7. Limitation of Liability for Research Outcomes</h2>
      <p>
        ReVia makes no representations or warranties regarding the suitability
        of any product for a particular research application or the
        reproducibility of research results. We shall not be liable for any
        research outcomes, experimental failures, data loss, or any other
        consequence arising from the use of our products in research. All
        products are provided &quot;as is&quot; without warranty of any kind,
        express or implied, including but not limited to warranties of
        merchantability, fitness for a particular purpose, or non-infringement.
      </p>

      <h2>8. Third-Party Research References</h2>
      <p>
        The Site may contain references to third-party research, scientific
        literature, published studies, or external resources. Such references
        are provided for informational and educational purposes only and do not
        constitute an endorsement, recommendation, or validation by ReVia.
        ReVia does not guarantee the accuracy, completeness, or applicability
        of any third-party research. Researchers should independently verify
        all information and conduct their own due diligence before relying on
        any referenced material.
      </p>

      <h2>9. Product Accuracy</h2>
      <p>
        While we strive to provide accurate product descriptions, purity
        specifications, and other technical information, ReVia does not warrant
        that all information on the Site is free from errors or omissions. We
        reserve the right to correct any errors and to update product
        information at any time without notice. Certificates of analysis (COAs)
        are provided for informational purposes and reflect testing at the time
        of manufacture. Certificates of Analysis are accessible on each product
        page when available, or by contacting{" "}
        <a
          href="mailto:orders@revialife.com"
          className="text-blue-600 hover:underline"
        >
          orders@revialife.com
        </a>{" "}
        with your order number.
      </p>
      <p>
        Purity specifications reflect testing at time of manufacture. ReVia does
        not guarantee product stability beyond the specified shelf life.
        Products stored outside recommended temperature ranges are used at the
        buyer&apos;s own risk.
      </p>

      <h2>10. Indemnification</h2>
      <p>
        By purchasing products from ReVia, you agree to indemnify, defend, and
        hold harmless ReVia Research Supply LLC, its officers, directors,
        employees, agents, and affiliates from and against any and all claims,
        damages, losses, liabilities, costs, and expenses (including reasonable
        attorneys&apos; fees) arising from or relating to your use or misuse of
        any product, your violation of this Disclaimer or any applicable law, or
        any third-party claims resulting from your actions.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        This Disclaimer shall be governed by and construed in accordance with
        the laws of the State of Florida, United States of America, without
        regard to its conflict of law provisions.
      </p>

      <h2>12. Contact Information</h2>
      <p>
        If you have any questions about this Disclaimer, please contact us at:
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

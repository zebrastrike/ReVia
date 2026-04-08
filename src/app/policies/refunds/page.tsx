import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund & Return Policy",
  description:
    "Refund and Return Policy for ReVia Research Supply LLC. Understand our all-sales-final policy and the limited exceptions for damaged or incorrect shipments.",
};

export default function RefundPolicyPage() {
  return (
    <>
      <h1>Refund &amp; Return Policy</h1>
      <p className="text-sm text-gray-500">
        Last Updated: April 2026
      </p>
      <p>
        ReVia Research Supply LLC (&quot;ReVia&quot;) maintains strict quality
        control standards for all products. Due to the nature of our
        research-use-only peptide products and the inability to verify the
        condition or handling of returned goods, we enforce the following refund
        and return policy.
      </p>

      <h2>1. All Sales Are Final</h2>
      <p>
        <strong>
          All sales are final. We do not offer refunds, returns, or exchanges
          under normal circumstances.
        </strong>{" "}
        By placing an order with ReVia, you acknowledge and agree that your
        purchase is non-refundable and non-returnable. We strongly encourage you
        to review your order carefully before completing your purchase, including
        product selection, quantities, and shipping address.
      </p>

      <h2>2. Limited Exceptions</h2>
      <p>
        We may, at our sole discretion, provide a product replacement (not a
        cash refund) in the following limited circumstances:
      </p>

      <h3>2.1 Damaged in Transit</h3>
      <p>
        If your order arrives with visible damage to the product or packaging
        that affects the integrity of the product, you must report the damage
        within <strong>forty-eight (48) hours</strong> of delivery. To file a
        damage claim, email us at{" "}
        <a
          href="mailto:orders@revialife.com"
          className="text-blue-600 hover:underline"
        >
          orders@revialife.com
        </a>{" "}
        with:
      </p>
      <ul>
        <li>Your order number</li>
        <li>Clear photographs of the damaged packaging and product(s)</li>
        <li>A brief description of the damage</li>
      </ul>

      <h3>2.2 Wrong Item Shipped</h3>
      <p>
        If you receive a product that differs from what you ordered, please
        contact us within <strong>forty-eight (48) hours</strong> of delivery.
        Provide your order number, a photo of the item received, and a
        description of the discrepancy. We will arrange for the correct product
        to be shipped to you at no additional cost.
      </p>

      <h3>2.3 Product Quality Issues</h3>
      <p>
        If you believe a product has a quality or integrity issue, you must
        contact us within <strong>seven (7) days</strong> of delivery. Include
        your order number, a description of the issue, and any supporting
        documentation or photographs. Qualifying quality issues include:
      </p>
      <ul>
        <li>Suspected contamination or discoloration</li>
        <li>Incorrect peptide concentration (&gt;5% variance from COA)</li>
        <li>Compromised vial seal or packaging integrity</li>
        <li>Apparent degradation or precipitation</li>
        <li>Discrepancies between product received and Certificate of Analysis</li>
      </ul>
      <p>
        Our quality assurance team will review
        your claim and determine an appropriate resolution.
      </p>

      <h2>3. Resolution Process</h2>
      <p>
        All approved claims under the exceptions described above will be
        resolved through <strong>product replacement only</strong>. ReVia does
        not issue cash refunds, store credit, or monetary compensation under any
        circumstances. Replacement products will be shipped using the same
        shipping method as the original order at no additional cost to the
        customer.
      </p>

      <h2>4. Non-Eligible Situations</h2>
      <p>
        The following situations do <strong>not</strong> qualify for replacement
        or refund:
      </p>
      <ul>
        <li>Change of mind after purchase</li>
        <li>Incorrect product or quantity selected by the customer</li>
        <li>Products that have been opened, used, or tampered with</li>
        <li>Products not stored according to recommended conditions</li>
        <li>Damage reported after the 48-hour reporting window</li>
        <li>Quality issues reported after the 7-day reporting window</li>
        <li>Orders shipped to an incorrect address provided by the customer</li>
        <li>Delays caused by the shipping carrier</li>
        <li>Dissatisfaction with research results or outcomes</li>
      </ul>

      <h2>5. How to Contact Us</h2>
      <p>
        To report a qualifying issue, please email us with the following
        information:
      </p>
      <ul>
        <li>Your full name and order number</li>
        <li>A detailed description of the issue</li>
        <li>Photographs of the product and packaging (if applicable)</li>
        <li>The date the order was received</li>
      </ul>
      <p>
        We will review your claim and respond within two (2) business days.
      </p>

      <address className="not-prose text-sm leading-7 text-gray-700 mt-6">
        <strong>ReVia Research Supply LLC</strong>
        <br />
        Florida, USA
        <br />
        Email:{" "}
        <a
          href="mailto:orders@revialife.com"
          className="text-blue-600 hover:underline"
        >
          orders@revialife.com
        </a>
      </address>
    </>
  );
}

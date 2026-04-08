import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Shipping Policy for ReVia Research Supply LLC. Learn about our processing times, shipping methods, cold chain handling, and delivery guidelines for research peptides.",
};

export default function ShippingPolicyPage() {
  return (
    <>
      <h1>Shipping Policy</h1>
      <p className="text-sm text-gray-500">
        Last Updated: April 2026
      </p>
      <p>
        ReVia Research Supply LLC (&quot;ReVia&quot;) is committed to delivering
        your research materials safely and promptly. This Shipping Policy
        outlines our shipping procedures, methods, and guidelines. By placing an
        order, you agree to the terms described below.
      </p>

      <h2>1. Order Processing Time</h2>
      <p>
        Orders are processed within one (1) to three (3) business days after
        payment is confirmed. Business days are Monday through Friday, excluding
        federal holidays. Orders placed after 2:00 PM EST may not begin
        processing until the following business day. You will receive a
        confirmation email once your order has been processed and shipped.
      </p>

      <h2>2. Shipping Methods and Estimated Delivery</h2>
      <p>We offer the following shipping options for domestic orders:</p>
      <div className="not-prose overflow-x-auto">
        <table className="w-full text-sm border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">Method</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">Estimated Delivery</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700 border-b">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-3">Standard Shipping &mdash; $7.95</td>
              <td className="px-4 py-3">5&ndash;7 business days</td>
              <td className="px-4 py-3">USPS or UPS Ground</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="px-4 py-3">Expedited Shipping &mdash; $14.95</td>
              <td className="px-4 py-3">2&ndash;3 business days</td>
              <td className="px-4 py-3">USPS Priority or UPS 2nd Day Air</td>
            </tr>
            <tr>
              <td className="px-4 py-3">Overnight Shipping &mdash; $34.95</td>
              <td className="px-4 py-3">Next business day</td>
              <td className="px-4 py-3">UPS Next Day Air or FedEx Overnight</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        All orders ship next business day. Discreet packaging. Tracking
        provided. Insured shipments. Estimated delivery times begin from the
        date of shipment, not the date the order was placed. Delivery times are estimates and are not
        guaranteed. Delays may occur due to carrier issues, weather, or other
        circumstances beyond our control.
      </p>

      <h2>3. Cold Chain Shipping</h2>
      <p>
        Certain peptides and temperature-sensitive products require cold chain
        shipping to maintain stability and integrity. These products are shipped
        with insulated packaging and cold packs to ensure proper temperature
        control during transit. We strongly recommend selecting Priority or
        Overnight shipping for temperature-sensitive products, especially during
        warmer months, to minimize exposure to elevated temperatures.
      </p>
      <p>
        ReVia is not responsible for product degradation resulting from extended
        transit times when Standard Shipping is selected for temperature-sensitive
        items.
      </p>

      <h2>4. Domestic Shipping Only</h2>
      <p>
        At this time, ReVia ships only within the United States, including all
        50 states and the District of Columbia. International shipping is not
        currently available. We may expand our shipping capabilities in the
        future. Please check back for updates or subscribe to our mailing list
        for announcements.
      </p>

      <h2>5. Order Tracking</h2>
      <p>
        A tracking number will be provided via email once your order has been
        shipped. You can use this tracking number on the carrier&apos;s website
        to monitor the status and estimated delivery of your shipment. If you do
        not receive tracking information within three (3) business days of
        placing your order, please contact us at{" "}
        <a
          href="mailto:orders@revialife.com"
          className="text-blue-600 hover:underline"
        >
          orders@revialife.com
        </a>
        .
      </p>

      <h2>6. Signature Requirement</h2>
      <p>
        For orders with a total value exceeding $500.00 USD, a signature is
        required upon delivery. This policy exists to protect both ReVia and our
        customers from lost or stolen shipments. If no one is available to sign
        for the delivery, the carrier will typically leave a notice and attempt
        redelivery or hold the package at a local facility for pickup.
      </p>

      <h2>7. Shipping Damage Claims</h2>
      <p>
        If your order arrives damaged, you must report the damage within
        forty-eight (48) hours of delivery by contacting us at{" "}
        <a
          href="mailto:orders@revialife.com"
          className="text-blue-600 hover:underline"
        >
          orders@revialife.com
        </a>
        . When reporting damage, please include:
      </p>
      <ul>
        <li>Your order number</li>
        <li>Clear photographs of the damaged packaging and products</li>
        <li>A description of the damage</li>
      </ul>
      <p>
        Failure to report damage within the 48-hour window may result in the
        inability to process a claim. Approved claims will be resolved through
        product replacement only; cash refunds are not provided. Please refer to
        our{" "}
        <a href="/policies/refunds" className="text-blue-600 hover:underline">
          Refund &amp; Return Policy
        </a>{" "}
        for additional details.
      </p>

      <h2>8. PO Box Limitations</h2>
      <p>
        Due to carrier restrictions and the nature of our products, we may be
        unable to ship to PO Box addresses for certain shipping methods
        (Priority and Overnight). If your shipping address is a PO Box, Standard
        Shipping via USPS will be used. We recommend providing a physical street
        address to ensure the widest selection of shipping options and the most
        reliable delivery.
      </p>

      <h2>9. Undeliverable Packages</h2>
      <p>
        If a package is returned to us as undeliverable due to an incorrect
        address, refused delivery, or failure to pick up, we will contact you to
        arrange reshipment. Additional shipping charges may apply for reshipment.
        ReVia is not responsible for packages that are undeliverable due to
        incorrect shipping information provided by the customer.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        For questions about shipping or the status of your order, please contact
        us at:
      </p>
      <address className="not-prose text-sm leading-7 text-gray-700">
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

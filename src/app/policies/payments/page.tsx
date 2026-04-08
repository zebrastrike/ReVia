import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Policy",
  description:
    "Payment Policy for ReVia Research Supply LLC. Learn about accepted payment methods, billing, taxes, and fraud prevention for research peptide purchases.",
};

export default function PaymentPolicyPage() {
  return (
    <>
      <h1>Payment Policy</h1>
      <p className="text-sm text-gray-500">
        Last Updated: April 2026
      </p>
      <p>
        ReVia Research Supply LLC (&quot;ReVia,&quot; &quot;we,&quot;
        &quot;us,&quot; or &quot;our&quot;) is committed to providing a secure
        and transparent payment experience. This Payment Policy outlines the
        terms governing payment for products purchased through our website at
        revialife.com.
      </p>

      <h2>1. Accepted Payment Methods</h2>
      <p>We accept the following forms of payment:</p>
      <ul>
        <li>
          <strong>Credit and Debit Cards:</strong> Visa, Mastercard, American
          Express, and Discover
        </li>
      </ul>
      <p>
        We do not accept personal checks, money orders, wire transfers, or
        cash-on-delivery payments.
      </p>

      <h2>2. Secure Payment Processing</h2>
      <p>
        All payment transactions are processed through PCI-DSS (Payment Card
        Industry Data Security Standard) compliant payment processors. Your
        payment information is encrypted during transmission using SSL/TLS
        technology and is never stored on our servers. We partner with
        industry-leading payment processors to ensure the highest level of
        transaction security.
      </p>

      <h2>3. Billing Descriptor</h2>
      <p>
        Charges from ReVia will appear on your credit card or bank statement
        under the descriptor &quot;REVIA RESEARCH&quot; or a similar variation.
        If you do not recognize a charge, please review your recent orders
        before contacting your bank, and reach out to us at{" "}
        <a
          href="mailto:orders@revialife.com"
          className="text-blue-600 hover:underline"
        >
          orders@revialife.com
        </a>{" "}
        for clarification.
      </p>

      <h2>4. Authorization Holds</h2>
      <p>
        When you place an order, we may place a temporary authorization hold on
        your payment method to verify the availability of funds. This hold is
        not a charge. The actual charge will be processed when your order is
        confirmed and prepared for shipment. Authorization holds typically
        expire within three (3) to five (5) business days if the order is not
        completed. Your bank or card issuer determines the exact release timing.
      </p>

      <h2>5. Failed Payments</h2>
      <p>
        If your payment is declined or fails to process, your order will not be
        placed. Common reasons for payment failure include:
      </p>
      <ul>
        <li>Insufficient funds</li>
        <li>Incorrect card information</li>
        <li>Expired card</li>
        <li>Card issuer security restrictions</li>
        <li>Billing address mismatch</li>
      </ul>
      <p>
        If your payment fails, please verify your payment information and try
        again, or use an alternative payment method. If the issue persists,
        contact your bank or card issuer directly.
      </p>

      <h2>6. Currency</h2>
      <p>
        All prices on the Site are listed in United States Dollars (USD). All
        transactions are processed in USD. If you are using a payment method
        denominated in a different currency, your bank or card issuer may apply
        a currency conversion fee. ReVia is not responsible for any fees charged
        by your financial institution.
      </p>

      <h2>7. Sales Tax</h2>
      <p>
        ReVia collects applicable state and local sales tax as required by law.
        Sales tax is calculated based on the shipping destination of your order
        and is displayed during checkout before you confirm your purchase. Tax
        rates are determined by the applicable jurisdiction and are subject to
        change. Qualified tax-exempt organizations may contact us with valid
        exemption documentation to request tax-exempt ordering.
      </p>

      <h2>8. Payment Plans and Financing</h2>
      <p>
        ReVia does not currently offer payment plans, installment payments,
        buy-now-pay-later options, or any form of financing. All orders must be
        paid in full at the time of purchase. We may introduce financing
        options in the future; any such changes will be announced on the Site.
      </p>

      <h2>9. Fraud Prevention</h2>
      <p>
        ReVia takes fraud prevention seriously. We employ multiple measures to
        protect both our customers and our business, including:
      </p>
      <ul>
        <li>Address Verification System (AVS) checks</li>
        <li>Card Verification Value (CVV) verification</li>
        <li>IP address screening and geolocation analysis</li>
        <li>Velocity checks on ordering patterns</li>
        <li>Manual review of flagged transactions</li>
      </ul>
      <p>
        If we suspect fraudulent activity, we reserve the right to cancel your
        order, suspend your account, and report the activity to the appropriate
        authorities. We may request additional identification or verification
        before processing an order that triggers our fraud detection systems.
      </p>

      <h2>10. Chargebacks and Disputes</h2>
      <p>
        If you believe a charge is incorrect, we encourage you to contact us at{" "}
        <a
          href="mailto:orders@revialife.com"
          className="text-blue-600 hover:underline"
        >
          orders@revialife.com
        </a>{" "}
        before initiating a chargeback with your bank. Filing a chargeback
        without first contacting us may result in delays in resolution and may
        lead to the suspension of your account. We will work with you to
        resolve any billing concerns promptly and fairly.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        For questions about payments, billing, or this Payment Policy, please
        contact us at:
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

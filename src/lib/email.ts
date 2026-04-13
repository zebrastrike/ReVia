import { Resend } from "resend";
import { ZELLE_INFO, WIRE_INFO, KRAKEN_PAY_INFO, type PaymentMethod } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface OrderItemForEmail {
  productName: string;
  variantLabel: string;
  price: number;
  quantity: number;
}

export interface OrderWithItems {
  id: string;
  invoiceNumber: string;
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  total: number;
  status: string;
  paymentMethod: string;
  shippingCost?: number; // cents
  items: OrderItemForEmail[];
  createdAt: Date | string;
}

/* ------------------------------------------------------------------ */
/*  Resend Client                                                      */
/* ------------------------------------------------------------------ */

let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

const FROM = "ReVia Research Supply <orders@revialife.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "contact@revialife.com";

async function send(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log("──── EMAIL PREVIEW (no RESEND_API_KEY) ────");
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(html.slice(0, 500) + "...");
    console.log("───────────────────────");
    return;
  }
  await getResend().emails.send({ from: FROM, to, subject, html });
}

/* ------------------------------------------------------------------ */
/*  Shared styles (dark theme)                                         */
/* ------------------------------------------------------------------ */

const wrapper = `
  background-color:#0f0f0f;
  padding:40px 20px;
  font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  color:#e5e5e5;
`;
const card = `
  max-width:600px;
  margin:0 auto;
  background-color:#1a1a1a;
  border:1px solid rgba(255,255,255,0.08);
  border-radius:16px;
  padding:32px;
`;
const heading = `color:#ffffff;font-size:22px;font-weight:700;margin:0 0 8px;`;
const subtext = `color:#9ca3af;font-size:14px;margin:0 0 24px;`;
const btnStyle = `
  display:inline-block;
  background-color:#059669;
  color:#ffffff;
  text-decoration:none;
  padding:12px 28px;
  border-radius:12px;
  font-size:14px;
  font-weight:600;
`;
const divider = `border:0;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;`;
const footer = `text-align:center;color:#6b7280;font-size:12px;margin-top:32px;`;
const infoBox = `
  background-color:rgba(16,185,129,0.08);
  border:1px solid rgba(16,185,129,0.2);
  border-radius:12px;
  padding:20px;
  margin:16px 0;
`;
const warningBox = `
  background-color:rgba(245,158,11,0.1);
  border:1px solid rgba(245,158,11,0.3);
  border-radius:8px;
  padding:12px;
  margin-bottom:16px;
  text-align:center;
`;
const labelStyle = `color:#9ca3af;font-size:12px;margin:0 0 2px;text-transform:uppercase;letter-spacing:0.5px;`;
const valueStyle = `color:#e5e5e5;font-size:14px;font-weight:600;margin:0 0 12px;`;
const monoValue = `color:#10b981;font-size:16px;font-weight:700;margin:0 0 12px;letter-spacing:1px;font-family:monospace;`;

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function invoiceDisplay(order: OrderWithItems) {
  return order.invoiceNumber || order.id.slice(-8).toUpperCase();
}

function itemsTable(items: OrderItemForEmail[]) {
  const rows = items
    .map(
      (i) => `
    <tr>
      <td style="padding:8px 0;color:#e5e5e5;font-size:14px;">
        ${i.productName} <span style="color:#9ca3af;">(${i.variantLabel})</span>
      </td>
      <td style="padding:8px 0;color:#9ca3af;font-size:14px;text-align:center;">&times; ${i.quantity}</td>
      <td style="padding:8px 0;color:#e5e5e5;font-size:14px;text-align:right;">${formatCents(i.price * i.quantity)}</td>
    </tr>`
    )
    .join("");

  return `
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="border-bottom:1px solid rgba(255,255,255,0.08);">
          <th style="text-align:left;color:#6b7280;font-size:12px;padding-bottom:8px;text-transform:uppercase;">Item</th>
          <th style="text-align:center;color:#6b7280;font-size:12px;padding-bottom:8px;text-transform:uppercase;">Qty</th>
          <th style="text-align:right;color:#6b7280;font-size:12px;padding-bottom:8px;text-transform:uppercase;">Price</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function shippingBlock(order: OrderWithItems) {
  return `
    <p style="color:#9ca3af;font-size:13px;margin:0;">
      <strong style="color:#e5e5e5;">Shipping to:</strong><br/>
      ${order.name}<br/>
      ${order.address}<br/>
      ${order.city}, ${order.state} ${order.zip}
    </p>`;
}

function footerBlock() {
  return `<p style="${footer}">
    &copy; ${new Date().getFullYear()} ReVia Research Supply LLC &mdash; For research use only.<br/>
    All sales are final. No refunds or returns.
  </p>`;
}

/* ------------------------------------------------------------------ */
/*  Payment Instruction Blocks                                         */
/* ------------------------------------------------------------------ */

function paymentInstructions(method: string, invoiceNum: string, total: number) {
  const amount = formatCents(total);

  if (method === "zelle") {
    return `
      <div style="${infoBox}">
        <p style="color:#10b981;font-size:16px;font-weight:700;margin:0 0 16px;text-align:center;">Zelle Payment Instructions</p>
        <p style="${labelStyle}">Zelle tag</p>
        <p style="${monoValue}">${ZELLE_INFO.tag}</p>
        <p style="${labelStyle}">Or send to email</p>
        <p style="${valueStyle}">${ZELLE_INFO.email}</p>
        <p style="${labelStyle}">Recipient name</p>
        <p style="${valueStyle}">${ZELLE_INFO.recipient}</p>
        <p style="${labelStyle}">Amount</p>
        <p style="${monoValue}">${amount}</p>
        <p style="${labelStyle}">Payment note (required)</p>
        <p style="${monoValue}">${invoiceNum}</p>
        <hr style="${divider}"/>
        <p style="color:#f59e0b;font-size:12px;margin:0;text-align:center;">
          ⚠️ You MUST include your invoice number <strong>${invoiceNum}</strong> in the Zelle payment note so we can match your payment to your order.
        </p>
      </div>`;
  }

  if (method === "wire") {
    return `
      <div style="${infoBox}">
        <p style="color:#10b981;font-size:16px;font-weight:700;margin:0 0 16px;text-align:center;">Wire / ACH Transfer Instructions</p>
        <p style="${labelStyle}">Bank name</p>
        <p style="${valueStyle}">${WIRE_INFO.bankName}</p>
        <p style="${labelStyle}">Account name</p>
        <p style="${valueStyle}">${WIRE_INFO.accountName}</p>
        <p style="${labelStyle}">Routing number</p>
        <p style="${monoValue}">${WIRE_INFO.routingNumber}</p>
        <p style="${labelStyle}">Account number</p>
        <p style="${monoValue}">${WIRE_INFO.accountNumber}</p>
        <p style="${labelStyle}">Account type</p>
        <p style="${valueStyle}">${WIRE_INFO.accountType}</p>
        <p style="${labelStyle}">Bank address</p>
        <p style="color:#9ca3af;font-size:13px;margin:0 0 12px;">${WIRE_INFO.bankAddress}</p>
        <p style="${labelStyle}">Company address</p>
        <p style="color:#9ca3af;font-size:13px;margin:0 0 12px;">${WIRE_INFO.companyAddress}</p>
        <p style="${labelStyle}">Amount</p>
        <p style="${monoValue}">${amount}</p>
        <p style="${labelStyle}">Reference / memo (required)</p>
        <p style="${monoValue}">${invoiceNum}</p>
        <hr style="${divider}"/>
        <p style="color:#f59e0b;font-size:12px;margin:0;text-align:center;">
          ⚠️ You MUST include your invoice number <strong>${invoiceNum}</strong> in the wire/ACH transfer reference/memo field.
        </p>
      </div>`;
  }

  if (method === "bitcoin") {
    return `
      <div style="${infoBox}">
        <p style="color:#10b981;font-size:16px;font-weight:700;margin:0 0 16px;text-align:center;">Bitcoin Payment via Kraken Pay</p>
        <p style="${labelStyle}">Kraken Pay tag</p>
        <p style="${monoValue}">${KRAKEN_PAY_INFO.paymentTag}</p>
        <p style="${labelStyle}">Amount (USD equivalent)</p>
        <p style="${monoValue}">${amount}</p>
        <p style="${labelStyle}">Payment note (required)</p>
        <p style="${monoValue}">${invoiceNum}</p>
        <hr style="${divider}"/>
        <p style="color:#9ca3af;font-size:13px;margin:0 0 8px;text-align:center;">
          <strong style="color:#e5e5e5;">How to pay:</strong>
        </p>
        <ol style="color:#9ca3af;font-size:13px;margin:0;padding-left:20px;line-height:1.8;">
          <li>Open your Kraken app or visit kraken.com</li>
          <li>Go to <strong style="color:#e5e5e5;">Send</strong> → <strong style="color:#e5e5e5;">Kraken Pay</strong></li>
          <li>Enter tag: <strong style="color:#10b981;">${KRAKEN_PAY_INFO.paymentTag}</strong></li>
          <li>Send <strong style="color:#e5e5e5;">${amount}</strong> in BTC equivalent</li>
          <li>Include invoice <strong style="color:#10b981;">${invoiceNum}</strong> in the note</li>
        </ol>
        <hr style="${divider}"/>
        <p style="color:#f59e0b;font-size:12px;margin:0;text-align:center;">
          ⚠️ Include your invoice number <strong>${invoiceNum}</strong> in the payment note so we can confirm your order.
        </p>
      </div>`;
  }

  return "";
}

/* ------------------------------------------------------------------ */
/*  1. Order Confirmation + Payment Instructions                       */
/* ------------------------------------------------------------------ */

export async function sendOrderConfirmation(
  order: OrderWithItems,
  email: string
) {
  const inv = invoiceDisplay(order);
  const paymentLabel =
    order.paymentMethod === "zelle" ? "Zelle" :
    order.paymentMethod === "wire" ? "Wire Transfer" :
    order.paymentMethod === "bitcoin" ? "Bitcoin (Kraken Pay)" : "TBD";

  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="${heading}">Order Confirmed — Payment Required</h1>
    <p style="${subtext}">
      Thank you, ${order.name}! Your order has been received and is awaiting payment.<br/>
      <strong style="color:#10b981;">Invoice: ${inv}</strong>
    </p>

    ${order.status === "pre_order" ? `<div style="${warningBox}"><span style="color:#f59e0b;font-size:13px;font-weight:600;">⏳ This order contains pre-order items</span><br/><span style="color:#9ca3af;font-size:12px;">Pre-order items ship within 5–7 business days after payment confirmation</span></div>` : ""}

    ${itemsTable(order.items)}

    <hr style="${divider}"/>

    <table style="width:100%;">
      <tr>
        <td style="color:#9ca3af;font-size:14px;">Subtotal</td>
        <td style="text-align:right;color:#e5e5e5;font-size:14px;">${formatCents(order.items.reduce((s, i) => s + i.price * i.quantity, 0))}</td>
      </tr>
      <tr>
        <td style="color:#9ca3af;font-size:14px;">Shipping</td>
        <td style="text-align:right;color:#e5e5e5;font-size:14px;">${order.shippingCost ? formatCents(order.shippingCost) : "Included"}</td>
      </tr>
      <tr>
        <td style="color:#9ca3af;font-size:14px;">Payment Method</td>
        <td style="text-align:right;color:#e5e5e5;font-size:14px;font-weight:600;">${paymentLabel}</td>
      </tr>
      <tr>
        <td style="color:#9ca3af;font-size:14px;font-weight:700;">Total Due</td>
        <td style="text-align:right;color:#ffffff;font-size:18px;font-weight:700;">${formatCents(order.total)}</td>
      </tr>
    </table>

    <hr style="${divider}"/>

    ${paymentInstructions(order.paymentMethod, inv, order.total)}

    <hr style="${divider}"/>

    ${shippingBlock(order)}

    <hr style="${divider}"/>

    <p style="color:#9ca3af;font-size:12px;margin:0;">
      Your order will be processed and shipped once payment is confirmed. Payment must be received within <strong style="color:#e5e5e5;">48 hours</strong> or the order may be cancelled.
    </p>

    ${footerBlock()}
  </div>
</div>`;

  await send(email, `Invoice ${inv} — Payment Required`, html);
}

/* ------------------------------------------------------------------ */
/*  2. Payment Confirmed                                               */
/* ------------------------------------------------------------------ */

export async function sendPaymentConfirmation(
  order: OrderWithItems,
  email: string
) {
  const inv = invoiceDisplay(order);

  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="${heading}">Payment Confirmed!</h1>
    <p style="${subtext}">
      Great news, ${order.name}! We've confirmed your payment for invoice <strong style="color:#10b981;">${inv}</strong>.
      Your order is now being prepared for shipment.
    </p>

    ${itemsTable(order.items)}

    <hr style="${divider}"/>

    <table style="width:100%;">
      <tr>
        <td style="color:#9ca3af;font-size:14px;">Total Paid</td>
        <td style="text-align:right;color:#10b981;font-size:18px;font-weight:700;">${formatCents(order.total)}</td>
      </tr>
    </table>

    <hr style="${divider}"/>

    ${shippingBlock(order)}

    <p style="color:#9ca3af;font-size:13px;margin-top:16px;">
      You'll receive a shipping notification with tracking info once your order ships.
    </p>

    ${footerBlock()}
  </div>
</div>`;

  await send(email, `Payment Confirmed — Invoice ${inv}`, html);
}

/* ------------------------------------------------------------------ */
/*  3. Shipping Notification                                           */
/* ------------------------------------------------------------------ */

export async function sendShippingNotification(
  order: OrderWithItems,
  email: string,
  trackingNumber: string,
  carrier?: string,
  trackingUrl?: string
) {
  const inv = invoiceDisplay(order);
  const carrierLabel = carrier ? ` via ${carrier}` : "";
  const trackingLink = trackingUrl
    ? `<a href="${trackingUrl}" style="color:#10b981;text-decoration:underline;">${trackingNumber}</a>`
    : trackingNumber;

  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="${heading}">Your Order Has Shipped!</h1>
    <p style="${subtext}">Great news, ${order.name}! Invoice <strong style="color:#10b981;">${inv}</strong> is on its way${carrierLabel}.</p>

    <div style="${infoBox}text-align:center;">
      ${carrier ? `<p style="${labelStyle}">Carrier</p><p style="color:#e5e5e5;font-size:14px;font-weight:600;margin:0 0 12px;">${carrier}</p>` : ""}
      <p style="${labelStyle}">Tracking Number</p>
      <p style="color:#10b981;font-size:18px;font-weight:700;margin:0;letter-spacing:1px;">${trackingLink}</p>
      ${trackingUrl ? `<p style="margin-top:12px;"><a href="${trackingUrl}" style="${btnStyle}">Track Your Package</a></p>` : ""}
    </div>

    <hr style="${divider}"/>

    ${shippingBlock(order)}

    ${footerBlock()}
  </div>
</div>`;

  await send(email, `Order Shipped${carrierLabel} — Invoice ${inv}`, html);
}

/* ------------------------------------------------------------------ */
/*  4. Order Delivered                                                 */
/* ------------------------------------------------------------------ */

export async function sendDeliveryConfirmation(
  order: OrderWithItems,
  email: string
) {
  const inv = invoiceDisplay(order);
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://revialife.com";

  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="${heading}">Order Delivered!</h1>
    <p style="${subtext}">
      Your order <strong style="color:#10b981;">${inv}</strong> has been delivered.
      Thank you for choosing ReVia Research Supply!
    </p>

    ${itemsTable(order.items)}

    <hr style="${divider}"/>

    <p style="color:#9ca3af;font-size:13px;margin:0 0 16px;">
      If you notice any issues with your delivery (damage in transit, incorrect items), please contact us within
      <strong style="color:#e5e5e5;">48 hours</strong> at
      <a href="mailto:orders@revialife.com" style="color:#10b981;">orders@revialife.com</a>.
    </p>

    <div style="text-align:center;margin:24px 0;">
      <a href="${baseUrl}/shop" style="${btnStyle}">Shop Again</a>
    </div>

    ${footerBlock()}
  </div>
</div>`;

  await send(email, `Order Delivered — Invoice ${inv}`, html);
}

/* ------------------------------------------------------------------ */
/*  5. Order Status Update (generic)                                   */
/* ------------------------------------------------------------------ */

export async function sendOrderStatusUpdate(
  order: OrderWithItems,
  email: string,
  newStatus: string,
  message?: string
) {
  const inv = invoiceDisplay(order);

  const statusLabels: Record<string, string> = {
    pending_payment: "Awaiting Payment",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    on_hold: "On Hold",
  };

  const statusLabel = statusLabels[newStatus] || newStatus;

  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="${heading}">Order Update</h1>
    <p style="${subtext}">
      Hi ${order.name}, there's an update on invoice <strong style="color:#10b981;">${inv}</strong>.
    </p>

    <div style="${infoBox}text-align:center;">
      <p style="${labelStyle}">New Status</p>
      <p style="color:#10b981;font-size:18px;font-weight:700;margin:0;">${statusLabel}</p>
    </div>

    ${message ? `<p style="color:#e5e5e5;font-size:14px;margin:16px 0;padding:16px;background:rgba(255,255,255,0.04);border-radius:8px;">${message}</p>` : ""}

    <hr style="${divider}"/>

    ${itemsTable(order.items)}

    <hr style="${divider}"/>

    <table style="width:100%;">
      <tr>
        <td style="color:#9ca3af;font-size:14px;">Total</td>
        <td style="text-align:right;color:#ffffff;font-size:18px;font-weight:700;">${formatCents(order.total)}</td>
      </tr>
    </table>

    <p style="color:#9ca3af;font-size:12px;margin-top:16px;">
      Questions? Email <a href="mailto:orders@revialife.com" style="color:#10b981;">orders@revialife.com</a>
    </p>

    ${footerBlock()}
  </div>
</div>`;

  await send(email, `Order Update — Invoice ${inv}: ${statusLabel}`, html);
}

/* ------------------------------------------------------------------ */
/*  6. Order Cancelled                                                 */
/* ------------------------------------------------------------------ */

export async function sendOrderCancellation(
  order: OrderWithItems,
  email: string,
  reason?: string
) {
  const inv = invoiceDisplay(order);

  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="color:#ef4444;font-size:22px;font-weight:700;margin:0 0 8px;">Order Cancelled</h1>
    <p style="${subtext}">
      Hi ${order.name}, invoice <strong style="color:#ef4444;">${inv}</strong> has been cancelled.
    </p>

    ${reason ? `
    <div style="background-color:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:12px;padding:16px;margin:16px 0;">
      <p style="${labelStyle}">Reason</p>
      <p style="color:#e5e5e5;font-size:14px;margin:0;">${reason}</p>
    </div>` : ""}

    ${itemsTable(order.items)}

    <hr style="${divider}"/>

    <p style="color:#9ca3af;font-size:13px;margin:0;">
      If you believe this was in error, please contact us at
      <a href="mailto:orders@revialife.com" style="color:#10b981;">orders@revialife.com</a>.
    </p>

    ${footerBlock()}
  </div>
</div>`;

  await send(email, `Order Cancelled — Invoice ${inv}`, html);
}

/* ------------------------------------------------------------------ */
/*  7. Welcome Email                                                   */
/* ------------------------------------------------------------------ */

export async function sendWelcomeEmail(name: string, email: string) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://revialife.com";

  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="${heading}">Welcome to ReVia Research Supply</h1>
    <p style="${subtext}">
      Hi ${name}, your account has been created. You now have access to our full catalog of research-grade peptides.
    </p>

    <div style="${infoBox}">
      <p style="color:#e5e5e5;font-size:14px;margin:0 0 8px;font-weight:600;">Your account benefits:</p>
      <ul style="color:#9ca3af;font-size:13px;margin:0;padding-left:20px;line-height:2;">
        <li>Track your orders and shipping status</li>
        <li>Earn reward points on every purchase ($1 = 1 point)</li>
        <li>Monthly drawing entries (every $50 spent = 1 entry)</li>
        <li>Exclusive access to member pricing tiers</li>
      </ul>
    </div>

    <div style="text-align:center;margin:24px 0;">
      <a href="${baseUrl}/shop" style="${btnStyle}">Browse Catalog</a>
    </div>

    <hr style="${divider}"/>

    <p style="color:#9ca3af;font-size:13px;margin:0;">
      <strong style="color:#e5e5e5;">Payment Methods:</strong> We accept Zelle, Wire Transfer, and Bitcoin (via Kraken Pay).
      No credit card processing — keeping costs low means better prices for you.
    </p>

    <hr style="${divider}"/>

    <p style="color:#9ca3af;font-size:13px;margin:0;">
      If you have any questions, email us at
      <a href="mailto:contact@revialife.com" style="color:#10b981;">contact@revialife.com</a>
      and we'll get back to you within 24 hours.
    </p>

    ${footerBlock()}
  </div>
</div>`;

  await send(email, "Welcome to ReVia Research Supply", html);
}

/* ------------------------------------------------------------------ */
/*  8. Email Verification                                              */
/* ------------------------------------------------------------------ */

export async function sendVerificationEmail(
  name: string,
  email: string,
  verifyToken: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://revialife.com";
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${verifyToken}`;

  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="${heading}">Verify Your Email</h1>
    <p style="${subtext}">
      Hi ${name}, thanks for creating a ReVia account. Please verify your email address to complete your registration.
    </p>

    <div style="text-align:center;margin:24px 0;">
      <a href="${verifyUrl}" style="${btnStyle}">Verify Email</a>
    </div>

    <hr style="${divider}"/>

    <p style="color:#9ca3af;font-size:13px;margin:0;">
      If you didn&rsquo;t create an account with ReVia, you can safely ignore this email.
    </p>

    <p style="color:#6b7280;font-size:11px;margin-top:16px;word-break:break-all;">
      Or copy this link: ${verifyUrl}
    </p>

    ${footerBlock()}
  </div>
</div>`;

  await send(email, "Verify Your Email — ReVia", html);
}

/* ------------------------------------------------------------------ */
/*  9. Password Reset                                                  */
/* ------------------------------------------------------------------ */

export async function sendPasswordResetEmail(
  name: string,
  email: string,
  resetToken: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://revialife.com";
  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="${heading}">Reset Your Password</h1>
    <p style="${subtext}">
      Hi ${name}, we received a request to reset your password. Click the button below to choose a new one.
    </p>

    <div style="text-align:center;margin:24px 0;">
      <a href="${resetUrl}" style="${btnStyle}">Reset Password</a>
    </div>

    <hr style="${divider}"/>

    <p style="color:#9ca3af;font-size:13px;margin:0;">
      This link expires in <strong style="color:#e5e5e5;">1 hour</strong>.
      If you didn&rsquo;t request this, you can safely ignore this email.
    </p>

    <p style="color:#6b7280;font-size:11px;margin-top:16px;word-break:break-all;">
      Or copy this link: ${resetUrl}
    </p>

    ${footerBlock()}
  </div>
</div>`;

  await send(email, "Reset Your Password — ReVia", html);
}

/* ------------------------------------------------------------------ */
/*  10. Drawing Winner Notification                                    */
/* ------------------------------------------------------------------ */

export async function sendDrawingWinnerEmail(
  name: string,
  email: string,
  prize: string,
  couponCode: string,
  month: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://revialife.com";
  const monthLabel = new Date(month + "-15").toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="${heading}">You're a Winner!</h1>
    <p style="${subtext}">
      Congratulations, ${name}! You've been selected as a winner in the ReVia ${monthLabel} Monthly Drawing.
    </p>

    <div style="${infoBox}text-align:center;">
      <p style="${labelStyle}">Your Prize</p>
      <p style="color:#10b981;font-size:22px;font-weight:700;margin:0 0 16px;">${prize}</p>
      <p style="${labelStyle}">Coupon Code</p>
      <p style="color:#10b981;font-size:20px;font-weight:700;margin:0;letter-spacing:2px;font-family:monospace;">${couponCode}</p>
    </div>

    <p style="color:#9ca3af;font-size:13px;margin:0 0 16px;">
      Apply this code at checkout to redeem your prize. This code expires in 90 days and can be used once.
    </p>

    <div style="text-align:center;margin:24px 0;">
      <a href="${baseUrl}/shop" style="${btnStyle}">Shop Now</a>
    </div>

    <hr style="${divider}"/>

    <p style="color:#9ca3af;font-size:13px;margin:0;">
      Keep ordering to earn entries for next month&rsquo;s drawing. Every $50 spent = 1 entry.
    </p>

    ${footerBlock()}
  </div>
</div>`;

  await send(email, `You Won the ${monthLabel} Drawing — ReVia`, html);
}

/* ------------------------------------------------------------------ */
/*  11. Payment Reminder (48h warning)                                 */
/* ------------------------------------------------------------------ */

export async function sendPaymentReminder(
  order: OrderWithItems,
  email: string
) {
  const inv = invoiceDisplay(order);

  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="color:#f59e0b;font-size:22px;font-weight:700;margin:0 0 8px;">Payment Reminder</h1>
    <p style="${subtext}">
      Hi ${order.name}, we haven't yet received payment for invoice <strong style="color:#f59e0b;">${inv}</strong>.
      Please complete your payment to avoid order cancellation.
    </p>

    <table style="width:100%;">
      <tr>
        <td style="color:#9ca3af;font-size:14px;">Amount Due</td>
        <td style="text-align:right;color:#ffffff;font-size:18px;font-weight:700;">${formatCents(order.total)}</td>
      </tr>
    </table>

    <hr style="${divider}"/>

    ${paymentInstructions(order.paymentMethod, inv, order.total)}

    <p style="color:#f59e0b;font-size:13px;margin:16px 0 0;text-align:center;font-weight:600;">
      Orders without payment within 48 hours of placement may be automatically cancelled.
    </p>

    ${footerBlock()}
  </div>
</div>`;

  await send(email, `Payment Reminder — Invoice ${inv}`, html);
}

/* ------------------------------------------------------------------ */
/*  12. Admin: New Order Alert                                         */
/* ------------------------------------------------------------------ */

export async function sendAdminNewOrderAlert(order: OrderWithItems) {
  const inv = invoiceDisplay(order);
  const paymentLabel =
    order.paymentMethod === "zelle" ? "Zelle" :
    order.paymentMethod === "wire" ? "Wire Transfer" :
    order.paymentMethod === "bitcoin" ? "Bitcoin (Kraken Pay)" : order.paymentMethod;

  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="${heading}">New Order Received</h1>
    <p style="${subtext}">A new order has been placed and is awaiting payment.</p>

    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="color:#9ca3af;font-size:13px;padding:4px 0;">Invoice</td>
        <td style="color:#10b981;font-size:13px;font-weight:700;text-align:right;">${inv}</td>
      </tr>
      <tr>
        <td style="color:#9ca3af;font-size:13px;padding:4px 0;">Customer</td>
        <td style="color:#e5e5e5;font-size:13px;text-align:right;">${order.name} (${order.email})</td>
      </tr>
      <tr>
        <td style="color:#9ca3af;font-size:13px;padding:4px 0;">Payment Method</td>
        <td style="color:#e5e5e5;font-size:13px;text-align:right;">${paymentLabel}</td>
      </tr>
      <tr>
        <td style="color:#9ca3af;font-size:13px;padding:4px 0;">Total</td>
        <td style="color:#ffffff;font-size:16px;font-weight:700;text-align:right;">${formatCents(order.total)}</td>
      </tr>
    </table>

    <hr style="${divider}"/>

    ${itemsTable(order.items)}

    <hr style="${divider}"/>

    ${shippingBlock(order)}

    <div style="text-align:center;margin:24px 0;">
      <a href="${process.env.NEXT_PUBLIC_URL || "https://revialife.com"}/admin/orders" style="${btnStyle}">View in Admin</a>
    </div>

    ${footerBlock()}
  </div>
</div>`;

  await send(ADMIN_EMAIL, `New Order: ${inv} — ${formatCents(order.total)} via ${paymentLabel}`, html);
}

/* ------------------------------------------------------------------ */
/*  13. Contact Form Auto-Reply                                        */
/* ------------------------------------------------------------------ */

export async function sendContactAutoReply(
  name: string,
  email: string,
  subject: string
) {
  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="${heading}">We Got Your Message</h1>
    <p style="${subtext}">
      Hi ${name}, thanks for reaching out. We've received your message regarding "<em>${subject}</em>"
      and will respond within 24 hours.
    </p>

    <hr style="${divider}"/>

    <p style="color:#9ca3af;font-size:13px;margin:0;">
      If your inquiry is urgent, you can also email us directly at
      <a href="mailto:contact@revialife.com" style="color:#10b981;">contact@revialife.com</a>.
    </p>

    ${footerBlock()}
  </div>
</div>`;

  await send(email, `We received your message — ReVia`, html);
}

/* ------------------------------------------------------------------ */
/*  14. Newsletter Welcome                                             */
/* ------------------------------------------------------------------ */

export async function sendNewsletterWelcome(email: string) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || "https://revialife.com";

  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="${heading}">You're on the List!</h1>
    <p style="${subtext}">
      Thanks for subscribing to the ReVia Research Supply newsletter.
      You'll be the first to hear about new products, promotions, and research updates.
    </p>

    <div style="text-align:center;margin:24px 0;">
      <a href="${baseUrl}/shop" style="${btnStyle}">Browse Catalog</a>
    </div>

    ${footerBlock()}
  </div>
</div>`;

  await send(email, "Welcome to the ReVia Newsletter", html);
}

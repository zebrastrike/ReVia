import nodemailer from "nodemailer";

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
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  total: number;
  status: string;
  items: OrderItemForEmail[];
  createdAt: Date | string;
}

/* ------------------------------------------------------------------ */
/*  Transporter                                                        */
/* ------------------------------------------------------------------ */

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && port && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass },
    });
  }

  // Preview mode – just log to console
  return null;
}

const FROM = '"ReVia Research Supply" <orders@revialife.com>';

async function send(to: string, subject: string, html: string) {
  const transporter = createTransporter();
  if (!transporter) {
    console.log("──── EMAIL PREVIEW ────");
    console.log(`To:      ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(html);
    console.log("───────────────────────");
    return;
  }
  await transporter.sendMail({ from: FROM, to, subject, html });
}

/* ------------------------------------------------------------------ */
/*  Shared styles                                                      */
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

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

/* ------------------------------------------------------------------ */
/*  Order Confirmation                                                 */
/* ------------------------------------------------------------------ */

export async function sendOrderConfirmation(
  order: OrderWithItems,
  email: string
) {
  const itemsHtml = order.items
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

  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="${heading}">Order Confirmed</h1>
    <p style="${subtext}">Thank you, ${order.name}! Your order <strong style="color:#10b981;">#${order.id.slice(-8).toUpperCase()}</strong> has been received.</p>

    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="border-bottom:1px solid rgba(255,255,255,0.08);">
          <th style="text-align:left;color:#6b7280;font-size:12px;padding-bottom:8px;text-transform:uppercase;">Item</th>
          <th style="text-align:center;color:#6b7280;font-size:12px;padding-bottom:8px;text-transform:uppercase;">Qty</th>
          <th style="text-align:right;color:#6b7280;font-size:12px;padding-bottom:8px;text-transform:uppercase;">Price</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <hr style="${divider}"/>

    <table style="width:100%;">
      <tr>
        <td style="color:#9ca3af;font-size:14px;">Total</td>
        <td style="text-align:right;color:#ffffff;font-size:18px;font-weight:700;">${formatCents(order.total)}</td>
      </tr>
    </table>

    <hr style="${divider}"/>

    <p style="color:#9ca3af;font-size:13px;margin:0;">
      <strong style="color:#e5e5e5;">Shipping to:</strong><br/>
      ${order.name}<br/>
      ${order.address}<br/>
      ${order.city}, ${order.state} ${order.zip}
    </p>

    <p style="${footer}">&copy; ReVia Research Supply &mdash; For research use only.</p>
  </div>
</div>`;

  await send(email, `Order Confirmed — #${order.id.slice(-8).toUpperCase()}`, html);
}

/* ------------------------------------------------------------------ */
/*  Shipping Notification                                              */
/* ------------------------------------------------------------------ */

export async function sendShippingNotification(
  order: OrderWithItems,
  email: string,
  trackingNumber: string
) {
  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="${heading}">Your Order Has Shipped!</h1>
    <p style="${subtext}">Great news, ${order.name}! Order <strong style="color:#10b981;">#${order.id.slice(-8).toUpperCase()}</strong> is on its way.</p>

    <div style="background-color:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:12px;padding:20px;text-align:center;">
      <p style="color:#9ca3af;font-size:12px;margin:0 0 4px;text-transform:uppercase;">Tracking Number</p>
      <p style="color:#10b981;font-size:18px;font-weight:700;margin:0;letter-spacing:1px;">${trackingNumber}</p>
    </div>

    <hr style="${divider}"/>

    <p style="color:#9ca3af;font-size:13px;margin:0 0 24px;">
      <strong style="color:#e5e5e5;">Shipping to:</strong><br/>
      ${order.name}<br/>
      ${order.address}<br/>
      ${order.city}, ${order.state} ${order.zip}
    </p>

    <p style="${footer}">&copy; ReVia Research Supply &mdash; For research use only.</p>
  </div>
</div>`;

  await send(email, `Your Order Has Shipped — #${order.id.slice(-8).toUpperCase()}`, html);
}

/* ------------------------------------------------------------------ */
/*  Welcome Email                                                      */
/* ------------------------------------------------------------------ */

export async function sendWelcomeEmail(name: string, email: string) {
  const html = `
<div style="${wrapper}">
  <div style="${card}">
    <h1 style="${heading}">Welcome to ReVia Research Supply</h1>
    <p style="${subtext}">Hi ${name}, your account has been created. You now have access to our full catalog of research-grade peptides.</p>

    <div style="text-align:center;margin:24px 0;">
      <a href="${process.env.NEXT_PUBLIC_URL || "https://revialife.com"}/shop" style="${btnStyle}">Browse Catalog</a>
    </div>

    <hr style="${divider}"/>

    <p style="color:#9ca3af;font-size:13px;margin:0;">
      If you have any questions, reply to this email and we&rsquo;ll get back to you within 24 hours.
    </p>

    <p style="${footer}">&copy; ReVia Research Supply &mdash; For research use only.</p>
  </div>
</div>`;

  await send(email, "Welcome to ReVia Research Supply", html);
}

/* ------------------------------------------------------------------ */
/*  Password Reset                                                     */
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
    <p style="${subtext}">Hi ${name}, we received a request to reset your password. Click the button below to choose a new one.</p>

    <div style="text-align:center;margin:24px 0;">
      <a href="${resetUrl}" style="${btnStyle}">Reset Password</a>
    </div>

    <hr style="${divider}"/>

    <p style="color:#9ca3af;font-size:13px;margin:0;">
      This link expires in <strong style="color:#e5e5e5;">1 hour</strong>. If you didn&rsquo;t request this, you can safely ignore this email.
    </p>

    <p style="color:#6b7280;font-size:11px;margin-top:16px;word-break:break-all;">
      Or copy this link: ${resetUrl}
    </p>

    <p style="${footer}">&copy; ReVia Research Supply &mdash; For research use only.</p>
  </div>
</div>`;

  await send(email, "Reset Your Password — ReVia", html);
}

/* ------------------------------------------------------------------ */
/*  Email Verification                                                 */
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
    <p style="${subtext}">Hi ${name}, thanks for creating a ReVia account. Please verify your email address to complete your registration.</p>

    <div style="text-align:center;margin:24px 0;">
      <a href="${verifyUrl}" style="${btnStyle}">Verify Email</a>
    </div>

    <hr style="${divider}"/>

    <p style="color:#9ca3af;font-size:13px;margin:0;">
      If you didn&rsquo;t create an account with ReVia, you can safely ignore this email.
    </p>

    <p style="${footer}">&copy; ReVia Research Supply &mdash; For research use only.</p>
  </div>
</div>`;

  await send(email, "Verify Your Email — ReVia", html);
}

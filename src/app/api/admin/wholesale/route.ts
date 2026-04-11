export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { Resend } from "resend";

const WHOLESALE_EMAIL = "orders@integrativepracticesolutions.com";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, notes } = await request.json() as {
      items: Array<{ sku: string; productName: string; variant: string; quantity: number; wholesalePrice: number }>;
      notes?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    const totalCost = items.reduce((s, i) => s + i.wholesalePrice * i.quantity, 0);
    const orderDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const orderRef = `WO-${Date.now().toString(36).toUpperCase()}`;

    // Build email HTML
    const rows = items.map(i => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;">${i.productName}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;">${i.variant}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;">${i.sku}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;text-align:center;">${i.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;text-align:right;">$${(i.wholesalePrice / 100).toFixed(2)}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;font-size:14px;text-align:right;font-weight:600;">$${((i.wholesalePrice * i.quantity) / 100).toFixed(2)}</td>
      </tr>
    `).join("");

    const html = `
      <div style="font-family:-apple-system,sans-serif;max-width:800px;margin:0 auto;">
        <h1 style="color:#1a1a1a;font-size:24px;margin-bottom:4px;">Wholesale Order — ReVia Research Supply</h1>
        <p style="color:#666;font-size:14px;margin-top:0;">Ref: ${orderRef} | Date: ${orderDate}</p>
        <p style="color:#666;font-size:14px;">Ordered by: ${user.name} (${user.email})</p>

        <table style="width:100%;border-collapse:collapse;margin:24px 0;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;color:#666;">Product</th>
              <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;color:#666;">Variant</th>
              <th style="padding:10px 12px;text-align:left;font-size:12px;text-transform:uppercase;color:#666;">SKU</th>
              <th style="padding:10px 12px;text-align:center;font-size:12px;text-transform:uppercase;color:#666;">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;text-transform:uppercase;color:#666;">Unit Price</th>
              <th style="padding:10px 12px;text-align:right;font-size:12px;text-transform:uppercase;color:#666;">Line Total</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
          <tfoot>
            <tr style="background:#f5f5f5;">
              <td colspan="5" style="padding:12px;text-align:right;font-weight:700;font-size:16px;">Order Total:</td>
              <td style="padding:12px;text-align:right;font-weight:700;font-size:16px;">$${(totalCost / 100).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        ${notes ? `<div style="margin:16px 0;padding:16px;background:#f9f9f9;border-radius:8px;"><p style="font-size:12px;color:#666;margin:0 0 4px;text-transform:uppercase;">Notes:</p><p style="font-size:14px;color:#333;margin:0;">${notes}</p></div>` : ""}

        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
        <p style="color:#999;font-size:12px;">Revia LLC — 15510 Old Wedgewood Ct, Fort Myers, FL 33908</p>
      </div>
    `;

    // Send via Resend
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "ReVia Research Supply <orders@revialife.com>",
        to: WHOLESALE_EMAIL,
        cc: user.email,
        subject: `Wholesale Order ${orderRef} — $${(totalCost / 100).toFixed(2)}`,
        html,
      });
    }

    return NextResponse.json({
      success: true,
      orderRef,
      totalCost,
      itemCount: items.reduce((s, i) => s + i.quantity, 0),
    });
  } catch (err) {
    console.error("POST /api/admin/wholesale error:", err);
    return NextResponse.json({ error: "Failed to submit wholesale order" }, { status: 500 });
  }
}

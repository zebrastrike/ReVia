export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const cookieStore = await cookies();
  const user = await getAuthUser(cookieStore);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = [
    "Order ID,Date,Customer,Email,Status,Items,Total,Address,City,State,Zip,Tracking",
  ];

  for (const order of orders) {
    const items = order.items
      .map((i) => `${i.productName} (${i.variantLabel}) x${i.quantity}`)
      .join("; ");
    rows.push(
      [
        order.id,
        order.createdAt.toISOString().split("T")[0],
        `"${order.name}"`,
        order.email,
        order.status,
        `"${items}"`,
        (order.total / 100).toFixed(2),
        `"${order.address}"`,
        `"${order.city}"`,
        order.state,
        order.zip,
        order.tracking ?? "",
      ].join(",")
    );
  }

  const csv = rows.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="revia-orders-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}

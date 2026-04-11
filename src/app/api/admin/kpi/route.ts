export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const user = await getAuthUser(cookieStore);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // ── Orders data ──
    const allOrders = await prisma.order.findMany({
      where: { paymentStatus: "confirmed" },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });

    const pendingOrders = await prisma.order.findMany({
      where: { paymentStatus: "awaiting" },
    });

    // ── Time-based revenue ──
    const thisMonthOrders = allOrders.filter(o => o.createdAt >= startOfMonth);
    const lastMonthOrders = allOrders.filter(o => o.createdAt >= startOfLastMonth && o.createdAt <= endOfLastMonth);
    const ytdOrders = allOrders.filter(o => o.createdAt >= startOfYear);

    const thisMonthRevenue = thisMonthOrders.reduce((s, o) => s + o.total, 0);
    const lastMonthRevenue = lastMonthOrders.reduce((s, o) => s + o.total, 0);
    const ytdRevenue = ytdOrders.reduce((s, o) => s + o.total, 0);
    const allTimeRevenue = allOrders.reduce((s, o) => s + o.total, 0);

    // ── COGS estimate (use costPrice from variants if available) ──
    const variants = await prisma.productVariant.findMany({
      select: { sku: true, costPrice: true, price: true },
    });
    const costMap = new Map(variants.map(v => [v.sku, v.costPrice ?? Math.round(v.price * 0.28)])); // fallback ~28% of retail

    let thisMonthCogs = 0;
    let ytdCogs = 0;
    for (const order of allOrders) {
      let orderCogs = 0;
      for (const item of order.items) {
        // Estimate COGS as ~28% of item price if no cost data
        orderCogs += Math.round(item.price * item.quantity * 0.28);
      }
      if (order.createdAt >= startOfMonth) thisMonthCogs += orderCogs;
      if (order.createdAt >= startOfYear) ytdCogs += orderCogs;
    }

    // ── Customer stats ──
    const totalCustomers = await prisma.user.count({ where: { role: "customer" } });
    const newCustomersThisMonth = await prisma.user.count({
      where: { role: "customer", createdAt: { gte: startOfMonth } },
    });

    // ── Inventory stats ──
    const allVariants = await prisma.productVariant.findMany({
      include: { product: { select: { active: true } } },
    });
    const activeVariants = allVariants.filter(v => v.product.active);
    const outOfStock = activeVariants.filter(v => v.stockStatus === "out_of_stock").length;
    const lowStock = activeVariants.filter(v => v.quantity > 0 && v.quantity <= v.reorderThreshold).length;
    const totalInventoryValue = activeVariants.reduce((s, v) => s + (v.costPrice ?? Math.round(v.price * 0.28)) * v.quantity, 0);

    // ── Top products (by revenue) ──
    const productRevenue = new Map<string, { name: string; revenue: number; units: number }>();
    for (const order of thisMonthOrders) {
      for (const item of order.items) {
        const key = item.productName;
        const existing = productRevenue.get(key) ?? { name: key, revenue: 0, units: 0 };
        existing.revenue += item.price * item.quantity;
        existing.units += item.quantity;
        productRevenue.set(key, existing);
      }
    }
    const topProducts = Array.from(productRevenue.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // ── Monthly revenue chart (last 6 months) ──
    const monthlyRevenue: Array<{ month: string; revenue: number; orders: number }> = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const monthOrders = allOrders.filter(o => o.createdAt >= start && o.createdAt <= end);
      monthlyRevenue.push({
        month: start.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        revenue: monthOrders.reduce((s, o) => s + o.total, 0),
        orders: monthOrders.length,
      });
    }

    // ── Payment method breakdown ──
    const paymentMethods: Record<string, number> = {};
    for (const order of thisMonthOrders) {
      const method = order.paymentMethod || "unknown";
      paymentMethods[method] = (paymentMethods[method] ?? 0) + 1;
    }

    // ── Average order value ──
    const avgOrderValue = thisMonthOrders.length > 0
      ? thisMonthRevenue / thisMonthOrders.length
      : 0;

    return NextResponse.json({
      revenue: {
        thisMonth: thisMonthRevenue,
        lastMonth: lastMonthRevenue,
        ytd: ytdRevenue,
        allTime: allTimeRevenue,
        monthOverMonth: lastMonthRevenue > 0
          ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
          : null,
      },
      profitLoss: {
        thisMonthRevenue,
        thisMonthCogs,
        thisMonthGrossProfit: thisMonthRevenue - thisMonthCogs,
        thisMonthMargin: thisMonthRevenue > 0
          ? ((thisMonthRevenue - thisMonthCogs) / thisMonthRevenue * 100).toFixed(1)
          : "0",
        ytdRevenue,
        ytdCogs,
        ytdGrossProfit: ytdRevenue - ytdCogs,
      },
      orders: {
        thisMonth: thisMonthOrders.length,
        lastMonth: lastMonthOrders.length,
        pending: pendingOrders.length,
        pendingValue: pendingOrders.reduce((s, o) => s + o.total, 0),
        avgOrderValue,
      },
      customers: {
        total: totalCustomers,
        newThisMonth: newCustomersThisMonth,
      },
      inventory: {
        totalVariants: activeVariants.length,
        outOfStock,
        lowStock,
        inventoryValue: totalInventoryValue,
      },
      topProducts,
      monthlyRevenue,
      paymentMethods,
    });
  } catch (err) {
    console.error("GET /api/admin/kpi error:", err);
    return NextResponse.json({ error: "Failed to fetch KPI data" }, { status: 500 });
  }
}

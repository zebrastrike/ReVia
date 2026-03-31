import { prisma } from "@/lib/prisma";
import CouponManager from "@/components/CouponManager";
export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Serialize dates to strings for client component
  const serialized = coupons.map((c) => ({
    ...c,
    expiresAt: c.expiresAt ? c.expiresAt.toISOString() : null,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-stone-800">Coupons</h1>
        <p className="text-sm text-stone-500">
          {coupons.length} coupon{coupons.length !== 1 ? "s" : ""}
        </p>
      </div>

      <CouponManager initialCoupons={serialized} />
    </div>
  );
}

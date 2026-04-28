import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { researchCompounds } from "@/data/research-compounds";
export const dynamic = "force-dynamic";

const SITE = "https://revialife.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, blogPosts, stacks] = await Promise.all([
    prisma.product.findMany({ select: { slug: true } }),
    prisma.category.findMany({ select: { slug: true } }),
    prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, publishedAt: true },
    }),
    // stacks are products in the "Stacks" category — surface them under /stacks/[slug]
    prisma.product.findMany({
      where: { category: { name: { equals: "Stacks", mode: "insensitive" } } },
      select: { slug: true },
    }),
  ]);

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE}/shop/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE}/shop?category=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((b) => ({
    url: `${SITE}/blog/${b.slug}`,
    lastModified: b.publishedAt ?? new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const researchUrls: MetadataRoute.Sitemap = researchCompounds.map((c) => ({
    url: `${SITE}/research/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const stackUrls: MetadataRoute.Sitemap = stacks.map((s) => ({
    url: `${SITE}/stacks/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const policySlugs = [
    "aup",
    "ccpa",
    "cookies",
    "disclaimer",
    "payments",
    "privacy",
    "refunds",
    "shipping",
    "terms",
  ];
  const policyUrls: MetadataRoute.Sitemap = policySlugs.map((slug) => ({
    url: `${SITE}/policies/${slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    { url: SITE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/research`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/stacks`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/learn`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/compare`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/why-us`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  return [
    ...staticUrls,
    ...productUrls,
    ...stackUrls,
    ...researchUrls,
    ...blogUrls,
    ...categoryUrls,
    ...policyUrls,
  ];
}

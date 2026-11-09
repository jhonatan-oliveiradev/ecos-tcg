import { notFound } from "next/navigation";
import App from "../app";
import { HUB_NAV } from "../../ui/hub/navigation";
export const dynamicParams = false;
export function generateStaticParams() {
  return HUB_NAV.filter((item) => item.href !== "/").map((item) => ({
    section: item.href.slice(1),
  }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const item = HUB_NAV.find((entry) => entry.href === `/${section}`);
  return { title: `${item?.label ?? "Ecos"} — ECOS` };
}
export default async function HubPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const item = HUB_NAV.find((entry) => entry.href === `/${section}`);
  if (!item) notFound();
  return <App key={item.id} screen={item.id} />;
}

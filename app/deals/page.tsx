import { TickerPage } from "@/components/site";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <TickerPage searchParams={await searchParams} />;
}

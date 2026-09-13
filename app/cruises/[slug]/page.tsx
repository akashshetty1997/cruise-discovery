import { notFound } from "next/navigation";
import { DetailPage } from "@/components/site";
import { getCruiseBySlug } from "@/lib/data";
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const cruise = getCruiseBySlug((await params).slug); if (!cruise) notFound(); return <DetailPage cruise={cruise} />; }

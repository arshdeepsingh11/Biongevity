import { ServiceView, serviceMeta, serviceParams } from "@/views/uae/Service";

type P = { params: Promise<{ dept: string; service: string }> };
export const dynamicParams = false;
export const generateStaticParams = serviceParams;
export async function generateMetadata({ params }: P) { const p = await params; return serviceMeta(p.dept, p.service, "en"); }
export default async function Page({ params }: P) { const p = await params; return <ServiceView dept={p.dept} slug={p.service} l="en" />; }

import { DepartmentView, deptMeta, deptParams } from "@/views/uae/Department";

type P = { params: Promise<{ dept: string }> };
export const dynamicParams = false;
export const generateStaticParams = deptParams;
export const generateMetadata = async ({ params }: P) => deptMeta((await params).dept, "ar");
export default async function Page({ params }: P) { return <DepartmentView id={(await params).dept} l="ar" />; }

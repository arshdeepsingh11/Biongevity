import type { Metadata } from "next";
import { Dashboard } from "@/components/pages/Dashboard";

export const metadata: Metadata = { title: "Member Dashboard", robots: { index: false } };
export default function DashboardPage() { return <Dashboard />; }

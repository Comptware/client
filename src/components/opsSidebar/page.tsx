"use client";
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function OpsSidebar() {
  const { user } = useUser();

  const isAdmin = user?.role === "ADMIN";

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 h-screen">
      <nav className="space-y-3">
        <Link href="/ops">Overview</Link>
        <Link href="/ops/sensors">Sensors</Link>
        <Link href="/ops/alerts">Alerts</Link>
        <Link href="/ops/commands">Command Center</Link>

        {isAdmin && (
          <div className="mt-8 border-t pt-4">
            <p className="text-sm text-gray-400 uppercase">Admin-only</p>
            <Link href="/admin/users">Users</Link>
            <Link href="/admin/stripe-events">Payments</Link>
            <Link href="/admin/projects">Projects</Link>
          </div>
        )}
      </nav>
    </aside>
  );
}

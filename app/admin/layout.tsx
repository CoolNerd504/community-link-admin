import { AdminHeader } from "@/components/admin-shared/admin-header"
import { AdminSidebar } from "@/components/admin-shared/admin-sidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#f5f5f5] flex">
            {/* Sidebar Desktop */}
            <AdminSidebar />

            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Header can now be simplified or stick to top */}
                {/* We might hide the navigation items in header since they are in sidebar now */}
                <AdminHeader />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    )
}

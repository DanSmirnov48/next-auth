import { SiteHeader } from "@/components/site-header";
import { SidebarNav } from "@/components/side-nav";
import { dashboardConfig } from "@/config/dashboard";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function ProtectedLayout({ children }: React.PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
                    <ScrollArea className="py-2 pr-2">
                        <SidebarNav items={dashboardConfig.sidebarNav} className="p-4" />
                    </ScrollArea>
                </aside>
                <main className="flex w-full flex-col overflow-hidden">{children}</main>
            </div>
        </div>
    );
}

"use client"

import { buttonVariants } from "@/components/ui/button"
import { CoinsIcon, HomeIcon, Layers2Icon, Link, ShieldCheckIcon, SquareDashedMousePointer } from "lucide-react"
import { usePathname } from "next/navigation"

const routes = [
  {
    href: "/",
    label: "Home",
    icon: HomeIcon
  },
  {
    href: "workflows",
    label: "Workflows",
    icon: Layers2Icon
  },
  {
    href: "settings",
    label: "Settings",
    icon: ShieldCheckIcon
  },
  {
    href: "billing",
    label: "Billing",
    icon: CoinsIcon
  },
]

const DesktopSidebar = () => {
  const pathname = usePathname();
  const activeRoute  = routes.find(
    (route) => route.href.length > 1 && pathname.includes(route.href)
  ) || routes[0];

  return (
    <div className="hidden relative md:block min-w-[280px] h-screen
     overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground
     text-muted-foreground border-r-2 border-separate flex-1
     ">
      <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
        <Link href="/" className="text-2xl font-extrabold items-center gap-2">
          <span className="text-stone-500">Dérive</span>
          <div className="rounded-xl bg-stone-500 p-2">
            <SquareDashedMousePointer size={4} className="stroke-white" />
          </div>
        </Link>
      </div>

      <div className="flex justify-content flex-col p-2 text-blue-500">
        {
          routes.map(route => (
            <Link key={route.href} href={route.href} className={buttonVariants({
              variant: activeRoute.href === route.href ? "sidebarActiveItem" : "sidebarItem"
            })}>
              <route.icon size={20} />
              {route.label}
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default DesktopSidebar

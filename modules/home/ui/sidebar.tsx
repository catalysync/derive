"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CoinsIcon, HomeIcon, Layers2Icon, Link, MenuIcon, ShieldCheckIcon, SquareDashedMousePointer } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"

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
    <div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen
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

export function MobileSidebar() {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
  const activeRoute  = routes.find(
    (route) => route.href.length > 1 && pathname.includes(route.href)
  ) || routes[0];

  return  <div className="block border-separate bg-background md:hidden">
    <nav className="container flex items-center justify-between px-8">
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[400px] sm:w-[540px] space-y-4" side={"left"}>
          <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
            <Link href="/" className="text-2xl font-extrabold items-center gap-2">
              <span className="text-stone-500">Dérive</span>
              <div className="rounded-xl bg-stone-500 p-2">
                <SquareDashedMousePointer size={4} className="stroke-white" />
              </div>
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            {
              routes.map(route => (
                <Link key={route.href} href={route.href} className={buttonVariants({
                  variant: activeRoute.href === route.href ? "sidebarActiveItem" : "sidebarItem"
                })} onClick={() => setOpen(prev => !prev)}>
                  <route.icon size={20} />
                  {route.label}
                </Link>
              ))
            }
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  </div>
}

export default DesktopSidebar

'use client'
import { Home, Users2 } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// import Home from '@/app/page'
import { AddIcon, CategoryIcon } from '@/assets/icons'
import { cn } from '@/lib/utils'
const paths = [
  { href: '/', label: 'Home', icon: <Home /> },
  { href: '/customer', label: 'Users', icon: <Users2 /> },
  {
    href: '/category',
    label: 'Category',
    icon: <CategoryIcon className="w-8 h-6" />
  },
  {
    href: '/sales',
    label: 'Add Sales',
    icon: <AddIcon className="h-8 w-6" />
  }
]
const Navbar = () => {
  const activePath = usePathname()
  const isActive = (url: string) => {
    const regex = new RegExp(`^${url}(\\/|$)`)
    return regex.test(activePath)
  }
  return (
    <aside className="fixed sm:inset-y-0 bottom-0 left-0 z-10 sm:w-14 w-full h-16 sm:h-full  sm:border-r border-t  bg-background flex items-center ">
      <nav className="flex sm:flex-col justify-between sm:justify-start items-center gap-4 sm:px-2 px-8 sm:py-5 w-full sm:w-14">
        {paths.map((path, index) => (
          <Link
            key={index}
            href={path.href}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
              {
                'bg-accent hover:bg-accent/80 text-accent-foreground hover:text-accent-foreground':
                  isActive(path.href)
              }
            )}
          >
            {path.icon}
            <span className="sr-only">{path.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}

export default Navbar
{
  /* <Link
href="#"
className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
>
<ShoppingCart className="h-5 w-5" />
<span className="sr-only">Orders</span>
</Link> */
}
{
  /* <Link
          href="#"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
        >
          <LineChart className="h-5 w-5" />
          <span className="sr-only">Analytics</span>
        </Link> */
}

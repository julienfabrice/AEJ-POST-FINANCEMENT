import { useRouterState } from '@tanstack/react-router'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { PAGE_TITLES, AGENT_NAV_ITEMS, BENEF_NAV_ITEMS } from '@/constants/routes'

export function TopBar() {
  const router = useRouterState()
  const pathname = router.location.pathname

  const allItems = [...AGENT_NAV_ITEMS, ...BENEF_NAV_ITEMS]
  const currentItem = allItems.find((item) => item.path === pathname)
  const pageTitle = PAGE_TITLES[pathname as keyof typeof PAGE_TITLES] ?? 'AEJ'

  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-4 px-[26px] py-[14px] border-b border-[#E5EAF1]"
      style={{
        background: 'rgba(243, 245, 248, 0.86)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Fil d'ariane Shadcn */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink className="text-[#5A6B80] hover:text-[#C85E18]">
              AEJ
            </BreadcrumbLink>
          </BreadcrumbItem>
          {currentItem?.group && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink className="text-[#5A6B80]">
                  {currentItem.group}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-[#131C29] font-semibold">
              {pageTitle}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex-1" />

      {/* Recherche globale */}
      <div className="relative w-[230px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B80]" />
        <Input
          placeholder="Rechercher..."
          className="pl-9 h-9 border-[#E5EAF1] bg-white text-sm"
        />
      </div>
    </header>
  )
}

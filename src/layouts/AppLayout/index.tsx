import { Outlet } from '@tanstack/react-router'
import { HeaderNav } from './UI/HeaderNav'
import { TopBar } from './UI/TopBar'

export function AppLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F3F5F8]">
      <HeaderNav />

      {/* Zone principale */}
      <div className="flex flex-col flex-1 h-full overflow-y-auto">
        <TopBar />
        <main className="flex-1 px-[26px] py-6 pb-[60px] w-full min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

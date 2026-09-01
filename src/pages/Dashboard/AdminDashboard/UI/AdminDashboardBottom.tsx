import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import { projetsServices } from '@/services/projets.services'
import { DashboardProjectsGrid } from '../../shared/components/DashboardProjectsGrid'

export function AdminDashboardBottom() {
  const { data, isLoading } = projetsServices.useGetAll(1, 5)
  const projects = data?.data ?? []

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-[#E5EAF1] shadow-[0_1px_3px_rgba(0,0,0,0.04)] rounded-[7px] overflow-hidden">
        <CardHeader className="border-b border-[#EEF2F7] py-3 px-4 flex flex-row items-center justify-between">
          <CardTitle className="text-[14px] font-bold text-[#131C29]">Dossiers récents</CardTitle>
          <a href="#" className="flex items-center text-xs font-semibold text-[#5A6B80] hover:text-[#131C29] transition-colors">
            Tout voir
            <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </a>
        </CardHeader>
        <CardContent className="p-0 border-t border-slate-100">
          <DashboardProjectsGrid projects={projects} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}


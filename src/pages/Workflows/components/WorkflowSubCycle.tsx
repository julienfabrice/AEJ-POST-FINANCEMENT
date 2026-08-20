import { Edit2, Trash2, Users, FileText, Clock } from 'lucide-react'

interface WorkflowSubCycleProps {
  titre: string
  roles?: string[]
  documents?: string[]
  duree?: string
}

export function WorkflowSubCycle({ titre, roles = [], documents = [], duree }: WorkflowSubCycleProps) {
  return (
    <div className="border-l-2 border-[#EEF2F7] pt-3 pb-1 pl-4 mt-3.5">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-[13px] text-slate-600 leading-relaxed">
          {titre}
        </p>
        <span className="flex gap-1 flex-none ml-2">
          <button className="flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:text-[#131C29] hover:bg-slate-100 transition-colors" title="Modifier">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button className="flex items-center justify-center w-7 h-7 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Supprimer">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {roles.map((role, i) => (
          <span key={`role-${i}`} className="text-[11.5px] bg-[#f4f6fa] border border-[#EEF2F7] rounded-[7px] px-2.5 py-1 text-[#5A6B80] inline-flex gap-1.5 items-center">
            <Users className="w-3.5 h-3.5" />
            <b className="text-[#131C29] font-semibold">{role}</b>
          </span>
        ))}
        {documents.map((doc, i) => (
          <span key={`doc-${i}`} className="text-[11.5px] bg-[#f4f6fa] border border-[#EEF2F7] rounded-[7px] px-2.5 py-1 text-[#5A6B80] inline-flex gap-1.5 items-center">
            <FileText className="w-3.5 h-3.5" />
            {doc}
          </span>
        ))}
        {duree && (
          <span className="text-[11.5px] bg-[#f4f6fa] border border-[#EEF2F7] rounded-[7px] px-2.5 py-1 text-[#5A6B80] inline-flex gap-1.5 items-center">
            <Clock className="w-3.5 h-3.5" />
            {duree}
          </span>
        )}
      </div>
    </div>
  )
}

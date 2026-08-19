import { Eye, History, Pencil, Trash2 } from 'lucide-react'

export const ActionsCellRenderer = () => {
  return (
    <div className="flex items-center justify-end gap-1 h-full">
      <button className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-[#131C29] hover:bg-slate-100 transition-colors" title="Voir le profil">
        <Eye className="w-4 h-4" />
      </button>
      <button className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-[#131C29] hover:bg-slate-100 transition-colors" title="Antécédents">
        <History className="w-4 h-4" />
      </button>
      <button className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-[#131C29] hover:bg-slate-100 transition-colors" title="Modifier">
        <Pencil className="w-4 h-4" />
      </button>
      <button className="flex items-center justify-center w-8 h-8 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Supprimer">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

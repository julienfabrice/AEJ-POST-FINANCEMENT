import { Link } from '@tanstack/react-router'
import { FileQuestion, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC] text-center px-4">
      <div className="w-24 h-24 bg-[#E7722B]/10 rounded-[24px] flex items-center justify-center mb-6">
        <FileQuestion className="w-12 h-12 text-[#E7722B]" />
      </div>
      <h1 className="text-6xl font-black text-[#131C29] mb-2 tracking-tight">404</h1>
      <h2 className="text-2xl font-bold text-[#131C29] mb-4">Page introuvable</h2>
      <p className="text-[#5A6B80] max-w-md mb-8 text-base">
        Oups ! La page que vous essayez de consulter n'existe pas, a été supprimée ou a été déplacée.
      </p>
      
      <Button asChild size="lg" className="bg-[#131C29] hover:bg-[#1e2a3c] text-white rounded-xl h-12 px-6 shadow-md transition-all">
        <Link to="/">
          <ArrowLeft className="mr-2 w-5 h-5" />
          Retourner à l'accueil
        </Link>
      </Button>
    </div>
  )
}

'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';
import { formatDate } from '@/helpers/age';
import { useProjetsStore } from '@/store/useProjetsStore';

import { ProjetInfos } from './components/ProjetInfos';
import { PromoteurInfos } from './components/PromoteurInfos';
import { LocalisationInfos } from './components/LocalisationInfos';
import { RattachementsInfos } from './components/RattachementsInfos';

export function ProjetDetailsSheet() {
  const { selectedProjet: projet, setSelectedProjet } = useProjetsStore();
  
  const open = !!projet;
  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) setSelectedProjet(null);
  };

  if (!projet) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {projet.intitule}
            <Badge
              variant="outline"
              className={cn(
                'gap-1.5 whitespace-nowrap bg-slate-50',
              )}
            >
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  projet.statut === 'EN_REMBOURSEMENT' || projet.statut === 'TERMINE' ? 'bg-success' : 'bg-orange-500',
                )}
              />
              {projet.statut ? projet.statut.replace(/_/g, ' ') : 'BROUILLON'}
            </Badge>
          </SheetTitle>
          <SheetDescription className="font-mono text-xs flex items-center gap-2">
            {projet.code ?? '—'} 
            {projet.created_at && (
              <span className="text-muted-foreground font-sans">
                • Ajouté le {formatDate(projet.created_at)}
              </span>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-6 overflow-y-auto px-1 sm:px-4 pb-6 mt-4 custom-scrollbar">
          <ProjetInfos projet={projet} />
          <PromoteurInfos projet={projet} />
          <LocalisationInfos projet={projet} />
          <RattachementsInfos projet={projet} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

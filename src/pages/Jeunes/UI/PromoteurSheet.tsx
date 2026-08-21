'use client';

import type { LucideIcon } from 'lucide-react';
import { FolderKanban, IdCard, Layers, Phone, User } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/generics/emptyState';

import { cn } from '@/lib/utils';
import { formatAge, formatDate } from '@/helpers/age';
import { ProjetCard } from './ProjetCard';
import { refLabel, type REF_ITEM_T } from '@/types/referentials.types';
import type { PROMOTEUR_T } from '@/types/promoteurs.types';

/**
 * Libellé d'une relation eager-loaded.
 *
 * `GET /promoteurs` embarque déjà les relations : aucun référentiel à charger.
 * La clé porteuse du libellé varie (`libelle`, `nom`…), d'où `refLabel`.
 * Renvoie `undefined` sur une relation absente, pour que `<Field>` applique son
 * propre repli et que tous les champs vides se ressemblent.
 */
const label = (item: REF_ITEM_T | null | undefined) =>
  item ? refLabel(item) : undefined;

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm text-foreground">{value || '—'}</dd>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="size-4 text-muted-foreground" />
        {title}
      </h3>
      {children}
    </section>
  );
}

/**
fiche de Details du promoteur
 */
export function PromoteurDetailSheet({
  promoteur,
  onOpenChange,
}: {
  promoteur: PROMOTEUR_T | null;
  onOpenChange: (open: boolean) => void;
}) {
  const actif : boolean = (promoteur?.statut  ?? false) ;
  const age = formatAge(promoteur?.datenaissance);
  // Projects are embedded on the promoteur row (filter-with-projects).
  const projets = promoteur?.micro_projets ?? [];
  return (
    <Sheet open={!!promoteur} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-xl">
        {promoteur && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                {promoteur.prenom} {promoteur.nom}
                <Badge
                  variant="outline"
                  className={cn(
                    'gap-1.5',
                    actif
                      ? 'border-success/30 bg-success/10 text-success'
                      : 'text-muted-foreground',
                  )}
                >
                  <span
                    className={cn(
                      'size-1.5 rounded-full',
                      actif ? 'bg-success' : 'bg-muted-foreground',
                    )}
                  />
                  {actif ? 'Actif' : 'Inactif'}
                </Badge>
              </SheetTitle>
              <SheetDescription className="font-mono text-xs">
                {promoteur.matriculeaej ?? '—'}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-6 overflow-y-auto px-4 pb-6">
              <Section title="Coordonnées" icon={Phone}>
                <dl className="grid grid-cols-2 gap-4">
                  <Field label="Email" value={promoteur.email} />
                  <Field label="Téléphone" value={promoteur.telephone} />
                </dl>
              </Section>

              <Section title="État civil" icon={User}>
                <dl className="grid grid-cols-2 gap-4">
                  <Field label="Date de naissance" value={formatDate(promoteur.datenaissance)} />
                  <Field label="Âge" value={age != null ? `${age} ans` : undefined} />
                  <Field label="Lieu de naissance" value={promoteur.lieunaissance} />
                  <Field label="Nom du père" value={promoteur.nomdupere} />
                  <Field label="Nom de la mère" value={promoteur.nomdelamere} />
                  <Field label="Raison sociale" value={promoteur.raison_sociale} />
                </dl>
              </Section>

              <Section title="Documents" icon={IdCard}>
                <dl className="grid grid-cols-2 gap-4">
                  <Field label="N° CNI" value={promoteur.numerocni} />
                  <Field label="N° CMU" value={promoteur.numerocmu} />
                  <Field label="N° CNPS" value={promoteur.numerocnps} />
                </dl>
              </Section>

              <Section title="Rattachements" icon={Layers}>
                <dl className="grid grid-cols-2 gap-4">
                  <Field label="Sexe" value={label(promoteur.sexe)} />
                  <Field label="Agence régionale" value={label(promoteur.agence_regionale)} />
                  <Field label="Lieu d'habitation" value={label(promoteur.lieu_habitation)} />
                  <Field label="Secteur d'activité" value={label(promoteur.secteur_activite)} />
                  <Field label="Sous-secteur" value={label(promoteur.sous_secteur_activite)} />
                  <Field label="Niveau d'étude" value={label(promoteur.niveau_etude)} />
                  <Field
                    label="Situation matrimoniale"
                    value={label(promoteur.situation_matrimoniale)}
                  />
                  <Field label="Type de pièce" value={label(promoteur.type_piece_identite)} />
                  {/* Drapeau volontairement laissé de côté pour l'instant :
                      seul le libellé du pays est affiché. */}
                  <Field label="Pays de nationalité" value={label(promoteur.pays_nationalite)} />
                  <Field
                    label="Situation handicap"
                    value={label(promoteur.type_situation_handicap)}
                  />
                  {/* `handicap` est un VARCHAR(100) LIBRE (info/schema.v2.sql),
                      distinct de la catégorie ci-dessus : c'est la précision
                      saisie à la main. On ne l'affiche que si elle existe. */}
                  {promoteur.handicap && (
                    <Field label="Précision handicap" value={promoteur.handicap} />
                  )}
                </dl>
              </Section>

              <Section title="Projets" icon={FolderKanban}>
                {projets.length > 0 ? (
                  <div className="space-y-2">
                    {projets.map((projet) => (
                      <ProjetCard key={projet.id} projet={projet} />
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    variant="card"
                    icon={FolderKanban}
                    title="Aucun projet"
                    description="Ce promoteur n'a pas encore de micro-projet enregistré."
                  />
                )}
              </Section>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

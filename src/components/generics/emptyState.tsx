import type { LucideIcon } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const emptyStateVariants = cva(
  'flex flex-col items-center justify-center gap-3 text-center',
  {
    variants: {
      variant: {
        
        card: 'rounded-xl border border-dashed border-border/60 bg-muted/20 px-6 py-12',

        bare: 'px-6 py-10',
      },
    },
    defaultVariants: {
      variant: 'card',
    },
  },
);

interface EmptyStateProps extends VariantProps<typeof emptyStateVariants> {

  icon?: LucideIcon;

  title: React.ReactNode;

  description?: React.ReactNode;

  children?: React.ReactNode;
  className?: string;
}

/**
Composant reutilisable a afficher quand la liste est vide
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  variant,
  className,
}: EmptyStateProps) {
  return (
    <div data-slot="empty-state" className={cn(emptyStateVariants({ variant }), className)}>
      {Icon && (
        <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground/80">
          <Icon className="size-6" strokeWidth={1.75} aria-hidden />
        </div>
      )}

      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-balance text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children && (
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">{children}</div>
      )}
    </div>
  );
}

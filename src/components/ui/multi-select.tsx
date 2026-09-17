"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface MultiSelectOption {
    value: string
    label: string
}

interface MultiSelectContextValue {
    value: string[]
    onValueChange: (value: string[]) => void
    options: MultiSelectOption[]
}

const MultiSelectContext = React.createContext<MultiSelectContextValue | null>(null)

function useMultiSelectContext() {
    const context = React.useContext(MultiSelectContext)
    if (!context) {
        throw new Error("MultiSelect subcomponents must be used within <MultiSelect>")
    }
    return context
}

interface MultiSelectProps
    extends Omit<React.ComponentProps<typeof PopoverPrimitive.Root>, "value"> {
    value: string[]
    onValueChange: (value: string[]) => void
    options: MultiSelectOption[]
}

function MultiSelect({
                         value,
                         onValueChange,
                         options,
                         children,
                         ...props
                     }: MultiSelectProps) {
    return (
        <MultiSelectContext.Provider value={{ value, onValueChange, options }}>
            <PopoverPrimitive.Root data-slot="multi-select" {...props}>
                {children}
            </PopoverPrimitive.Root>
        </MultiSelectContext.Provider>
    )
}

function MultiSelectTrigger({
                                className,
                                placeholder = "Sélectionner…",
                                ...props
                            }: React.ComponentProps<typeof PopoverPrimitive.Trigger> & {
    placeholder?: string
}) {
    const { value, onValueChange, options } = useMultiSelectContext()

    const selectedOptions = options.filter((opt) => value.includes(opt.value))

    const removeOption = (optValue: string, e: React.MouseEvent) => {
        e.stopPropagation()
        e.preventDefault()
        onValueChange(value.filter((v) => v !== optValue))
    }

    return (
        <PopoverPrimitive.Trigger
            data-slot="multi-select-trigger"
            className={cn(
                "flex min-h-9 w-full min-w-0 items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
                className
            )}
            {...props}
        >
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                {selectedOptions.length === 0 && (
                    <span className="text-muted-foreground">{placeholder}</span>
                )}
                {selectedOptions.map((opt) => (
                    <Badge
                        key={opt.value}
                        variant="secondary"
                        className="flex max-w-full items-center gap-1 pr-1 font-normal"
                    >
                        <span className="truncate">{opt.label}</span>
                        <span
                            role="button"
                            onClick={(e) => removeOption(opt.value, e)}
                            className="shrink-0 rounded-full p-0.5 hover:bg-muted-foreground/20"
                        >
              <XIcon className="size-3" />
            </span>
                    </Badge>
                ))}
            </div>
            <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
        </PopoverPrimitive.Trigger>
    )
}

function MultiSelectContent({
                                className,
                                children,
                                align = "start",
                                sideOffset = 4,
                                ...props
                            }: React.ComponentProps<typeof PopoverPrimitive.Content>) {
    return (
        <PopoverPrimitive.Portal>
            <PopoverPrimitive.Content
                data-slot="multi-select-content"
                align={align}
                sideOffset={sideOffset}
                className={cn(
                    "z-50 max-h-72 w-[var(--radix-popover-trigger-width)] overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                    className
                )}
                {...props}
            >
                {children}
            </PopoverPrimitive.Content>
        </PopoverPrimitive.Portal>
    )
}

function MultiSelectItem({
                             className,
                             value: itemValue,
                             children,
                             ...props
                         }: React.ComponentProps<"div"> & { value: string }) {
    const { value, onValueChange } = useMultiSelectContext()
    const isSelected = value.includes(itemValue)

    const toggle = () => {
        onValueChange(
            isSelected
                ? value.filter((v) => v !== itemValue)
                : [...value, itemValue]
        )
    }

    return (
        <div
            data-slot="multi-select-item"
            role="option"
            aria-selected={isSelected}
            onClick={toggle}
            className={cn(
                "relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                className
            )}
            {...props}
        >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        {isSelected && <CheckIcon className="size-4" />}
      </span>
            {children}
        </div>
    )
}

function MultiSelectEmpty({
                              className,
                              children = "Aucun résultat.",
                              ...props
                          }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="multi-select-empty"
            className={cn("py-6 text-center text-sm text-muted-foreground", className)}
            {...props}
        >
            {children}
        </div>
    )
}

export {
    MultiSelect,
    MultiSelectTrigger,
    MultiSelectContent,
    MultiSelectItem,
    MultiSelectEmpty,
}
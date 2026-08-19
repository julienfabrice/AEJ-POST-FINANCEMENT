import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 h-6 w-11 data-[state=checked]:bg-[#E7722B] data-[state=unchecked]:bg-slate-300",
        className
      )}
      {...props}
      style={{ width: '44px', height: '24px', backgroundColor: props.checked ? '#E7722B' : '#cbd5e1' }}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-sm ring-0 transition-transform h-5 w-5"
        )}
        style={{ transform: props.checked ? 'translateX(20px)' : 'translateX(0)' }}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }

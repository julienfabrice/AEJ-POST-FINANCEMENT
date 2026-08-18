import { IMAGES } from '@/constants/images'

export function HeaderLogo() {
  return (
    <div className="flex items-center gap-[11px] pr-[14px] mr-[6px] border-r border-white/10 h-[38px]">
      <img src={IMAGES.logo} alt="AEJ" className="h-[34px] w-auto shrink-0 object-contain block bg-white rounded-[7px] py-1 px-[7px]" />
    </div>
  )
}

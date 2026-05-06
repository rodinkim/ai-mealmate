import { useEffect, useRef } from 'react'

const G_SCRIPT_SRC = 'https://ads-partners.coupang.com/g.js'

const COUPANG_CAROUSEL_OPTIONS = {
  id: 986369,
  template: 'carousel',
  trackingCode: 'AF3279128',
  width: '720',
  height: '140',
  tsource: '',
} as const

type PartnersCoupangGlobal = {
  G: new (opts: typeof COUPANG_CAROUSEL_OPTIONS) => void
}

declare global {
  interface Window {
    PartnersCoupang?: PartnersCoupangGlobal
  }
}

/**
 * Coupang Partners carousel widget (g.js + PartnersCoupang.G). Same embed as static index.html.
 */
export default function CoupangDynamicBannerPreview() {
  const hostRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    if (host.querySelector(`script[src="${G_SCRIPT_SRC}"]`)) return

    const loader = document.createElement('script')
    loader.src = G_SCRIPT_SRC
    loader.async = true

    loader.onload = () => {
      const C = window.PartnersCoupang
      if (C?.G) {
        new C.G({ ...COUPANG_CAROUSEL_OPTIONS })
      }
    }

    host.appendChild(loader)
  }, [])

  return (
    <div className="space-y-2 pb-2">
      <p className="text-xs text-slate-500 m-0 leading-relaxed">쿠팡 파트너스 · 식품 추천</p>
      <div
        ref={hostRef}
        className="w-full overflow-x-auto min-h-[140px] rounded-xl"
        style={{ WebkitOverflowScrolling: 'touch' }}
      />
      <p className="text-[0.65rem] text-slate-600 m-0 text-center leading-relaxed">
        배너 너비 720px · 좁은 화면에서는 가로로 스크롤됩니다.
      </p>
    </div>
  )
}

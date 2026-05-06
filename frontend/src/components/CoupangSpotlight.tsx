import { partnerSpotlight } from '../config/partnerSpotlight'

const IFRAME_EXTRA_ATTRS = { browsingtopics: '' } as Record<string, string>

export default function CoupangSpotlight() {
  const { iframeSrc, linkUrl, linkLabel, iframeWidth, iframeHeight } = partnerSpotlight

  if (!iframeSrc && !linkUrl) return null

  return (
    <div
      className="rounded-2xl border border-white/10 overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.03)' }}
    >
      <p className="text-center text-xs text-slate-500 px-4 pt-4 pb-2 m-0">
        추천 상품 (쿠팡 파트너스)
      </p>
      <div className="flex flex-col items-center gap-3 px-4 pb-4">
        {iframeSrc ? (
          <iframe
            src={iframeSrc}
            width={iframeWidth}
            height={iframeHeight}
            frameBorder={0}
            scrolling="no"
            title={linkLabel}
            referrerPolicy="unsafe-url"
            className="max-w-full border-0"
            {...IFRAME_EXTRA_ATTRS}
          />
        ) : null}
        {linkUrl ? (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            referrerPolicy="unsafe-url"
            className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold no-underline text-orange-300 w-full max-w-xs"
            style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.3)' }}
          >
            {linkLabel}
          </a>
        ) : null}
      </div>
    </div>
  )
}

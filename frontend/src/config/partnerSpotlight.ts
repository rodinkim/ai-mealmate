/**
 * Featured Coupang partner slot (iframe widget + landing link).
 * Override with Vite env for other products without code edits.
 */
export type PartnerSpotlight = {
  iframeSrc: string
  linkUrl: string
  linkLabel: string
  iframeWidth: number
  iframeHeight: number
}

function envStr(name: string, fallback: string): string {
  const v = (import.meta.env as Record<string, string | undefined>)[name]
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : fallback
}

export const partnerSpotlight: PartnerSpotlight = {
  iframeSrc: envStr('VITE_COUPANG_SPOTLIGHT_IFRAME_SRC', 'https://coupa.ng/cmJWtT'),
  linkUrl: envStr('VITE_COUPANG_SPOTLIGHT_LINK', 'https://link.coupang.com/a/eDsyfN'),
  linkLabel: envStr('VITE_COUPANG_SPOTLIGHT_LABEL', '계란 딜 바로가기'),
  iframeWidth: 120,
  iframeHeight: 240,
}

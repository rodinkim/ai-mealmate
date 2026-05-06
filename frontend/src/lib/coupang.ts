/**
 * Coupang Partner attribution via search URLs (no Partners Open API).
 * When API access is available, product deep links can be added alongside or instead of search.
 */
const DEFAULT_PARTNER_REF = 'mealsmates'

export function getCoupangPartnerRef(): string {
  const v = import.meta.env.VITE_COUPANG_PARTNER_REF
  return typeof v === 'string' && v.trim() !== '' ? v.trim() : DEFAULT_PARTNER_REF
}

export function coupangSearchUrl(searchQuery: string): string {
  const q = encodeURIComponent(searchQuery.trim() || '건강식 재료')
  const ref = getCoupangPartnerRef()
  return `https://www.coupang.com/np/search?q=${q}&ref=${encodeURIComponent(ref)}`
}

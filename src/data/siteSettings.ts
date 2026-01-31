import { sanity } from '@/lib/sanity'

const query = `
*[_id == "siteSettings"][0]{
  siteTitle,
  siteTagline,
  seo { metaTitle, metaDescription },
  footerTitle { line1, line2 },
  contactInfo { text, textAfterBreak, email },
  socialLinks[]{ url, ariaLabel, svgPath }
}
`

export function getSiteSettings() {
  return sanity.fetch(query)
}
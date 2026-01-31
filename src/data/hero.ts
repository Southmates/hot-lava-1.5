import { sanity } from '@/lib/sanity'

const query = `
*[_type == "hero"][0]{
  video { asset->{ url } },
  poster { asset->{ url } },
  ariaLabel
}
`

export function getHero() {
  return sanity.fetch(query)
}

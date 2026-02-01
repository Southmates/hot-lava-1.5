import { sanity } from '@/lib/sanity'

const query = `
  *[_type == "product"] | order(orderRank asc) {
    _id,
    name,
    image,
    hoverImage,
    url,
    darkBackground,
    bgColor,
    bgSize
  }
`
export async function getProducts() {
  const data = await sanity.fetch(query)
  return Array.isArray(data) ? data : []
}
import { sanity } from '@/lib/sanity'

const query = `
  *[_type == "workItem"] | order(orderRank asc) {
    _id,
    brand,
    name,
    slide,
    image,
    videoUrl
  }
`

export async function getWorkItems() {
  const data = await sanity.fetch(query)
  return Array.isArray(data) ? data : []
}
import { sanity } from '@/lib/sanity'

const teamQuery = `
  *[_type == "teamMember"] | order(orderRank asc) {
    _id,
    name,
    surname,
    bio,
    image
  }
`

export async function getTeamMembers() {
  return sanity.fetch(teamQuery)
}

import { createClient } from '@sanity/client'

export const sanity = createClient({
  projectId: '11rq8l7c',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})
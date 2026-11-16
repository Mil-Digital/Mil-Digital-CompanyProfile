/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */
import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { connection } from 'next/server'
import { importMap } from '../importMap'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

// MIL edit (cacheComponents): admin pages read the URL and the session on
// every request, so they are allowed to block (see the layout above).
export const instant = false

// connection() first: Next renders the page alongside the layout, so each
// needs its own signal that it runs at request time.
export const generateMetadata = async ({ params, searchParams }: Args): Promise<Metadata> => {
  await connection()
  return generatePageMetadata({ config, params, searchParams })
}

const Page = async ({ params, searchParams }: Args) => {
  await connection()
  return RootPage({ config, params, searchParams, importMap })
}

export default Page

import { auth } from '@clerk/nextjs'
import prisma from '@/lib/db/prisma'
import Snippet from '@/components/snippet'

type Props = {}

// nextjs pages are server components, so make async to fetch data on server
const SnippetsPage = async (props: Props) => {
  // user is logged in if page is reached
  const { userId } = auth()

  // make typescript happy
  if (!userId) throw new Error('User is not logged in')

  // fetch user's snippets
  const snippets = await prisma.snippet.findMany({ where: { userId } })
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {snippets.length === 0 && (
        <div className="col-span-full text-center mt-5">
          <span className="text-4xl">🤔</span>
          <span className="text-xl"> No snippets yet...</span>
        </div>
      )}
      {snippets.map((snippet) => (
        <Snippet key={snippet.id} snippet={snippet} />
      ))}
    </div>
  )
}
export default SnippetsPage

// TODO: add responsive grid from portfolio tutorial
// TODO: add dark mode

import Image from 'next/image'
import logo from '@/assets/logo.png'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export default function Home() {
  const { userId } = auth()
  if (userId) redirect('/snippets')
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className=" flex items-center gap-4">
        <Image src={logo} alt="logo" width={100} height={100} />
        <span className="text-4xl font-extrabold tracking-tight lg: text-5xl">
          Snippets App
        </span>
      </div>
      <p className="max-w-prose text-center">
        An AI powered app that explains code snippets in plain English. Built
        with OpenAI, Pinecone, Next.js, Shadcn UI, Clerk, and more.
      </p>
      <Button size={'lg'} asChild>
        <Link href={'/snippets'}>Get Started</Link>
      </Button>
    </main>
  )
}

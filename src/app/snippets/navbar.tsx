'use client'

import Image from 'next/image'
import Link from 'next/link'
import logo from '@/assets/logo.png'
import { UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import SnippetDialog from '@/components/snippet-dialog'
import AIChatButton from '@/components/ai-chat-button'

type Props = {}
const Navbar = (props: Props) => {
  const [showSnippetDialog, setShowSnippetDialog] = useState(false)
  return (
    <>
      <div className="p-4 shadow">
        <div className=" flex items-center justify-between">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: { avatarBox: { width: '2.5rem', height: '2.5rem' } },
            }}
          />
          <div className="flex items-center gap-6">
            <Button size={'lg'} onClick={() => setShowSnippetDialog(true)}>
              <Plus size={20} className="mr-2" />
              Create Snippet
            </Button>
            <AIChatButton />
            <Link href={'/snippets'}>
              <Image src={logo} alt="logo" width={40} height={40} />
            </Link>
          </div>
        </div>
      </div>
      <SnippetDialog open={showSnippetDialog} setOpen={setShowSnippetDialog} />
    </>
  )
}
export default Navbar

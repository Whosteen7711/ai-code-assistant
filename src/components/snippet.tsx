'use client'

import { Snippet as SnippetModel } from '@prisma/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { useState } from 'react'
import SnippetDialog from './snippet-dialog'

type SnippetProps = {
  snippet: SnippetModel
}

const Snippet = ({ snippet }: SnippetProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false)

  // check for update
  const hasUpdate = snippet.updatedAt > snippet.createdAt

  // create readble timestamp for last change
  const lastChange = (
    hasUpdate ? snippet.updatedAt : snippet.createdAt
  ).toDateString()

  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-lg"
        onClick={() => setShowEditDialog(true)}
      >
        <CardHeader>
          <CardTitle className="font-bold text-center mb-2">
            {snippet.title}
          </CardTitle>
          <CardDescription>
            {lastChange}
            {hasUpdate && <span className="italic"> (updated)</span>}
            {<span className="font-bold block">{snippet.language}</span>}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-line">{snippet.content}</p>
        </CardContent>
      </Card>
      <SnippetDialog
        open={showEditDialog}
        setOpen={setShowEditDialog}
        snippetToEdit={snippet}
      />
    </>
  )
}
export default Snippet

// TODO style card content better
// card should show meta info: title, last change, language
// card should show content when clicked

// TODO: add new dialog to edit snippet
// dialog should show content and allow editing

// TODO: add syntax highlighting to snippet content

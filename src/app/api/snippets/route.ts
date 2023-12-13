import {
  createSnippetSchema,
  deleteSnippetSchema,
  updateSnippetSchema,
} from '@/lib/validation/snippet'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import prisma from '@/lib/db/prisma'
import { getEmbeddings } from '@/lib/openai'
import { snippetsIndex } from '@/lib/db/pinecone'

// CREATE handler for http fetch request
export async function POST(req: Request) {
  try {
    // get the data sent from the client
    const data = await req.json()

    // validate the data with zod schema, using safeParse to throw custom error
    const parsedData = createSnippetSchema.safeParse(data)
    if (!parsedData.success) {
      console.error(parsedData.error)
      // invalid request, return 400
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const { title, content, language } = parsedData.data
    const { userId } = auth()
    // check that user is logged in
    if (!userId) {
      // unauthorized, return 401
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // send request to OpenAI API to get embeddings for snippet
    const embeddings = await getEmbeddingsForSnippet(title, content, language)

    // create the snippet

    // wrap in transaction to ensure that both snippet and embeddings are created
    const snippet = await prisma.$transaction(async (tx) => {
      const snippet = await tx.snippet.create({
        data: {
          title,
          content,
          language,
          userId,
        },
      })

      await snippetsIndex.upsert([
        {
          id: snippet.id,
          values: embeddings,
          metadata: { userId },
        },
      ])
      return snippet
    })

    // new snippet created successfully, return 201
    return NextResponse.json({ snippet }, { status: 201 })
  } catch (error) {
    console.error(error)
    // internal server error, return 500
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// UPDATE handler for http fetch request
// TODO: add limit to user updates using updatedAt field
export async function PUT(req: Request) {
  try {
    // get the data sent from the client, stored in the body of the request
    const data = await req.json()
    // parse the data with zod schema, using safeParse to throw custom error
    const parsedData = updateSnippetSchema.safeParse(data)
    if (!parsedData.success) {
      console.error(parsedData.error)
      // invalid request, return 400
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    // destructure required fields for update
    const { id, title, content, language } = parsedData.data

    // query db for snippet by id
    const snippet = await prisma.snippet.findUnique({
      where: { id },
    })
    // check that snippet exists
    if (!snippet) {
      // snippet not found, return 404
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 })
    }

    // ready to update snippet, check that user is logged in and owns snippet
    const { userId } = auth()
    if (!userId || userId !== snippet.userId) {
      // unauthorized, return 401
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const embeddings = await getEmbeddingsForSnippet(title, content, language)

    // update the snippet with the new data and return successful response

    // wrap in transaction to ensure that both snippet and embeddings are updated
    const updatedSnippet = await prisma.$transaction(async (tx) => {
      const updatedSnippet = await tx.snippet.update({
        where: { id },
        data: {
          title,
          content,
          language,
        },
      })

      await snippetsIndex.upsert([
        {
          id,
          values: embeddings,
          metadata: { userId },
        },
      ])

      return updatedSnippet
    })

    // snippet updated successfully, return 200
    return NextResponse.json({ snippet: updatedSnippet }, { status: 200 })
  } catch (error) {
    console.error(error)
    // internal server error, return 500
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE handler for http fetch request
export async function DELETE(req: Request) {
  // get the data sent from the client, stored in the body of the request
  const data = await req.json()
  // parse the data with zod schema, using safeParse to throw custom error
  const parsedData = deleteSnippetSchema.safeParse(data)
  if (!parsedData.success) {
    console.error(parsedData.error)
    // invalid request, return 400
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  // data is valid, destructure id for delete
  const { id } = parsedData.data

  // query db for snippet by id
  const snippet = await prisma.snippet.findUnique({
    where: { id },
  })

  // check that snippet exists
  if (!snippet) {
    // snippet not found, return 404
    return NextResponse.json({ error: 'Snippet not found' }, { status: 404 })
  }

  // ready to delete snippet, check that user is logged in and owns snippet
  const { userId } = auth()
  if (!userId || userId !== snippet.userId) {
    // unauthorized, return 401
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ready to delete snippet
  // wrap in transaction to ensure that both snippet and embeddings are deleted
  await prisma.$transaction(async (tx) => {
    await tx.snippet.delete({ where: { id } })
    await snippetsIndex.deleteOne(id)
  })

  // return successful response that snippet was deleted
  return NextResponse.json(
    { message: 'Snippet has been deleted' },
    { status: 200 }
  )
}

// format new snippet data for embeddings from OpenAI API
async function getEmbeddingsForSnippet(
  title: string,
  content: string,
  language: string
) {
  return getEmbeddings(
    title + '\n\n' + 'programming language: ' + language + '\n\n' + content
  )
}

import { snippetsIndex } from '@/lib/db/pinecone'
import openAI, { getEmbeddings } from '@/lib/openai'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { ChatCompletionMessage } from 'openai/resources/index.mjs'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import prisma from '@/lib/db/prisma'

export async function POST(req: Request) {
  try {
    const data = await req.json()

    const message: ChatCompletionMessage[] = data.messages
    // slice last six messages (user and chat) TODO: make this more robust
    const lastSixMessages = message.slice(-6)

    // convert to vector embedding TODO: look into other methods to create embeddings => Langchain
    const lastSixMessagesEmbedding = await getEmbeddings(
      lastSixMessages.map((message) => message.content).join('\n')
    )

    // build query
    const { userId } = auth()
    // vector response contains ids of the relevant snippets
    const vectorQueryResponse = await snippetsIndex.query({
      vector: lastSixMessagesEmbedding,
      topK: 1,
      filter: { userId },
    })
    // query mongoDB for the snippet, pinecone collections have same ids as mongoDB
    const relevantSnippets = await prisma.snippet.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id),
        },
      },
    })

    console.log('relevantSnippets: ', relevantSnippets)

    // send request with snippets to openAI
    const response = await openAI.chat.completions.create({
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful programming assistant that explains code.' +
            'The relevant code snippets are:\n' +
            relevantSnippets
              .map(
                (snippet) =>
                  `Title: ${snippet.title}\nContent:\n${snippet.content}\nProgramming Language:\n${snippet.language}`
              )
              .join('\n\n'),
        },
      ],
    })

    // return response as a text stream
    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

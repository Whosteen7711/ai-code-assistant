import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY is not set')
}

const openAI = new OpenAI({ apiKey })

export default openAI

// create vector embedding with request to OpenAI API
export async function getEmbeddings(text: string) {
  const response = await openAI.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  })

  const embeddings = response.data[0].embedding
  if (!embeddings) {
    throw new Error('No embedding returned')
  }

  return embeddings
}

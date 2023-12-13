import { z } from 'zod'

// define validation schema for required form fields to create a snippet
export const createSnippetSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  content: z
    .string()
    .min(1, { message: 'Content is required' })
    .max(500, { message: 'Content cannot be longer than 500 characters' }),
  language: z.enum(['javascript', 'typescript', 'python', 'html', 'css'], {
    required_error: 'Programming language is required',
  }),
})

// define validation schema for required fields to update a snippet
// extend the createSnippetSchema to reuse the same validation rules
export const updateSnippetSchema = createSnippetSchema.extend({
  // TODO: reference Lamadev tutorial to validate id is mongodb structure
  id: z.string().min(1),
})

// define validation schema for required fields to delete a snippet
// delete does not require title, content, or language
export const deleteSnippetSchema = z.object({
  // TODO: reference Lamadev tutorial to validate id is mongodb structure
  id: z.string().min(1),
})

// TODO: compute cost of prompt with content to determine subscription level
// low tier: 1 prompt per day (free)
// mid tier: 5 prompts per day (paid)
// high tier: unlimited prompts per day (paid)

// export validation scheme type
// types not required for update and delete since they are not used in a form
export type CreateSnippetSchema = z.infer<typeof createSnippetSchema>

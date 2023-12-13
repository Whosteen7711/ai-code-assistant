// SnippetDialog component is client component since it is used in Navbar component

import {
  CreateSnippetSchema,
  createSnippetSchema,
} from '@/lib/validation/snippet'
import { Snippet } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import LoadingButton from './loading-button'
import { useRouter } from 'next/navigation'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { useState } from 'react'

type SnippetDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  snippetToEdit?: Snippet
}

const SnippetDialog = ({
  open,
  setOpen,
  snippetToEdit,
}: SnippetDialogProps) => {
  // add state to track delete status
  const [deleteInProgress, setDeleteInProgress] = useState(false)

  // import router hook to refresh snippets page after creating a new snippet
  const router = useRouter()

  // prepare default value for language radio group
  const defaultLanguage =
    snippetToEdit &&
    (snippetToEdit.language === 'javascript' ||
      snippetToEdit.language === 'typescript' ||
      snippetToEdit.language === 'python' ||
      snippetToEdit.language === 'html' ||
      snippetToEdit.language === 'css')
      ? snippetToEdit.language
      : 'javascript'

  // build Snippet form with the validation type for required fields
  const form = useForm<CreateSnippetSchema>({
    // use zod to validate snippet schema for required fields from form input
    resolver: zodResolver(createSnippetSchema),
    // set default values for form fields so they're not undefined
    defaultValues: {
      title: snippetToEdit ? snippetToEdit.title : '',
      content: snippetToEdit ? snippetToEdit.content : '',
      language: defaultLanguage,
    },
  })

  // callback for when form is submitted
  async function onSubmit(data: CreateSnippetSchema) {
    try {
      // check snippetToEdit to determine if we're creating or updating a snippet
      if (snippetToEdit) {
        // PUT request to update snippet

        const response = await fetch('api/snippets', {
          method: 'PUT',
          body: JSON.stringify({
            id: snippetToEdit.id,
            ...data,
          }),
        })

        // throw error if response is not ok
        if (!response.ok) {
          // received a non-201 response
          throw new Error('Status Code: ' + response.status)
        }
      } else {
        // POST request to create snippet

        // Next.js prepends the base path to the fetch URL
        const response = await fetch('/api/snippets', {
          method: 'POST',
          body: JSON.stringify(data),
        })

        // throw error if response is not ok
        if (!response.ok) {
          // received a non-201 response
          throw new Error('Status Code: ' + response.status)
        }

        // POST request was successful, reset form
        form.reset()
      }
      // refresh snippets page with new snippet to refetch snippets
      // TODO: refresh not optimal, return new snippet and add state to snippets page
      router.refresh()

      // close dialog
      setOpen(false)
    } catch (error) {
      // log error and alert client
      console.error(error)
      alert('Something went wrong, please try again.')
      // TODO: add toast notification
    }
  }

  async function onDelete() {
    // check snippetToEdit
    if (!snippetToEdit) return

    // ready to delete, set deleteInProgress to true
    setDeleteInProgress(true)
    try {
      const response = await fetch('/api/snippets', {
        method: 'DELETE',
        body: JSON.stringify({ id: snippetToEdit.id }),
      })
      // check response
      if (!response.ok) {
        throw new Error('Status Code: ' + response.status)
      }
      // delete successful, refresh page and refetch data
      // TODO: refresh not optimal, return new snippet and add state to snippets page
      router.refresh()

      // close dialog
      setOpen(false)
    } catch (error) {
      // log error and alert client
      console.error(error)
      alert('Something went wrong, please try again.')
    } finally {
      // set deleteInProgress to false
      setDeleteInProgress(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {snippetToEdit ? 'Edit Snippet' : 'Create Snippet'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Snippet Title</FormLabel>
                  <FormControl>
                    <Input placeholder="give your snippet a title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Textarea placeholder="add a code snippet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <RadioGroup
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                      {...field}
                    >
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value="javascript" />
                        </FormControl>
                        <FormLabel>JavaScript</FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value="typescript" />
                        </FormControl>
                        <FormLabel>Typescript</FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value="python" />
                        </FormControl>
                        <FormLabel>Python</FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value="html" />
                        </FormControl>
                        <FormLabel>HTML</FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <RadioGroupItem value="css" />
                        </FormControl>
                        <FormLabel>CSS</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter>
              {snippetToEdit && (
                <LoadingButton
                  variant={'destructive'}
                  isLoading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={onDelete}
                  type="button"
                >
                  Delete Snippet
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                isLoading={form.formState.isSubmitting}
                disabled={deleteInProgress}
              >
                Submit Snippet
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default SnippetDialog

// TODO improve responsive for dailog buttons on small screens => probably needed in loading-button component
// TODO: add confirmation dialog for delete

// NOTE: delete button is type button to prevent form submission

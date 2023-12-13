import { cn } from '@/lib/utils'
import { useChat } from 'ai/react'
import { Bot, Trash, XCircle } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Message } from 'ai'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import logo from '@/assets/logo.png'
import { useEffect, useRef } from 'react'

type AIChatBoxProps = {
  open: boolean
  onClose: () => void
}
const AIChatBox = ({ open, onClose }: AIChatBoxProps) => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat()

  // use input ref to manage state of input field => handle errors, clear chat
  const inputRef = useRef<HTMLInputElement>(null)
  // use scroll ref to scroll to bottom of chat on new message
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (open) {
      // point cursor to input field on open
      inputRef.current?.focus()
    }
  }, [open])

  // boolean to hide loading chat message once response streaming starts
  const lastMessageIsUser = messages[messages.length - 1]?.role === 'user'

  return (
    <div
      className={cn(
        'bottom-0 right-0 xl:right-36 z-10 w-full max-w-[500px] p-1 ',
        open ? 'fixed' : 'hidden'
      )}
    >
      <button onClick={onClose} className="mb-1 ms-auto block">
        <XCircle size={30} />
      </button>
      <div className="flex flex-col h-[600px] rounded bg-background border shadow-xl">
        <div className="h-full mt-3 px-3 overflow-y-auto" ref={scrollRef}>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && lastMessageIsUser && (
            <ChatMessage
              message={{ role: 'assistant', content: 'Thinking...' }}
            />
          )}
          {error && (
            <ChatMessage
              message={{
                role: 'assistant',
                content: 'Sorry, an error occurred. Please try again.',
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <div className="flex gap-3">
              <Bot />
              Ask the AI a question about your snippet!
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Button
            title="Clear Chat"
            variant={'outline'}
            size={'icon'}
            className="shrink-0"
            type="button"
            onClick={() => setMessages([])}
          >
            <Trash />
          </Button>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here"
            ref={inputRef}
          />
          <Button type="submit" disabled={isLoading}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  )
}
export default AIChatBox

// component to style ChatGPT message stream
const ChatMessage = ({
  message: { role, content },
}: {
  message: Pick<Message, 'role' | 'content'>
}) => {
  const { user } = useUser()
  // boolean to check if message is from AI
  const isAiMessage = role === 'assistant'

  return (
    <div
      className={cn(
        'mb-3 flex items-center',
        isAiMessage ? 'me-5 justify-start' : 'ms-5 justify-end'
      )}
    >
      {isAiMessage && <Bot className="mr-2 shrink-0" />}
      <p
        className={cn(
          'whitespace-pre-line rounded-md border px-3 py-2',
          isAiMessage ? 'bg-background' : 'bg-primary text-primary-foreground'
        )}
      >
        {content}
      </p>
      {!isAiMessage &&
        user &&
        (user.hasImage ? (
          <Image
            src={user.imageUrl}
            alt="user image"
            width={40}
            height={40}
            className="ml-2 h-10 rounded-full object-cover"
          />
        ) : (
          <Image
            src={logo}
            alt="user image"
            width={40}
            height={40}
            className="ml-2 h-10 rounded-full object-cover"
          />
        ))}
    </div>
  )
}

import { Bot } from 'lucide-react'
import { Button } from './ui/button'
import { useState } from 'react'
import AIChatBox from './ai-chat-box'

type Props = {}
const AIChatButton = (props: Props) => {
  const [chatOpen, setChatOpen] = useState(false)
  return (
    <>
      <Button size={'lg'} onClick={() => setChatOpen(true)}>
        <Bot size={24} className="mr-2" />
        AI Chat
      </Button>
      <AIChatBox open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  )
}
export default AIChatButton

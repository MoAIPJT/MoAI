export interface ChatBoxProps {
  chatMessages: Array<{
    id: string
    sender: string
    message: string
    timestamp: Date
  }>
  newChatMessage: string
  onNewChatMessageChange: (message: string) => void
  onSendChatMessage: () => void
}

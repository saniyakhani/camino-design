import { cn } from '@/lib/utils'

type MessageBubbleProps = {
  role: 'bot' | 'user'
  children: React.ReactNode
}

export function MessageBubble({ role, children }: MessageBubbleProps) {
  const isUser = role === 'user'
  return (
    <div className={cn('flex w-full', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed text-pretty',
          isUser
            ? 'rounded-ee-md bg-primary text-primary-foreground'
            : 'rounded-es-md bg-secondary text-secondary-foreground',
        )}
      >
        <span className="sr-only">{isUser ? 'You: ' : 'Camino: '}</span>
        {children}
      </div>
    </div>
  )
}

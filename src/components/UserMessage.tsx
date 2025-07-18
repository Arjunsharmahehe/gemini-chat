import { Check, Copy } from "lucide-react";
import { useState } from "react";

export default function UserMessage({ content, model, timestamp, chatEndRef }: { content: string; model?: string; timestamp: Date; chatEndRef: React.RefObject<HTMLDivElement> }) {
  
  const [ isCopied, setIsCopied ] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true)
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }).catch(err => {
      console.error('Failed to copy message: ', err);
    });

  }
  
  return (
    <div ref={chatEndRef} className='px-4 py-3 ml-auto w-fit max-w-[400px] min-w-[200px] text-neutral-50 bg-neutral-900 rounded-l-2xl rounded-b-2xl mb-4'>
      <div className='text-xs flex items-center justify-between mb-2'>
        <span className="font-semibold">User</span>
        <span className="text-neutral-600">to: {model}</span>
      </div>
      <div className='text-wrap text-sm'>{content}</div>
      <div className='text-xs text-neutral-600 flex items-center justify-between mt-2'>
        <span>{timestamp.toLocaleTimeString()}</span>

        {isCopied ? (
          <Check className="size-4 text-neutral-100"/>
        ) : (
          <Copy className="size-4 hover:text-neutral-200 duration-150 ease-in transition-colors" onClick={handleCopy} />
        )}
      </div>
    </div>
  )
}
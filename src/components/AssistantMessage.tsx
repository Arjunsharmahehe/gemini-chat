import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown'
import { useState } from 'react';
import { Check, Copy } from "lucide-react";
import { useModelContext } from '../context/ModelContext';

export default function AssistantMessage({ content, model, timestamp, chatEndRef, mode }: { content: string; model?: string; timestamp: Date; chatEndRef: React.RefObject<HTMLDivElement | null>; mode: string }) {

    const markdownComponents: Components = {
    h1: ({ node, ...props }) => <h1 className='text-xl font-bold mt-4 mb-3' {...props} />,
    // Target h2 tags
    h2: ({ node, ...props }) => <h2 className='text-lg font-medium mt-4 mb-2' {...props} />,
    // Target p tags
    p: ({ node, ...props }) => <p className='mb-2 text-sm font-normal' {...props} />,
    // Target ul tags
    ul: ({ node, ...props }) => <ul className='text-sm list-disc list-inside pl-4 mb-2' {...props} />,
    // Target ol tags
    ol: ({ node, ...props }) => <ol className='text-sm list-decimal list-inside pl-4 mb-2' {...props} />,
    // Target inline code
    code: ({ node, ...props }) => <code className='text-sm font-thin bg-neutral-800 text-neutral-300 rounded-sm px-1 py-[1px] font-mono' {...props} />,
    // Target code blocks
    pre: ({ node, ...props }) => <pre className='text-sm bg-neutral-900 rounded-md border-2 border-purple-950/50 p-3 my-2 overflow-x-auto' {...props} />,
  };

  const [ isCopied, setIsCopied ] = useState(false)

  const textColor = mode === "Bro" ? "text-blue-400" : mode === "Developer" ? "text-green-400" : mode === "Boyfriend" ? "text-pink-400" : mode === "Girlfriend" ? "text-purple-400" : "text-neutral-50";

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

  if ( content === "Loading..."){
    return (
      <div className='flex w-fit gap-1 mr-auto py-3'>
        <p className='w-3 h-3 animate-pulse bg-neutral-600 rounded-full'/>
        <p className='w-3 h-3 animate-pulse bg-neutral-600 rounded-full'/>
        <p className='w-3 h-3 animate-pulse bg-neutral-600 rounded-full'/>
      </div>
    )
  }


  return (
    <div ref={chatEndRef} className='px-4 py-3 mr-auto w-fit max-w-full min-w-[200px] text-neutral-50 bg-neutral-900/40 rounded-r-2xl rounded-b-2xl mb-4'>
      <div className='text-xs flex items-center justify-between mb-2'>
        <span className={`font-semibold ${textColor}`}>{mode}</span>
        <span className="text-neutral-600">{model}</span>
      </div>
        <ReactMarkdown components={markdownComponents}>
            {content}
        </ReactMarkdown>
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
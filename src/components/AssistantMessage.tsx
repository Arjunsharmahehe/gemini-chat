import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown'
import { useState } from 'react';
import { Check, Copy, LucideSidebarClose } from "lucide-react";

export default function AssistantMessage({ content, model, timestamp, chatEndRef, mode, thoughts }: { content: string; model?: string; timestamp: Date | string; chatEndRef: React.RefObject<HTMLDivElement | null>; mode: string; thoughts: string }) {

    const markdownComponents: Components = {
    h1: ({ node, ...props }) => <h1 className='text-xl font-bold mt-4 mb-3' {...props} />,

    h2: ({ node, ...props }) => <h2 className='text-lg font-medium mt-4 mb-2' {...props} />,

    p: ({ node, ...props }) => <p className='mb-2 text-sm font-normal' {...props} />,

    ul: ({ node, ...props }) => <ul className='text-sm list-disc list-inside pl-4 mb-2' {...props} />,

    ol: ({ node, ...props }) => <ol className='text-sm list-decimal list-inside pl-4 mb-2' {...props} />,

    code: ({ node, ...props }) => <code className='text-sm font-thin bg-neutral-800 text-neutral-300 rounded-sm px-1 py-[1px] font-mono' {...props} />,

    pre: ({ node, ...props }) => <pre className='text-sm bg-neutral-900 rounded-md border-2 border-purple-950/50 p-3 my-2 overflow-x-auto' {...props} />,
  };

  const [ isCopied, setIsCopied ] = useState(false)
  const [ showingThoughts, setShowingThoughts ] = useState(false); // State to manage the 'show thoughts' functionality

  const textColor = mode === "Bro" ? "text-blue-400" : mode === "Developer" ? "text-green-400" : mode === "Boyfriend" ? "text-purple-400" : mode === "Girlfriend" ? "text-pink-400" : mode === "Kitten" ? "text-yellow-400" : mode === "Mukesh" ? "text-red-400" : mode === "BADmos" ? "text-orange-400" : "text-neutral-50";

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

  // If the content is "Loading...", return a loading indicator
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
      
      {/* Header */}
      <div className='text-xs flex items-center justify-between mb-2'>
        <span className={`font-semibold ${textColor}`}>{mode}</span>
        { thoughts?.length > 0 ? <button className='text-xs text-neutral-400 hover:text-neutral-200' onClick={() => setShowingThoughts(!showingThoughts)}>{showingThoughts ? 'Hide' : 'Show'} Thoughts</button>
        : <span className="text-neutral-600">{model}</span> }
      </div>

      {/* Main content */}
      <ReactMarkdown components={markdownComponents}>
          {content}
      </ReactMarkdown>

      {/* Footer with timestamp and copy button */}
      <div className='text-xs text-neutral-600 flex items-center justify-between mt-2'>
        <span>{ typeof timestamp === "string" ? new Date(timestamp).toLocaleTimeString() : timestamp.toLocaleTimeString()}</span>

        {isCopied ? (
          <Check className="size-4 text-neutral-100"/>
        ) : (
          <Copy className="size-4 hover:text-neutral-200 duration-150 ease-in transition-colors" onClick={handleCopy} />
        )}
      </div>
      {thoughts && <Alert message={thoughts} setShowingThoughts={setShowingThoughts} showSidebar={showingThoughts} /> }
    </div>
  )
}

// Alert component to show thoughts
// This component will be displayed when the user clicks "Show Thoughts"
function Alert({ message, setShowingThoughts, showSidebar }: { message: string, setShowingThoughts: React.Dispatch<React.SetStateAction<boolean>>, showSidebar: boolean }) {

  const [ isCopied, setIsCopied ] = useState(false);

  const markdownComponents: Components = {
    h1: ({ node, ...props }) => <h1 className='text-xl font-bold mt-4 mb-3' {...props} />,

    h2: ({ node, ...props }) => <h2 className='text-lg font-medium mt-4 mb-2' {...props} />,

    p: ({ node, ...props }) => <p className='mb-2 text-sm font-normal' {...props} />,

    ul: ({ node, ...props }) => <ul className='text-sm list-disc list-inside pl-4 mb-2' {...props} />,

    ol: ({ node, ...props }) => <ol className='text-sm list-decimal list-inside pl-4 mb-2' {...props} />,

    code: ({ node, ...props }) => <code className='text-sm font-thin bg-neutral-800 text-neutral-300 rounded-sm px-1 py-[1px] font-mono' {...props} />,

    pre: ({ node, ...props }) => <pre className='text-sm bg-neutral-900 rounded-md border-2 border-purple-950/50 p-3 my-2 overflow-x-auto' {...props} />,
  };

  function handleCopy() {
    navigator.clipboard.writeText(message).then(() => {
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }).catch(err => {
      console.error('Failed to copy message: ', err);
    });
  }

  return (
 
      <div className='px-3 py-2 absolute z-5 top-0 left-0 gap-3 flex bg-neutral-900 flex-col w-3/4 md:w-2/3 lg:w-2/5 h-screen'
        style={{ transform: `${ showSidebar ? 'translateX(0)' : 'translateX(-100%)'}`, transition: 'transform 0.3s ease-in-out' }}>

        {/* Footer with dismiss and copy button */}
        <div className='flex items-baseline justify-between'>
          {isCopied ? (
            <Check className="size-4 text-neutral-100"/>
          ) : (
            <Copy className="size-4 text-neutral-600 hover:text-neutral-200 duration-150 ease-in transition-colors" onClick={handleCopy} />
          )}
          <LucideSidebarClose className='size-5 text-neutral-500 hover:text-neutral-400' onClick={() => setShowingThoughts(false)} />
        </div>

        <div className='h-full overflow-y-auto bg-neutral-900 rounded-lg'> 
          {/* Main Content */}
          <ReactMarkdown components={markdownComponents}>
            {message}
          </ReactMarkdown>
        </div>


      </div>
  );
}
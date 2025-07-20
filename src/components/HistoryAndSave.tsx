import type { MessageType } from "../App";
import { useState } from 'react';
import { useHistoryContext } from '../context/HistoryContext';
import { ExternalLink, Plus, Save, SidebarClose, Trash2 } from 'lucide-react';


export default function HistoryAndSave({ messages, setMessages }: { messages: MessageType[], setMessages: React.Dispatch<React.SetStateAction<MessageType[]>> }) {
  const { addHistory, history } = useHistoryContext();
  const [ showHistory, setShowHistory ] = useState(false);
  const [ isSaved, setIsSaved ] = useState(false)

  function handleSave(){
    addHistory(messages)
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 1000)
  }

  return (
    <div className='text-sm flex text-neutral-200 items-center justify-between px-2 mt-2'>
      <button className="text-neutral-400 hover:text-neutral-200" onClick={() => setShowHistory(!showHistory)}>{showHistory ? 'Hide' : 'Show'} History</button>
      <button onClick={handleSave} className='flex gap-1 items-center text-green-600'>
        <Save className='size-4' />
        { isSaved ? "Saved" : "Save"}
      </button>

      {<DisplayHistory history={history} setMessages={setMessages} setShowHistory={setShowHistory} showHistory={showHistory} />}
    </div>
  );
}

function DisplayHistory({ history, setMessages, setShowHistory, showHistory }: { history: MessageType[][], setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>, setShowHistory: React.Dispatch<React.SetStateAction<boolean>>, showHistory: boolean }) {

    const { deleteHistory, clearHistory } = useHistoryContext()

  return (

    <div className='shadow-lg z-5 absolute flex flex-col gap-3 left-0 top-0 h-full bg-neutral-900 p-4 w-3/4 md:w-2/6 lg:w-1/5' style={{ transform: `${showHistory ? 'translateX(0)' : 'translateX(-100%)'}`, transition: 'transform 0.3s ease-in-out' }}>

      <div className="flex w-full items-center justify-end"><SidebarClose className="size-5 text-neutral-500 hover:text-neutral-400" onClick={() => setShowHistory(false)}/></div>

      <button className="mb-2 flex w-full items-center text-sm font-normal gap-1 px-2 py-1 rounded-md bg-neutral-900/60 hover:bg-green-800 duration-150 ease-in transition-colors" onClick={() => setMessages([])}><Plus className="size-4" /> New Chat</button>
      
      <h2 className='px-2 text-base font-semibold flex w-full justify-between items-baseline'>
        History
        <button className=' text-red-700 font-normal text-xs bg-red-950/10 px-1 py-.5 hover:text-red-600 rounded-sm' onClick={clearHistory}>Clear All</button>
        </h2>
      <div className="flex flex-col gap-1 overflow-y-auto h-full">
        { history.length > 0 ? history.map((item, index) => (
          <div key={index} className='text-left text-sm items-center bg-neutral-800/30 hover:bg-neutral-800/80 px-2 py-1 rounded-md flex gap-2 w-full text-neutral-300'>
            <button onClick={() => setMessages(item)} className="text-left w-full overflow-x-clip">{ item[0]?.content.includes('||||||') ? item[0]?.content.split('||||||')[1]?.slice(0, 28) : item[0]?.content.slice(0, 28) }</button>
            <Trash2 className="size-5 text-neutral-500 hover:text-red-600 duration-100 transition-colors" onClick={() => deleteHistory(index)} />
          </div>
        ))
        : <div className="items-center bg-neutral-800/30 hover:bg-neutral-800/80 px-2 py-1 rounded-md flex gap-2 w-full">
            <p className='w-full text-center text-sm text-neutral-500'>No history available</p>
          </div>}
      </div>
      <div className='px-1 flex items-baseline justify-between'>
        <a href="https://arjunsharmahehe.netlify.app" className="text-neutral-600 hover:text-neutral-400 hover:underline">Arjun</a>
        <a href="https://github.com/arjunsharmahehe/gemini-chat" className="flex items-center gap-1 text-neutral-600 hover:text-neutral-400 hover:underline">Github <ExternalLink className="size-3"/></a>
      </div>
    </div>

  );
}
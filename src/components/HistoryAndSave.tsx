import type { MessageType } from "../App";
import { useState } from 'react';
import { useHistoryContext } from '../context/HistoryContext';
import { ArrowUpRight, Plus, Save, Trash2 } from 'lucide-react';


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

      { showHistory && <DisplayHistory history={history} setMessages={setMessages} setShowHistory={setShowHistory} />}
    </div>
  );
}

function DisplayHistory({ history, setMessages, setShowHistory }: { history: MessageType[][], setMessages: React.Dispatch<React.SetStateAction<MessageType[]>>, setShowHistory: React.Dispatch<React.SetStateAction<boolean>> }) {

    const { deleteHistory, clearHistory } = useHistoryContext()

  return (
    <div className='shadow-lg absolute flex flex-col gap-3 left-4 top-4 h-full bg-neutral-900 p-4 rounded-lg max-w-[400px] max-h-3/4'>
      <h2 className='px-2 text-lg font-semibold flex w-full justify-between items-center'>
        History
        <button className="flex items-center text-sm font-semibold gap-1 px-1 py-1 rounded-full bg-neutral-900 hover:bg-green-400/20 duration-150 ease-in transition-colors" onClick={() => setMessages([])}><Plus /></button>
        </h2>
      <div className="flex flex-col gap-1 overflow-y-auto h-full">
        { history.length > 0 ? history.map((item, index) => (
          <div key={index} className='min-w-[200px] text-left text-sm items-center bg-neutral-800/30 hover:bg-neutral-800/80 px-2 py-1 rounded-md flex gap-2 w-full text-neutral-300'>
            <button onClick={() => setMessages(item)} className="text-left w-full">{ item[0]?.content.includes('||||||') ? item[0]?.content.split('||||||')[1]?.slice(0, 36) : item[0]?.content.slice(0, 36) }</button>
            <Trash2 className="size-5 text-neutral-500 hover:text-red-600 duration-100 transition-colors" onClick={() => deleteHistory(index)} />
            <ArrowUpRight className="size-4 text-neutral-500 hover:text-neutral-300" onClick={() => setMessages(item)} />
          </div>
        ))
        : <div className="items-center bg-neutral-800/30 hover:bg-neutral-800/80 px-2 py-1 rounded-md flex gap-2 w-full">
            <p className='min-w-[200px] text-center text-sm text-neutral-500'>No history available</p>
          </div>}
      </div>
      <div className='px-2 flex items-baseline justify-between'>
          <button className=' text-red-700 hover:text-red-600 rounded-sm' onClick={() => setShowHistory(false)}>Dismiss</button>
          <button className=' text-red-700 bg-red-950/10 px-1 py-.5 hover:text-red-600 rounded-sm' onClick={clearHistory}>Clear All</button>
        </div>
    </div>
  );
}
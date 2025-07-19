import { useRef } from "react";
import { aiModels, type ModelStruct } from "../../constants";
import { ArrowUp } from "lucide-react";
import { useModelContext } from "../context/ModelContext";

export default function InputContainer({ value, onChange, onSubmit }: { value?: string; onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void; }) {
  
  const formRef = useRef<HTMLFormElement>(null);
  const { selectedModel, setSelectedModel, apiKey, setApiKey, selectedMode, setSelectedMode } = useModelContext()

  // 2. Create the keydown handler function
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Check for "Enter" without the "Shift" key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents adding a new line
      formRef.current?.requestSubmit(); // Programmatically submits the form
      localStorage.setItem('apiKey', apiKey); // Save API key to localStorage
    }
  };
  
  
  return (
      <form ref={formRef} onSubmit={onSubmit} className='px-2 pt-2 rounded-t-xl bg-purple-950/10 border-t-2 border-l-2 border-r-2 border-purple-950/50 hover:border-purple-950/70 transition-colors duration-100'>
        <div className='bg-neutral-950 border-t-2 border-r-2 border-l-2 border-neutral-900 text-neutral-50 rounded-t-lg'>
          <div className='flex justify-between items-baseline px-3 pt-2'>
            <textarea className='w-full resize-none bg-transparent text-sm leading-6 text-foreground outline-none placeholder:text-neutral-600 disabled:opacity-0 px-3 py-2'
                      placeholder='Type your message here...' 
                      value={value} onChange={onChange} 
                      onKeyDown={handleKeyDown}
              />
            <button
              type='submit'
              className='mt-2 p-2 border-2 border-purple-950 text-white rounded relative overflow-hidden bg-purple-950/40 hover:bg-purple-950/60 hover:border-purple-900'
            >
              <ArrowUp className='size-4 relative z-10'/>
            </button>
          </div>

          <div className='flex items-center justify-between gap-2 pb-2 px-3'>
            <div className='flex items-center flex-wrap gap-2'>

              <select
                className='w-fit p-2 text-sm rounded text-white hover:bg-neutral-900/30'
                value={selectedModel}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedModel(e.target.value)}
              >
                {aiModels.map((model: ModelStruct) => (
                  <option key={model.slug} value={model.slug}>
                    {model.name}
                  </option>
                ))}
              </select>

              { aiModels.find(model => model.slug === selectedModel)?.modes && (
                <select value={selectedMode}
                          onChange={(e) => setSelectedMode(e.target.value)}
                          className='w-fit p-2 text-sm rounded text-white hover:bg-neutral-900/30'>
                    { aiModels.find(model => model.slug === selectedModel)?.modes.map((mode, index) => (
                      <option key={index} value={mode}>{mode}</option>
                    ))}

                  </select>
              )}

              <input type='password' className='w-fit min-w-[60px] p-2 text-sm rounded outline-none focus:outline-none placeholder:text-neutral-600' placeholder='Enter your API key' value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
            
            </div>
          </div>
        </div>
      </form>
  )
}
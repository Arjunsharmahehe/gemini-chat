import { useRef } from "react";
import { aiModels } from "../../constants";
import { ArrowUp } from "lucide-react";
import { useModelContext } from "../context/ModelContext";
import { SelectGroup, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectLabel } from "./ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export default function InputContainer({ value, onChange, onSubmit }: { value?: string; onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void; }) {

  const formRef = useRef<HTMLFormElement>(null);
  const { selectedModel, setSelectedModel, apiKey, selectedMode, setSelectedMode } = useModelContext()
  // const [copied, setCopied] = useState(false);

  // Copy API key to clipboard
  // const copyApiKey = async () => {
  //   if (apiKey) {
  //     try {
  //       await navigator.clipboard.writeText(apiKey);
  //       setCopied(true);
  //       setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  //     } catch (err) {
  //       console.error('Failed to copy API key:', err);
  //     }
  //   }
  // };

  // keydown handler function
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {

    // Check for "Enter" without the "Shift" key
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents adding a new line
      formRef.current?.requestSubmit(); // Programmatically submits the form
    }
  };
  
  
  return (
      <form ref={formRef} onSubmit={onSubmit} className='px-2 pt-2 rounded-t-xl bg-purple-950/10 border-t-2 border-l-2 border-r-2 border-purple-950/50 hover:border-purple-950/70 transition-colors duration-100'>
        <div className='bg-neutral-950 border-t-2 border-r-2 border-l-2 border-neutral-900 text-neutral-50 rounded-t-lg'>

          {/* Textarea for user input (includes the sumbit button) */}
          <div className='flex justify-between items-baseline px-3 pt-2'>
            <textarea className='w-full resize-none bg-transparent text-sm leading-6 text-foreground outline-none placeholder:text-neutral-600 disabled:opacity-0 px-3 py-2'
                      placeholder='Type your message here...' 
                      value={value} onChange={onChange} 
                      onKeyDown={handleKeyDown}
            />

            {/* Submit Button */}
            <button
              type='submit'
              className='mt-2 p-2 border-2 border-purple-950 text-white rounded relative overflow-hidden bg-purple-950/40 hover:bg-purple-950/60 hover:border-purple-900'
            >
              <ArrowUp className='size-4 z-10'/>
            </button>
          </div>

          {/* Model, mode, and API Key Selection */}
          <div className='pb-2 px-3'>
            {/* Desktop: All in one row, Mobile: Select menus stay in row, API input moves below */}
            <div className='flex flex-col gap-2'>
              
              {/* Model and Mode Selection Container - Always in a row */}
              <div className='flex items-center gap-2'>
                {/* Model Selection - Gets more space on desktop */}
                <Select onValueChange={(value) => setSelectedModel(value)} defaultValue='gemini-2.5-flash-lite'>
                    <SelectTrigger className="w-fit bg-neutral-950 border-neutral-800 text-neutral-100 hover:bg-neutral-900">
                        <SelectValue placeholder="Select model" className="text-neutral-100" />
                    </SelectTrigger>
                    <SelectContent side="top" className="bg-neutral-950 border-neutral-800 text-neutral-100">
                        <SelectGroup className="flex flex-col w-fit">
                        <SelectLabel className="text-neutral-400">Models</SelectLabel>
                        { aiModels.map((model) => (
                            <Tooltip key={model.slug} >
                                <TooltipTrigger>
                                    <SelectItem key={model.slug} value={model.slug} disabled={apiKey.length === 0} className="text-neutral-100 hover:bg-neutral-800 focus:bg-neutral-800">
                                        {model.name}
                                        { model.reasoning && <span className="text-xs text-purple-500">{`(thinking)`}</span> }
                                    </SelectItem>
                                </TooltipTrigger>
                                <TooltipContent side="right" className="bg-neutral-900 border-neutral-700 text-neutral-100">
                                    <div className="relative">
                                        {model.attributes.map((attr, index) => (
                                            <div key={index} className="text-xs text-neutral-200">
                                                {attr}
                                            </div>
                                        ))}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                {/* Mode Selection - Gets adequate space on desktop */}
                { aiModels.find(model => model.slug === selectedModel)?.modes && (
                  <Select onValueChange={(e) => setSelectedMode(e)} defaultValue={selectedMode} value={selectedMode}>
                      <SelectTrigger className="w-fit min-w-0 bg-neutral-950 border-neutral-800 text-neutral-100 hover:bg-neutral-900">
                          <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent side="top" className="bg-neutral-950 border-neutral-800 text-neutral-100">
                          <SelectGroup>
                          <SelectLabel className="text-neutral-400">Mode</SelectLabel>
                          { aiModels.find(model => model.slug === selectedModel)?.modes.map((mode, index) => (
                            <SelectItem key={index} disabled={apiKey.length === 0} value={mode} className="text-neutral-100 hover:bg-neutral-800 focus:bg-neutral-800">{mode}</SelectItem>
                          ))}
                          </SelectGroup>
                      </SelectContent>
                  </Select>
                )}

                {/* Desktop: API Key stays in the same row - Smaller width */}
                {/* <div className="hidden  sm:flex items-center gap-1 flex-shrink-0">
                  <input 
                    type='password' 
                    className='w-40 p-2 text-sm rounded outline-none focus:outline-none placeholder:text-neutral-600 bg-neutral-950 border border-neutral-800 text-neutral-100 hover:border-neutral-700 focus:border-neutral-600' 
                    placeholder='API key' 
                    value={apiKey} 
                    onChange={(e) => setApiKey(e.target.value)} 
                  />             
                  {apiKey && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          onClick={copyApiKey}
                          className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded transition-colors flex-shrink-0"
                        >
                          {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-neutral-900 border-neutral-700 text-neutral-100">
                        <p className="text-xs">{copied ? 'Copied!' : 'Copy API key'}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div> */}

              {/* Mobile: API Key Input on separate row */}
              {/* <div className="flex sm:hidden items-center gap-1">
                <input 
                  type='password' 
                  className='flex-1 p-2 text-sm rounded outline-none focus:outline-none placeholder:text-neutral-600 bg-neutral-950 border border-neutral-800 text-neutral-100 hover:border-neutral-700 focus:border-neutral-600' 
                  placeholder='Enter API key' 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)} 
                /> */}
                
                {/* Copy Button */}
                {/* {apiKey && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={copyApiKey}
                        className="p-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 rounded transition-colors flex-shrink-0"
                      >
                        {copied ? <Check className="size-4 text-green-500" /> : <Copy className="size-4" />}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-neutral-900 border-neutral-700 text-neutral-100">
                      <p className="text-xs">{copied ? 'Copied!' : 'Copy API key'}</p>
                    </TooltipContent>
                  </Tooltip>
                )}*/}
              </div> 

            </div>
          </div>
        </div>
      </form>
  )
}
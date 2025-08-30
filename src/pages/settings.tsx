import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useModelContext } from "@/context/ModelContext"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"

export default function Settings() {
    const { apiKey, setApiKey } = useModelContext()
    const [ geminiKey, setGeminiKey ] = useState<string>("")
    const [ isCopied, setIsCopied ] = useState<boolean>(false)
    const [ isSaved, setIsSaved ] = useState<boolean>(false)

    useEffect(() => {
        setGeminiKey(apiKey)
    }, [apiKey])

    function handleCopy(){
        navigator.clipboard.writeText(geminiKey)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 1000)
    }

    function handleSaveKeys(){
        setApiKey(geminiKey)
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 1000)
    }

    return (
        <main className='bg-neutral-950 flex flex-row overflow-x-hidden'>
            <div className="max-w-xl w-full p-2 mx-auto h-screen flex flex-col overflow-x-hidden">
                <div className="flex items-center gap-3">
                    <a href="/"><ArrowLeft /></a>
                    <h1 className="text-2xl font-bold">Settings</h1>
                </div>

                <hr className="my-4"/>

                <div className="max-w-4xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">Your API Keys</h3>
                        <Button onClick={handleSaveKeys}>
                            {isSaved ? "Saved Keys" : "Save Keys"}
                        </Button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                            <div className="flex items-center justify-start mb-2">
                                <h4 className="font-medium">Gemini API Key</h4>
                            </div>

                            <div className="flex items-center gap-2">
                                <Input 
                                    type="password" 
                                    placeholder="Enter your Gemini API key" 
                                    className="w-full lg:w-1/2" 
                                    value={geminiKey}
                                    onChange={(e) => setGeminiKey(e.target.value)}
                                />
                                <Button variant={"outline"} size={"sm"} onClick={handleCopy}>
                                    {isCopied ? "Copied" : "Copy"}
                                </Button>
                                <Button 
                                    variant={"ghost"} 
                                    size={"sm"} 
                                    onClick={() => setGeminiKey("")}
                                    className="text-red-600 hover:text-red-500 hover:bg-red-300/20"
                                >
                                    Clear
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

import { BicepsFlexed, CodeSquare, Heart, HeartHandshake, Laptop, PocketKnifeIcon } from "lucide-react";
import { useModelContext } from "../context/ModelContext";

type ModeStruct = {
    name: string;
    description: string;
    icon?: any; // Optional icon, can be used for future enhancements
}

export default function WelcomeScreen() {


    const { setSelectedMode, selectedMode } = useModelContext();
    const modes: ModeStruct[] = [
        {
            name: "Assistant",
            description: "A assistant to help you with your daily tasks.",
            icon: <Laptop className="size-6 text-white"/>
        },
        {
            name: "Bro",
            description: "Your bro, a bully, a best friend.",
            icon: <BicepsFlexed className="size-6 text-blue-400" />
        },
        {
            name: "Developer",
            description: "An SWE to help you with your coding problems.",
            icon: <CodeSquare className="size-6 text-green-400" />
        },
        {            
            name: "Girlfriend",
            description: "Your girlfriend, here to support and love you.",
            icon: <Heart className="size-6 text-pink-600" />
        },
        {            
            name: "Boyfriend",
            description: "Your boyfriend, here to love and support you.",
            icon: <Heart className="size-6 text-purple-600" />
        },
        {            
            name: "Therapist",
            description: "A pseudo therapist to talk to.",
            icon: <HeartHandshake className="size-6 text-red-400" />
        },
        {            
            name: "Monday",
            description: "Sarcastic and mean, like the worst day of the week.",
            icon: <PocketKnifeIcon className="size-6 text-orange-400" />
        }
    ]

    return (
        <div className="flex flex-col gap-8 mx-auto items-center pt-18 h-full text-center text-neutral-400">
            <div>
                <h1 className="text-3xl font-bold text-neutral-200 mb-2">Gemini Chat</h1>
                <p>Select a model, enter your API key, and start chatting.</p>
                <p className="text-sm">Get your API key from the <a href="https://aistudio.google.com/u/0/apikey" className="text-purple-800 hover:underline">AI Studio</a>.</p>
                <p className="text-sm">Save it in <a href="/settings" className="text-purple-800 hover:underline">settings</a></p>
            </div>
            <div className="flex flex-col">
                { modes.map((mode) => (
                    <button key={mode.name} onClick={() => setSelectedMode(mode.name)}
                            className={`px-2 py-1 flex items-center gap-4 ${ mode.name === selectedMode ? 'bg-neutral-900/70 hover:bg-neutral-900' : 'bg-neutral-950 hover:bg-neutral-900/20'} border-2 border-neutral-900/20 rounded-lg transition-colors duration-200`}>
                        { mode.icon ? mode.icon : null }
                        <div className="flex flex-col items-baseline">
                            <h2 className="text-base text-neutral-300 font-semibold">{mode.name}</h2>
                            <p className="text-xs">{mode.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
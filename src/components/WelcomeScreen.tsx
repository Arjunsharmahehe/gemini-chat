export default function WelcomeScreen() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-neutral-400">
            <h1 className="text-4xl font-bold text-neutral-200 mb-2">Gemini Chat</h1>
            <p>Select a model, enter your API key, and start chatting.</p>
            <p>Get your API key from the <a href="https://aistudio.google.com/u/0/apikey" className="text-purple-800 hover:underline">AI Studio</a>.</p>
        </div>
    );
}
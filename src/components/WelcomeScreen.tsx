export default function WelcomeScreen() {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-neutral-400">
            <h1 className="text-4xl font-bold text-neutral-200 mb-2">Gemini Chat</h1>
            <p>Select a model, enter your API key, and start chatting.</p>
        </div>
    );
}
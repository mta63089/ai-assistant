import ChatBot from "./components/ui/chatbot";

function App() {
  return (
    <>
      <div className="flex flex-1 flex-col antialiased w-full min-h-svh bg-amber-300">
        <div className="mx-auto text-4xl font-bold p-2">Chatbot</div>
        <ChatBot />
      </div>
    </>
  );
}

export default App;

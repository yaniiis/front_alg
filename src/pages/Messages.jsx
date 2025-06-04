import { useState, useEffect, useRef } from "react";

const fakeConversations = [
  {
    id: 1,
    user: "Alice Martin",
    messages: [
      { id: 1, sender: "Alice Martin", text: "Hey! How are you?", time: "10:00 AM" },
      { id: 2, sender: "You", text: "I'm good, thanks! And you?", time: "10:05 AM" },
    ],
  },
  {
    id: 2,
    user: "Théo Durand",
    messages: [
      { id: 1, sender: "Théo Durand", text: "Did you check the new React update?", time: "Yesterday" },
      { id: 2, sender: "You", text: "Not yet, planning to do it today.", time: "Yesterday" },
    ],
  },
];

export default function Messages() {
  const [conversations, setConversations] = useState(fakeConversations);
  const [selectedConvId, setSelectedConvId] = useState(conversations[0].id);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const selectedConversation = conversations.find(c => c.id === selectedConvId);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedConversation.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConvId) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            { 
              id: conv.messages.length + 1, 
              sender: "You", 
              text: newMessage.trim(), 
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            },
          ],
        };
      }
      return conv;
    });
    setConversations(updatedConversations);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversations list */}
      <div className="w-72 bg-white border-r border-gray-300 flex flex-col">
        <h2 className="text-xl font-bold p-4 border-b border-gray-300">Messages</h2>
        <div className="flex-1 overflow-auto">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setSelectedConvId(conv.id)}
              className={`w-full text-left px-4 py-3 border-b border-gray-200 hover:bg-gray-100 transition ${
                conv.id === selectedConvId ? "bg-indigo-100 font-semibold" : ""
              }`}
            >
              {conv.user}
            </button>
          ))}
        </div>
      </div>

      {/* Chat window */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-300 bg-white font-semibold">
          Chat with {selectedConversation.user}
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-4 bg-gray-50">
          {selectedConversation.messages.map(msg => (
            <div
              key={msg.id}
              className={`max-w-xs p-3 rounded-lg ${
                msg.sender === "You" ? "bg-indigo-500 text-white self-end" : "bg-white text-gray-800 self-start"
              }`}
            >
              <p>{msg.text}</p>
              <span className="text-xs opacity-70">{msg.time}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 bg-white border-t border-gray-300 flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") handleSendMessage();
            }}
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
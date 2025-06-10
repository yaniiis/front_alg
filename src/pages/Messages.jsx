import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, selectedConvId]);

  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    const userId = parseInt(storedId, 10);
    console.log("useEffect lancé");
    console.log("storedId:", storedId);
    console.log("userId:", userId);

    axios
      .get(`http://localhost:3001/messages/${userId}`)
      .then((res) => {
        const messages = res.data;
        const convsMap = {};

        messages.forEach((msg) => {
          const partnerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
          const partnerName = msg.sender_id === userId ? msg.receiver_username : msg.sender_username;

          if (!convsMap[partnerId]) {
            convsMap[partnerId] = {
              id: partnerId,
              user: partnerName,
              messages: [],
            };
          }

          convsMap[partnerId].messages.push({
            id: msg.id,
            sender: msg.sender_id === userId ? "You" : partnerName,
            text: msg.content,
            time: new Date(msg.sent_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          });
        });

        const convs = Object.values(convsMap);
        setConversations(convs);
        if (convs.length > 0) {
          setSelectedConvId(convs[0].id);
        }
      })
      .catch((err) => {
        console.error("Erreur récupération des messages:", err);
      });
  }, []);

  const selectedConversation = conversations.find((c) => c.id === selectedConvId);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const senderId = localStorage.getItem("userId");
    const receiverId = selectedConvId;

    axios
      .post("http://localhost:3001/messages", {
        sender_id: senderId,
        receiver_id: receiverId,
        content: newMessage.trim(),
      })
      .then((res) => {
        const insertedMessage = res.data;

        const updatedConversations = conversations.map((conv) => {
          if (conv.id === selectedConvId) {
            return {
              ...conv,
              messages: [
                ...conv.messages,
                {
                  id: insertedMessage.id,
                  sender: "You",
                  text: insertedMessage.content,
                  time: new Date(insertedMessage.sent_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ],
            };
          }
          return conv;
        });

        setConversations(updatedConversations);
        setNewMessage("");
      })
      .catch((error) => {
        if (error.response) {
          console.error("Erreur serveur:", error.response.status, error.response.data);
        } else if (error.request) {
          console.error("Pas de réponse du serveur:", error.request);
        } else {
          console.error("Erreur Axios:", error.message);
        }
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 p-4 flex">
      <Sidebar />

      {/* Sidebar conversations */}
      <div className="w-72 bg-white border-r border-gray-300 flex flex-col ml-60">
        <h2 className="text-xl font-bold p-4 border-b border-gray-300">Messages</h2>
        <div className="flex-1 overflow-auto">
          {conversations.map((conv) => (
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

      {/* Fenêtre de chat */}
      <div className="flex-1 flex flex-col">
        {conversations.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-gray-600 text-lg">
            No conversations yet.
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-gray-300 bg-white font-semibold">
              Chat with {selectedConversation?.user}
            </div>
            <div className="flex-1 overflow-auto p-4 space-y-4 bg-gray-50 flex flex-col">
              {selectedConversation?.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-xs p-3 rounded-lg ${
                    msg.sender === "You"
                      ? "bg-indigo-500 text-white self-end"
                      : "bg-white text-gray-800 self-start"
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
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className={`px-4 py-2 rounded transition ${
                  newMessage.trim()
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

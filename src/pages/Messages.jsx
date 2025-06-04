import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedConvId, setSelectedConvId] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  // Scroll en bas quand les messages changent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, selectedConvId]);

  // Chargement des messages depuis le backend au montage du composant
  useEffect(() => {
    const userId = 1; // Remplace par l'id de l'utilisateur connecté
    axios
      .get(`http://localhost:3001/messages/${userId}`)
      .then((res) => {
        const messages = res.data; // tableau de messages brut

        // Regrouper messages par interlocuteur pour faire des conversations
        const convsMap = {};
        messages.forEach((msg) => {
          // On identifie l'autre utilisateur (le partenaire de conversation)
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
            time: new Date(msg.sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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

  if (conversations.length === 0) return <div>Chargement...</div>;

  const selectedConversation = conversations.find((c) => c.id === selectedConvId);

  if (!selectedConversation) return <div>Sélectionnez une conversation</div>;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Ici tu peux faire un POST vers le backend pour enregistrer le message avant de mettre à jour le front

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedConvId) {
        return {
          ...conv,
          messages: [
            ...conv.messages,
            {
              id: conv.messages.length + 1,
              sender: "You",
              text: newMessage.trim(),
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
      {/* Sidebar conversations */}
      <div className="w-72 bg-white border-r border-gray-300 flex flex-col">
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
        <div className="p-4 border-b border-gray-300 bg-white font-semibold">
          Chat avec {selectedConversation.user}
        </div>
        <div className="flex-1 overflow-auto p-4 space-y-4 bg-gray-50 flex flex-col">
          {selectedConversation.messages.map((msg) => (
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
            placeholder="Tapez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSendMessage();
            }}
            className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}

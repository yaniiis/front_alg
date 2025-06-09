import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:3001/notifications/${userId}`)
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Erreur fetch notifications :", err));
  };

  const markAsRead = (notificationId) => {
    fetch(`http://localhost:3001/notifications/${notificationId}/read`, {
      method: "PATCH",
    })
      .then(() => {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, is_read: true } : n
          )
        );
      })
      .catch((err) => {
        console.error("Erreur mise à jour notification :", err);
      });
  };

  const handleFriendRequest = (id, accepted) => {
    fetch(`http://localhost:3001/notifications/${id}/friend_request`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: accepted ? "accepted" : "declined" }),
    })
      .then(() => {
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id
              ? {
                  ...notif,
                  friend_request_status: accepted ? "accepted" : "declined",
                  is_read: true,
                }
              : notif
          )
        );
      })
      .catch((err) => {
        console.error("Erreur traitement demande d'ami :", err);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-200 p-4">
      <Sidebar />
      <div className="ml-60 flex justify-center items-center">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg mt-10"
        >
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Notifications
          </h2>
          <ul className="flex flex-col gap-3 max-h-[600px] overflow-y-auto">
            {notifications.length === 0 && (
              <li className="text-center text-gray-500">No notifications</li>
            )}
            {notifications.map((notif) => (
              <li
                key={notif.id}
                className={`p-4 rounded-lg border shadow-sm ${
                  notif.is_read ? "bg-gray-50" : "bg-blue-50 cursor-pointer"
                }`}
                onClick={() => {
                  if (!notif.is_read) markAsRead(notif.id);
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-800">{notif.content}</span>
                  {!notif.is_read && (
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                      New
                    </span>
                  )}
                </div>

                {notif.type === "friend_request" && !notif.friend_request_status && (
                  <div className="mt-3 flex gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFriendRequest(notif.id, true);
                      }}
                      className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFriendRequest(notif.id, false);
                      }}
                      className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Decline
                    </button>
                  </div>
                )}

                {notif.friend_request_status && (
                  <div className="mt-3 text-sm font-semibold text-gray-700">
                    {notif.friend_request_status === "accepted" && (
                      <span className="text-green-600">Friend request accepted</span>
                    )}
                    {notif.friend_request_status === "declined" && (
                      <span className="text-red-600">Friend request declined</span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
}

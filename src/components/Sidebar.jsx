import { Link } from "react-router-dom";
import { Home, User, Users, LogOut } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="h-screen w-60 bg-white shadow-xl fixed top-0 left-0 p-6 flex flex-col justify-between">
      <div>
        <Link
          to="/feed"
          className="text-2xl font-bold text-indigo-700 mb-10 block hover:text-indigo-600 transition"
        >
          MyNetwork
        </Link>
        <nav className="flex flex-col gap-4">
          <Link
            to="/feed"
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
          >
            <Home size={20} />
            News Feed
          </Link>
          <Link
            to="/messages"
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
          >
            <User size={20} />
            Message
          </Link>
          <Link
            to="/notification "
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
          >
            <Users size={20} />
            Notification 
          </Link>
          <Link
            to="/suggestions"
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
          >
            <Users size={20} />
            Suggestions
          </Link>
          <Link
            to="/profile"
            className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
          >
            <User size={20} />
            Profile
          </Link>
        </nav>
      </div>
      <button
        onClick={() => alert("Simulated logout")}
        className="flex items-center gap-2 text-red-500 hover:text-red-600 transition"
      >
        <LogOut size={20} />
        Log out
      </button>
    </div>
  );
}

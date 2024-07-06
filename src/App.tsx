import { useEffect, useRef, useState } from "react";
import "./App.css";
import Sidebar from "./components/sidebar";
import {
  FaPhoneAlt,
  FaSearch,
  FaEllipsisV,
  FaPaperclip,
  FaMicrophone,
  FaSmile,
} from "react-icons/fa";

interface Message {
  id: number;
  sender: {
    id: number;
    name: string;
  };
  message: string;
  created_at: any;
}

function App() {
  const [selectedChat, setSelectedChat] = useState<number | null>(null); // State to hold selected chat message
  const [selectedUserName, setSelectedUserName] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const messagesEndRef = useRef(null);

  const handleToggleDarkMode = () => {
    console.log("Toggling dark mode");
    setDarkMode((prevMode) => !prevMode);
  };

  console.log(darkMode);

  const fetchMessages = async (chatId: number) => {
    try {
      const response = await fetch(
        `https://devapi.beyondchats.com/api/get_chat_messages?chat_id=${chatId}`
      );
      const data = await response.json();
      if (data.status === "success") {
        setMessages(data.data);
        const otherUser = data.data.find((msg: Message) => msg.sender.id !== 1);
        if (otherUser) {
          setSelectedUserName(otherUser.sender.name);
        }
      } else {
        console.error("Error fetching messages:", data.message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleChatClick = (chatId: number) => {
    setSelectedChat(chatId);
    fetchMessages(chatId);
  };
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom(); // Scroll to the bottom when messages change

    // Scroll to the bottom and focus on the last message when a chat is selected
    if (selectedChat && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage) {
        const messageElement = document.getElementById(
          `message-${lastMessage.id}`
        );
        if (messageElement) {
          messageElement.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  }, [selectedChat, messages]);

  // Function to scroll to the bottom of the message container
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      //@ts-ignore
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="h-screen flex flex-row">
        <Sidebar
          onChatClick={handleChatClick}
          onToggleDarkMode={handleToggleDarkMode}
        />
        <div className="flex-1 flex flex-col bgDark bg-contain overflow-y-auto">
          {/* Navbar */}

          {selectedChat && (
            <div className="flex items-center justify-between p-4 bg-[#333333] sticky top-0 z-10">
              <div className="flex items-center">
                <img
                  src={"https://avatar.iran.liara.run/public"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-2"
                />
                <span className="text-white">
                  {selectedUserName || "Unknown"}
                </span>
              </div>
              <div className="flex space-x-4 text-white">
                <FaSearch />
                <FaPhoneAlt />
                <FaEllipsisV />
              </div>
            </div>
          )}

          {/* Display selected chat messages */}
          <div className="p-4 w-auto flex-1 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                id={`message-${msg.id}`}
                className={`p-2 mb-2 shadow-md rounded-md ${
                  msg.sender.id === 1
                    ? "flex justify-end"
                    : "flex justify-start"
                }`}
              >
                <div
                  className={`p-2 flex rounded-md ${
                    msg.sender.id === 1 ? "bg-green-200" : "bg-white"
                  }`}
                >
                  <p>{msg.message}</p>
                  <p className="text-xs pt-2 pl-2 text-gray-500">
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/*  */}

          <div className="flex  items-center p-2 bg-[#333333] sticky bottom-0 z-10">
            <FaPaperclip size={20} className="text-white mr-4" />
            <input
              type="text"
              placeholder="Write a message"
              className="flex-1 p-2 rounded-full bg-[#333333] text-white outline-none"
            />
            <FaMicrophone size={20} className="text-white ml-4 mr-2" />
            <FaSmile size={20} className="text-white mr-4 " />
          </div>
          {/*  */}
        </div>
      </div>
    </>
  );
}

export default App;

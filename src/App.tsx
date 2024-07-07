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
import { IoMdArrowBack } from "react-icons/io";
import { ThemeProvider } from "./contexts/theme";
import { useRecoilValue, useSetRecoilState } from "recoil";
import sidebarAtom from "./atoms/uiAtoms";
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
  const messagesEndRef = useRef(null);
  const sideBar = useRecoilValue(sidebarAtom);
  const setSidebar = useSetRecoilState(sidebarAtom);

  const handleClick = () => {
    setSidebar(false);
  };

  // DARK MODE / LIGHT MODE
  const [themeMode, setThemeMode] = useState("dark");

  const lightTheme = () => {
    setThemeMode("light");
  };

  const darkTheme = () => {
    setThemeMode("dark");
  };

  useEffect(() => {
    //@ts-ignore

    document.querySelector("html").classList.remove("light", "dark");
    //@ts-ignore

    document.querySelector("html").classList.add(themeMode);
  }, [themeMode]);

  //

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
    <ThemeProvider value={{ themeMode, lightTheme, darkTheme }}>
      <div className="h-screen flex flex-row dark:bg-[#2f2f2f]">
        <Sidebar onChatClick={handleChatClick} />
        <div
          className={`flex-1 flex flex-col dark:bg-[url('./assets/bg.png')] bgLight bg-contain  overflow-y-auto ${
            !sideBar ? "sm:hidden hidden md:block lg:block xl:block" : ""
          }`}
        >
          {/* Navbar */}
          {!selectedChat && (
            <div className="flex justify-center items-center h-screen dark:text-white">
              <p className=" p-2 rounded-lg backdrop-blur-md dark:bg-zinc-900 bg-zinc-900/10">
                Select a chat to start messaging
              </p>
            </div>
          )}

          {selectedChat && (
            <div className="flex items-center justify-between p-4 dark:bg-[#333333] bg-white sticky top-0 z-10">
              <div className="flex items-center">
                <IoMdArrowBack
                  onClick={handleClick}
                  size={25}
                  className="dark:text-white mr-4 md:hidden block sm:block"
                />
                <img
                  src={"https://avatar.iran.liara.run/public"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full mr-2"
                />
                <span className="dark:text-white font-medium">
                  {selectedUserName || "Unknown"}
                </span>
              </div>
              <div className="flex space-x-4 dark:text-white">
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
                className={`p-2 mb-2  rounded-md ${
                  msg.sender.id === 1
                    ? "flex justify-end"
                    : "flex justify-start"
                }`}
              >
                <div
                  className={`p-2 flex rounded-md ${
                    msg.sender.id === 1
                      ? "bg-green-200 dark:bg-[#836FE6]"
                      : "bg-[#f1f0f0] dark:bg-[#2a2a2a]"
                  }`}
                >
                  <p className="dark:text-[#ffffff]">{msg.message}</p>
                  <p className="text-xs pt-2 pl-2 text-gray-500 dark:text-slate-300">
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/*  */}

          {selectedChat && (
            <div className="flex  items-center p-2 bg-white dark:bg-[#333333]  sticky bottom-0 z-10">
              <FaPaperclip
                size={20}
                className="dark:text-white text-gray-500 mr-4"
              />
              <input
                type="text"
                placeholder="Write a message"
                className="flex-1 p-2 rounded-full dark:bg-[#333333] dark:text-white outline-none"
              />
              <FaMicrophone
                size={20}
                className="dark:text-white text-gray-500 ml-4 mr-2"
              />
              <FaSmile
                size={20}
                className="dark:text-white text-gray-500 mr-4 "
              />
            </div>
          )}

          {/*  */}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;

import { BsBookmark } from "react-icons/bs";
import { BsPerson } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { BiBug } from "react-icons/bi";

export const navbar = [
  { key: 1, icon: <BsBookmark />, text: "Saved Messages", toggleButton: null },
  { key: 2, icon: <BsPerson />, text: "Contacts", toggleButton: null },
  { key: 3, icon: <FiSettings />, text: "Settings", toggleButton: null },

  {
    key: 5,
    icon: <AiOutlineQuestionCircle />,
    text: "Telegram Features",
    toggleButton: null,
  },
  { key: 7, icon: <BiBug />, text: "Report Bug", toggleButton: null },
];

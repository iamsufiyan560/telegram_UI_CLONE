import { RxHamburgerMenu } from "react-icons/rx";
import { TfiSearch } from "react-icons/tfi";
import Messagelist from "./messagelist";
import { useState } from "react";
import { navbar } from "../constants";

import { GiNightSleep } from "react-icons/gi";
import SwitchButton from "../components/switch_button";
import { useRecoilValue } from "recoil";
import sidebarAtom from "../atoms/uiAtoms";

interface SidebarProps {
  onChatClick: (chatId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onChatClick }) => {
  const [toggle, setToggle] = useState(false);
  const sideBar = useRecoilValue(sidebarAtom);

  return (
    <>
      <div
        className={`flex flex-col w-[420px] h-full  px-3 bg-dark_theme overflow-y-auto ${
          sideBar ? "sm:hidden hidden md:block lg:block xl:block" : ""
        } `}
      >
        <div className="flex flex-row py-2 justify-between items-center text-gray-300">
          {/* burgger button*/}
          <div
            className="hover:bg-zinc-700  rounded-full p-2  "
            onClick={() => setToggle(!toggle)}
          >
            <RxHamburgerMenu className="text-xl" />
          </div>
          {/* search */}
          <div className="dark:bg-neutral-700 bg-slate-200  rounded-full p-1 w-full flex flex-row justify-center items-center ml-4 ">
            <div className="pl-2">
              <TfiSearch className="text-md " />
            </div>
            <input
              type="search"
              className="dark:bg-transparent bg-slate-200   w-full pl-3 p-1 placeholder:dark:text-gray-300 focus:ring-0 outline-none rounded-r-full focus:rounded-s-none rounded-t-full rounded-b-full "
              placeholder="Search"
            />
          </div>
        </div>
        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } px-2 py-2 backdrop-blur-md dark:bg-black/10 bg-zinc-900/10 absolute top-10 left-0 mx-4 my-3 min-w-fit z-10 rounded-xl shadow-md  `}
        >
          <ul className="list-none flex justify-end items-center flex-col gap-4 text-white font-semibold text-sm">
            <li className="hover:bg-black/60 py-1 pl-1 pr-3 w-full rounded-md">
              <div className="flex flex-row justify-between items-start">
                <div className="flex   justify-start items-start">
                  <span className="pr-3 text-lg ">
                    <GiNightSleep />
                  </span>
                  "Night Mode"
                </div>
                <div className="pl-16">
                  <SwitchButton />
                </div>
              </div>
            </li>

            {navbar.map((n) => (
              <li
                key={n.key}
                className="hover:bg-black/60 py-1 pl-1 pr-3 w-full rounded-md"
              >
                <div className="flex flex-row justify-between items-start">
                  <div className="flex justify-start items-start">
                    <span className="pr-3 text-lg ">{n.icon}</span>
                    {n.text}
                  </div>
                </div>
              </li>
            ))}
            <li className="text-xs text-primary">Telegram Web A 1.61.33</li>
          </ul>
        </div>

        <div className="flex flex-col">
          <Messagelist onChatClick={onChatClick} />
        </div>
      </div>
    </>
  );
};

export default Sidebar;

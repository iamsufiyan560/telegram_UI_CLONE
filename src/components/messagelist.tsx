import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { GrFormPreviousLink, GrFormNextLink } from "react-icons/gr";
import { format, isThisWeek, isToday, parseISO } from "date-fns";
import Loading from "./Loading";

interface MessageListProps {
  onChatClick: (chatId: number) => void;
}

const fetchChatList = async (page: number) => {
  const response = await fetch(
    `https://devapi.beyondchats.com/api/get_all_chats?page=${page}`
  );
  const data = await response.json();
  return data.data;
};

const fetchLastMessage = async (chatId: number) => {
  const response = await fetch(
    `https://devapi.beyondchats.com/api/get_chat_messages?chat_id=${chatId}`
  );
  const data = await response.json();
  const messages = data.data;
  return messages.length > 0 ? messages[messages.length - 1] : null;
};

const fetchChatData = async (page: number) => {
  const chatList = await fetchChatList(page);

  const chatData = await Promise.all(
    chatList.data.map(async (chat: any) => {
      const lastMessage = await fetchLastMessage(chat.id);
      return {
        ...chat,
        lastMessage,
      };
    })
  );

  return {
    ...chatList,
    data: chatData,
  };
};

const formatTime = (dateString: string) => {
  const date = parseISO(dateString);

  if (isToday(date)) {
    return format(date, "hh:mm a");
  } else if (isThisWeek(date)) {
    return format(date, "EEEE");
  } else {
    return format(date, "dd MMM");
  }
};

const Messagelist: React.FC<MessageListProps> = ({ onChatClick }) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["chatList", page],
    queryFn: () => fetchChatData(page),
    // keepPreviousData: true,
    staleTime: Infinity,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center mt-[250px]">
        <Loading />;
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center mt-[250px]">
        <span>Error while fetching data</span>
      </div>
    );
  }

  const lastPage = data.last_page; // Assuming the API returns the total number of pages

  return (
    <div>
      <div className="flex justify-center items-center gap-2 mt-5">
        <button
          className="border p-2 text-white rounded-md cursor-pointer disabled:cursor-not-allowed"
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={!data.prev_page_url}
        >
          <GrFormPreviousLink />
        </button>
        <div className="border p-2 text-white rounded-md">
          {page} / {lastPage}
        </div>
        <button
          className="border p-2 text-white rounded-md cursor-pointer disabled:cursor-not-allowed"
          onClick={() => {
            if (data.next_page_url) {
              setPage((old) => old + 1);
            }
          }}
          disabled={!data.next_page_url}
        >
          <GrFormNextLink />
        </button>
      </div>
      <div>
        {data.data.map((chat: any) => (
          <div
            key={chat.id}
            onClick={() => onChatClick(chat.id)}
            className="flex flex-row p-3 hover:bg-gray-200 hover:bg-opacity-5 rounded-2xl"
          >
            <img
              src={chat.creator.image || "https://avatar.iran.liara.run/public"}
              alt="Chat avatar"
              className="rounded-full w-12 h-12"
            />
            <div className="flex flex-col flex-1 px-4">
              <div className="text-lg font-bold  text-white md:block">
                {chat.creator.name || "Unknown"}
              </div>
              <div className="text-md font-medium text-primary  md:block">
                {chat.lastMessage?.message
                  ? `${chat.lastMessage.message.substring(0, 50)}...`
                  : "No message"}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="text-xs text-primary">
                {chat.lastMessage
                  ? formatTime(chat.lastMessage.created_at)
                  : "No last message time"}
              </div>
              <div className="flex justify-end py-1">
                <span className="bg-slate-600 rounded-xl px-2 text-white">
                  {chat.msg_count || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messagelist;

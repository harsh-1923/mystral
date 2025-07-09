"use client";
import React from "react";

import { Globe, Plus, Search, SearchIcon, Sparkles } from "lucide-react";
import ClipPathTabs from "./ClipPathTabs";
import { motion } from "motion/react";
import Tooltip from "../components/ui/Tooltip";
import ThinkingBulb from "@/app/components/icons/ThinkingBulb";

const XyneChatbox = () => {
  const [selectedTab, setSelectedTab] = React.useState<string>("Ask AI");
  const [isReasoning, setIsReasoning] = React.useState<boolean>(false);
  const [searchWeb, setSearchWeb] = React.useState<boolean>(false);

  const handleTabClick = (tab: string) => {
    setSelectedTab(tab);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === "t" || e.key === "T")) {
        setSelectedTab((prev) => (prev === "Ask AI" ? "Search" : "Ask AI"));
        e.preventDefault(); // Prevent browser default (new tab)
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const staggerDelay = 0.05;

  const textAreaVariant = {
    askAI: {
      paddingTop: 14,
      paddingBottom: 60,
      paddingRight: 16,
      paddingLeft: 14,
    },
    search: {
      paddingTop: 14,
      paddingBottom: 14,
      paddingRight: 60,
      paddingLeft: 48,
    },
  };

  const textCtrVariants = {
    askAI: {
      minHeight: 96,
    },
    search: {
      minHeight: 64,
    },
  };

  return (
    <div className="space-y-3 w-full h-full m-2 sm:m-4 md:m-10">
      <div className="w-full">
        <ClipPathTabs
          tabs={[
            { name: "Ask AI", slot: <Sparkles className="w-4 h-4" /> },
            { name: "Search", slot: <Search className="w-4 h-4" /> },
          ]}
          onTabClick={handleTabClick}
          tabColor="#FF4F4F"
          activeTab={selectedTab}
        />
      </div>
      <motion.div
        variants={textCtrVariants}
        initial="askAI"
        animate={selectedTab === "Ask AI" ? "askAI" : "search"}
        className="relative w-full overflow-clip rounded-[20px]"
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 19,
          mass: 1.2,
        }}
      >
        {selectedTab === "Search" && (
          <motion.div
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 19,
              mass: 1.2,
            }}
            className="absolute left-4 top-3 size-6 flex items-center justify-center"
          >
            <SearchIcon className="size-4 mt-0.5 text-black" />
          </motion.div>
        )}
        <motion.input
          layout
          name="xyne-chatbox"
          variants={textAreaVariant}
          initial="askAI"
          animate={selectedTab === "Ask AI" ? "askAI" : "search"}
          transition={{
            type: "spring",
            stiffness: 150,
            damping: 19,
            mass: 1.2,
          }}
          className="w-full h-full border border-gray-400 rounded-[20px] text-black focus:outline-[var(--colors-focus)] overflow-clip bg-white"
          placeholder="Ask me anything..."
        />
        {selectedTab === "Search" && (
          <motion.button
            key="hg"
            layoutId="sd"
            transition={{
              type: "spring",
              stiffness: 150,
              damping: 19,
              mass: 1.2,
            }}
            className="bg-black size-8 rounded-full flex items-center justify-center absolute right-4 top-2.5"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              color="white"
            >
              <path d="M8.99992 16V6.41407L5.70696 9.70704C5.31643 10.0976 4.68342 10.0976 4.29289 9.70704C3.90237 9.31652 3.90237 8.6835 4.29289 8.29298L9.29289 3.29298L9.36907 3.22462C9.76184 2.90427 10.3408 2.92686 10.707 3.29298L15.707 8.29298L15.7753 8.36915C16.0957 8.76192 16.0731 9.34092 15.707 9.70704C15.3408 10.0732 14.7618 10.0958 14.3691 9.7754L14.2929 9.70704L10.9999 6.41407V16C10.9999 16.5523 10.5522 17 9.99992 17C9.44764 17 8.99992 16.5523 8.99992 16Z"></path>
            </svg>
          </motion.button>
        )}
        {selectedTab === "Ask AI" && (
          <motion.div
            layout
            className="absolute left-0 bottom-0 right-0 h-14 text-black flex items-center justify-between px-3.5 "
          >
            <div className="flex items-center space-x-2">
              <Tooltip content="Add files" side="bottom" align="start">
                <motion.button
                  key={"attachments"}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{
                    delay: 0 * staggerDelay,
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className="size-9 flex items-center justify-center rounded-full border-[1px] border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 bg-white"
                >
                  <Plus className={"w-4 h-4"} />
                </motion.button>
              </Tooltip>
              <Tooltip content="Search the web" side="bottom" align="start">
                <motion.button
                  key={"attachments-2"}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{
                    delay: 1 * staggerDelay,
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className={`size-9 flex items-center justify-center rounded-full border-[1px] transition-all duration-200  ${
                    searchWeb
                      ? "border-blue-500 bg-blue-50"
                      : "bg-white hover:border-gray-300 hover:bg-gray-50 border-gray-200 "
                  }`}
                  onClick={() => setSearchWeb(!searchWeb)}
                >
                  <Globe className={"w-4 h-4"} />
                </motion.button>
              </Tooltip>
              <Tooltip content="Toggle for enhanced reasoning" side="bottom">
                <motion.button
                  key={"attachments-3"}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  transition={{
                    delay: 2 * staggerDelay,
                    duration: 0.2,
                    ease: "easeOut",
                  }}
                  className={`h-9 px-3 flex items-center justify-center rounded-full border-[1px]  transition-all duration-200  gap-2 ${
                    isReasoning
                      ? "border-blue-500 bg-blue-50"
                      : "bg-white hover:border-gray-300 hover:bg-gray-50 border-gray-200 "
                  }`}
                  onClick={() => setIsReasoning(!isReasoning)}
                >
                  <ThinkingBulb />
                  Reasoning
                </motion.button>
              </Tooltip>
            </div>
            <div>
              <motion.button
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 19,
                  mass: 1.2,
                }}
                key="u"
                layoutId="sd"
                className="bg-black size-9 rounded-full flex items-center justify-center"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  color="white"
                >
                  <path d="M8.99992 16V6.41407L5.70696 9.70704C5.31643 10.0976 4.68342 10.0976 4.29289 9.70704C3.90237 9.31652 3.90237 8.6835 4.29289 8.29298L9.29289 3.29298L9.36907 3.22462C9.76184 2.90427 10.3408 2.92686 10.707 3.29298L15.707 8.29298L15.7753 8.36915C16.0957 8.76192 16.0731 9.34092 15.707 9.70704C15.3408 10.0732 14.7618 10.0958 14.3691 9.7754L14.2929 9.70704L10.9999 6.41407V16C10.9999 16.5523 10.5522 17 9.99992 17C9.44764 17 8.99992 16.5523 8.99992 16Z"></path>
                </svg>
              </motion.button>
            </div>
          </motion.div>
          // </AnimatePresence>
        )}
        {/* </AnimatePresence> */}
      </motion.div>
    </div>
  );
};

export default XyneChatbox;

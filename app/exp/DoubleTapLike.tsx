"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useDoubleTap } from "../components/hooks";

const DoubleTapLike = () => {
  const AWAIT_TIME = 300;
  const doubleTapAbleAreaRef = React.useRef<HTMLDivElement>(null);
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const [showDiv, setShowDiv] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  const { attachListeners, cleanup } = useDoubleTap(doubleTapAbleAreaRef, {
    onDoubleTap: (position) => {
      console.log("Double tap detected at position:", position);

      // Reset everything first
      setShowDiv(false);
      setShowPlaceholder(false);

      // Small delay to ensure reset is visible, then start new sequence
      setTimeout(() => {
        setTapPosition(position);
        setShowDiv(true);

        // Wait for AWAIT_TIME then show placeholder
        setTimeout(() => {
          setShowPlaceholder(true);
        }, AWAIT_TIME);
      }, 50);
    },
    threshold: 300,
    maxDelay: 300,
  });

  useEffect(() => {
    const cleanupListeners = attachListeners();
    return () => {
      cleanupListeners?.();
      cleanup();
    };
  }, [attachListeners, cleanup]);

  return (
    <div className="w-full h-100 flex flex-col items-center justify-center gap-2.5 debug">
      <div
        className="w-full h-full flex flex-1 debug relative"
        ref={doubleTapAbleAreaRef}
      >
        {showDiv && (
          <motion.div
            id="overlay"
            layoutId="Hello"
            className="absolute w-10 h-10 bg-red-500/50 flex items-center justify-center"
            initial={{ scale: 1 }}
            animate={{
              scale: 1.5,
              y: -50,
              rotate: Math.floor(Math.random() * 91) - 45,
            }}
            style={{
              left: tapPosition.x - 20,
              top: tapPosition.y - 20,
            }}
          >
            <Heart className="w-6 h-6 text-red-500" fill="currentColor" />
          </motion.div>
        )}
      </div>
      <div className="w-full relative flex items-center debug">
        <div className="w-10 h-10 relative debug">
          <div className="absolute inset-0"></div>
          {showPlaceholder && (
            <motion.div
              id="placeholder"
              layoutId="Hello"
              className="w-10 h-10 bg-red-500/20 flex items-center justify-center"
              transition={{
                duration: 0.2,
              }}
            >
              <Heart className="w-6 h-6 text-red-500/50" fill="currentColor" />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoubleTapLike;

"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

import { Heart } from "lucide-react";
import { useDoubleTap } from "../components/hooks";

const CraftCard = ({
  title,
  href,
  date,
}: {
  title: string;
  href: string;
  date: string;
}) => {
  const AWAIT_TIME = 300;
  const doubleTapAbleAreaRef = React.useRef<HTMLDivElement>(null);
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const [showHeart, setShowHeart] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [likeCount, setLikeCount] = useState(100);

  const { attachListeners, cleanup } = useDoubleTap(doubleTapAbleAreaRef, {
    onDoubleTap: (position) => {
      console.log("Double tap detected at position:", position);

      // Reset everything first
      setShowHeart(false);
      setShowPlaceholder(false);

      // Small delay to ensure reset is visible, then start new sequence
      setTimeout(() => {
        setTapPosition(position);
        setShowHeart(true);
        setLikeCount((prev) => prev + 1);

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
    <div className="w-full">
      <div className="w-full relative" ref={doubleTapAbleAreaRef}>
        <video
          autoPlay
          loop
          muted
          controlsList="nofullscreen"
          disablePictureInPicture
          playsInline
          className="w-full h-full object-cover rounded-md overflow-clip"
          src={
            "https://imharsh.s3.eu-north-1.amazonaws.com/glyph-inspector.mov"
          }
        />
        {showHeart && (
          <motion.div
            id="overlay"
            layoutId="Hello"
            className="absolute flex items-center justify-center pointer-events-none"
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
            <Heart className="w-4 h-4 text-red-500" fill="currentColor" />
          </motion.div>
        )}
      </div>
      <div className="py-2">
        <h3 className="font-medium">Glyph Inspector</h3>
        <div className="flex items-center gap-1">
          {showPlaceholder ? (
            <motion.div
              id="placeholder"
              layoutId="Hello"
              className="w-4 h-4 flex items-center justify-center"
              transition={{
                duration: 0.2,
              }}
            >
              <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
            </motion.div>
          ) : (
            <Heart className="w-4 h-4" />
          )}
          <span className="text-sm">{likeCount}</span>
        </div>
      </div>
    </div>
  );
};

export default CraftCard;

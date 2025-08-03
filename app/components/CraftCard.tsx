"use client";
import React, { useEffect, useState, useId } from "react";
import { motion } from "motion/react";

import { Heart } from "lucide-react";
import { useDoubleTap } from "../components/hooks";
import { supabase } from "../../lib/supabase";

const CraftCard = ({
  id,
  title,
  href,
  date,
}: {
  id: string;
  title: string;
  href: string;
  date: string;
}) => {
  const uniqueId = useId();
  const AWAIT_TIME = 300;
  const doubleTapAbleAreaRef = React.useRef<HTMLDivElement>(null);
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const [showHeart, setShowHeart] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Create unique identifiers
  const overlayId = `overlay-${title}-${uniqueId}`;
  const placeholderId = `placeholder-${title}-${uniqueId}`;
  const layoutId = `heart-layout-${title}-${uniqueId}`;

  // Fetch current like count from Supabase
  const fetchLikes = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("craft_likes")
        .select("like_count")
        .eq("craft_id", id)
        .single();

      if (error) {
        // If record doesn't exist, create it
        if (error.code === "PGRST116") {
          const { error: insertError } = await supabase
            .from("craft_likes")
            .insert({ craft_id: id, like_count: 0 });

          if (!insertError) {
            setLikeCount(0);
          }
        }
        console.error("Error fetching likes:", error);
      } else {
        setLikeCount(data.like_count);
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update like count in Supabase
  const updateLikes = async (increment: number = 1) => {
    try {
      const { error } = await supabase
        .from("craft_likes")
        .update({ like_count: likeCount + increment })
        .eq("craft_id", id);

      if (error) {
        console.error("Error updating likes:", error);
      }
    } catch (error) {
      console.error("Error updating likes:", error);
    }
  };

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
        updateLikes(1);

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

  // Fetch initial like count and set up real-time subscription
  useEffect(() => {
    fetchLikes();

    // Set up real-time subscription
    const subscription = supabase
      .channel(`craft_likes_${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "craft_likes",
          filter: `craft_id=eq.${id}`,
        },
        (payload) => {
          if (payload.new && typeof payload.new.like_count === "number") {
            setLikeCount(payload.new.like_count);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [id]);

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
          className="w-full h-full object-cover rounded-lg overflow-clip"
          src={href}
        />
        {showHeart && (
          <motion.div
            key={`heart-overlay-${uniqueId}`}
            id={overlayId}
            layoutId={layoutId}
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
        <h3 className="font-medium">{title}</h3>
        <div className="flex items-center gap-1">
          {showPlaceholder ? (
            <motion.div
              key={`heart-placeholder-${uniqueId}`}
              id={placeholderId}
              layoutId={layoutId}
              className="w-4 h-4 flex items-center justify-center"
              transition={{
                duration: 0.2,
              }}
            >
              <Heart className="w-5 h-5 text-red-500" fill="currentColor" />
            </motion.div>
          ) : (
            <button
              key={`heart-button-${uniqueId}`}
              onClick={() => {
                setLikeCount((prev) => prev + 1);
                updateLikes(1);
              }}
              disabled={isLoading}
            >
              <Heart className="w-4 h-4" />
            </button>
          )}
          <span className="text-sm">{isLoading ? "..." : likeCount}</span>
        </div>
      </div>
    </div>
  );
};

export default CraftCard;

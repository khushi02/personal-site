"use client";

import { useEffect, useRef, useState } from "react";

// Plays a single YouTube track (audio only, via a hidden IFrame player).
// Starts muted + autoplaying so unmuting is instant; loops forever.
const VIDEO_ID = "ws5K_5G_xvI";
const SONG = "the dress";
const ARTIST = "dijon";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function NowPlaying() {
  const playerRef = useRef<any>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    function createPlayer() {
      if (cancelled || !mountRef.current || playerRef.current || !window.YT?.Player)
        return;
      playerRef.current = new window.YT.Player(mountRef.current, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          loop: 1,
          playlist: VIDEO_ID, // required for single-video loop
          playsinline: 1,
          disablekb: 1,
          modestbranding: 1,
        },
        events: {
          onReady: (e: any) => {
            e.target.mute();
            e.target.playVideo();
            setReady(true);
          },
          onStateChange: (e: any) => {
            // Belt-and-suspenders loop in case the playlist param drops it.
            if (e.data === window.YT.PlayerState.ENDED) {
              e.target.seekTo(0);
              e.target.playVideo();
            }
          },
        },
      });
    }

    if (window.YT?.Player) {
      createPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        createPlayer();
      };
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(s);
      }
    }

    return () => {
      cancelled = true;
    };
  }, []);

  function toggle() {
    const p = playerRef.current;
    if (!p) return;
    if (muted) {
      p.unMute();
      p.setVolume(100);
      p.playVideo();
      setMuted(false);
    } else {
      p.mute();
      setMuted(true);
    }
  }

  const playing = ready && !muted;

  return (
    <>
      {/* Hidden audio player — offscreen but rendered (display:none blocks playback). */}
      <div
        aria-hidden
        className="pointer-events-none fixed -left-[9999px] top-0 h-px w-px overflow-hidden"
      >
        <div ref={mountRef} />
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-label={muted ? `Play ${SONG} by ${ARTIST}` : "Mute music"}
        title={muted ? "tap to play" : "tap to mute"}
        className="absolute right-6 top-16 z-10 flex items-center gap-2.5 text-muted transition-colors hover:text-ink sm:top-28"
      >
        <span className="flex flex-col items-end leading-tight">
          <span className="font-sans text-[10px] uppercase tracking-[0.2em]">
            now playing
          </span>
          <span className="mt-0.5 hidden font-serif text-sm italic sm:inline">
            {SONG} · {ARTIST}
          </span>
        </span>
        <span className="eq" data-playing={playing} aria-hidden>
          <span />
          <span />
          <span />
          <span />
        </span>
      </button>
    </>
  );
}

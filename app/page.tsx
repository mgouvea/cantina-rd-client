"use client";
import { Home } from "@/components/Home";
import { useEffect } from "react";

const Page = () => {
  const openFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      alert("Fullscreen API not supported on this browser.");
    }
  };

  useEffect(() => {
    openFullscreen();
  }, []);

  return <Home />;
};

export default Page;

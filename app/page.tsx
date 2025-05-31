"use client";
import { Home } from "@/components/Home";
import { useEffect } from "react";

const Page = () => {
  const openFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else {
      alert("This browser does not support fullscreen mode.");
    }
  };

  useEffect(() => {
    openFullscreen();
  }, []);

  return <Home />;
};

export default Page;

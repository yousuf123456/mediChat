"use client";

import { useState } from "react";
import AuthForm from "./components/AuthForm";

import clsx from "clsx";
import { cn } from "@/lib/utils";
import { BsChat } from "react-icons/bs";
import Image from "next/image";
import { CupSoda } from "lucide-react";

export default function Home() {
  const customStyle: { height: string } = {
    height: "110%",
  };

  type currentFormProps = "SIGN IN" | "SIGN UP";

  const [currentForm, setCurrentForm] = useState<currentFormProps>("SIGN IN");

  const containerCs = "py-2";
  const labelCs = "font-nunito px-5 text-black font-medium text-xl";

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-pink-100">
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex max-[960px]:flex-col gap-0 max-sm:w-full max-sm:h-full">
          <div className="px-12 pt-8 sm:py-3 lg:py-6 z-50 rounded-l-lg flex items-center bg-white">
            <div className="flex flex-col gap-10 w-full items-center">
              <div className="flex flex-col items-center gap-2">
                <div className="lg:w-[100px] w-[75px] h-[37px] lg:h-[50px] relative">
                  <Image fill alt="Logo" src={"/images/logo.png"} />
                </div>

                <h1 className="text-slate-950 min-[960px]:text-3xl hidden min-[460px]:block text-2xl font-nunito font-medium">
                  ChatVibe
                </h1>
              </div>

              <p className="mt-10 hidden min-[960px]:block text-lg xl:text-xl text-black opacity-75 text-center max-w-xs xl:max-w-sm font-extralight font-nunito">
                Start Vibing With This World And Create New Friends
              </p>

              <div className="flex-col hidden min-[960px]:flex items-center gap-2">
                <CupSoda className="xl:w-7 w-6 h-6 xl:h-7 text-black opacity-75" />
                <p className="xl:text-xl text-lg text-black opacity-75 font-nunito font-extralight">
                  Enjoy The Life
                </p>
              </div>
            </div>
          </div>

          <AuthForm setCurrentForm={setCurrentForm} />
        </div>
      </div>
    </div>
  );
}

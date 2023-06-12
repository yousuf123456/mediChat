"use client";

import { useState } from "react";
import AuthForm from "./components/AuthForm";

import clsx from "clsx";

export default function Home() {

  const customStyle : {height : string} = {
    height: '110%'
  };

  type currentFormProps = "SIGN IN" | "SIGN UP" 

  const [currentForm, setCurrentForm] = useState<currentFormProps>("SIGN IN");

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-blue-600">
      <div className="grid min-[520px]:w-auto w-full grid-cols-1 grid-flow-col gap-0 place-content-center justify-center">
        
        <div className={clsx("relative top-1/2 -translate-y-1/2 rounded-sm w-[220px] bg-white py-4 pr-4 pb-16 hidden md:flex flex-col", currentForm === "SIGN IN" ? "gap-[100px]" : "gap-[171px]")} style={customStyle}>
          <div className="mt-8 ml-4">
            <h1 className="text-3xl font-extrabold text-indigo-950 text-center">MediChat</h1>
          </div>

          <div>
            <div className=" py-4 px-4 "><h2 className=" font-extrabold text-indigo-950 text-2xl">Chat</h2></div>
            <div className=" flex justify-end py-1.5 px-4 bg-blue-600 rounded-e-md rounded-r-md "><h2 className=" font-extrabold text-white text-xl">Connect</h2></div>
            <div className=" py-4 px-4 "><h2 className=" font-extrabold text-indigo-950 text-2xl">Heal</h2></div>
          </div>
        </div>
        
        <AuthForm setCurrentForm={setCurrentForm}/>

      </div>
    </div>
  )
}

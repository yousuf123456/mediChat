"use client";

import Image from "next/image";
import { CupSoda } from "lucide-react";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-zinc-100">
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex max-[960px]:flex-col gap-0 max-sm:w-full max-sm:h-full">
          <div className="px-12 pt-8 sm:py-3 lg:py-6 z-50 rounded-l-lg flex items-center bg-white">
            <div className="flex flex-col gap-10 w-full items-center">
              <div className="flex flex-col items-center gap-2">
                <div className="lg:w-[100px] w-[75px] h-[37px] lg:h-[50px] relative">
                  <Image fill alt="Logo" src={"/images/logo.png"} />
                </div>

                <h1 className="text-transparent bg-clip-text bg-gradient-to-b from-black to-pink-500 min-[960px]:text-3xl hidden min-[460px]:block text-2xl font-nunito font-medium">
                  ChatVibe
                </h1>
              </div>

              <p className="mt-10 hidden min-[960px]:block text-lg xl:text-xl text-black opacity-75 text-center max-w-xs xl:max-w-sm font-light font-nunito">
                Start Vibing With This World And Create Friends
              </p>

              <div className="flex-col hidden min-[960px]:flex items-center gap-2">
                <CupSoda className="xl:w-7 w-6 h-6 xl:h-7 text-black opacity-60" />
                <p className="xl:text-xl text-lg text-black opacity-75 font-nunito font-light">
                  Enjoy The Life
                </p>
              </div>

              <div className="flex gap-4 w-full">
                <SignedIn>
                  <SignOutButton>
                    <Button variant={"secondary"} className="w-full">
                      Sign Out
                    </Button>
                  </SignOutButton>
                </SignedIn>

                <SignedOut>
                  <SignInButton>
                    <Button className="w-full bg-black/95 hover:bg-black/90">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button className="w-full" variant={"secondary"}>
                      Create Account
                    </Button>
                  </SignUpButton>
                </SignedOut>
              </div>
            </div>
          </div>

          {/* <AuthForm setCurrentForm={setCurrentForm} /> */}
        </div>
      </div>
    </div>
  );
}

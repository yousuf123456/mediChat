"use client";

import axios from "axios";

import AuthInput from "@/app/components/inputs/AuthInput";
import { signIn, useSession } from "next-auth/react";
import { FormButton } from "@/app/components/inputs/FormButton";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AuthSocialButton } from "./AuthSocialButton";

import { BsGoogle, BsGithub } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

type Variants = "LOGIN" | "SIGN UP";

interface AuthFormProps {
  setCurrentForm: Dispatch<SetStateAction<"SIGN IN" | "SIGN UP">>;
}

function AuthForm({ setCurrentForm }: AuthFormProps) {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/conversations");
    }
  }, [status, router]);

  const [variants, setVariants] = useState<Variants>("LOGIN");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleVariant = (): void => {
    if (variants === "LOGIN") {
      setVariants("SIGN UP");
      setCurrentForm("SIGN UP");
    } else {
      setVariants("LOGIN");
      setCurrentForm("SIGN IN");
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variants === "SIGN UP") {
      axios
        .post("../../../api/register", data)
        .then(() => {
          signIn("credentials", { ...data, redirect: false }).then(() => {
            router.push("/conversations");
            toast.success("Registered Successfully !");
          });
        })
        .catch((e) => {
          console.log(e);
          toast.error("Oops! Something went wrong");
        })
        .finally(() => setIsLoading(false));
    } else {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            console.log(callback.error);
            toast.error("Something went wrong !");
          }

          if (callback?.ok && !callback?.error) {
            toast.success("Logged In !");
            router.push("/conversations");
            reset();
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (social: string): void => {
    setIsLoading(true);

    signIn(social, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Something went wrong !");
        }

        if (callback?.ok && !callback?.error) {
          toast.success("Logged In !");
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="px-3 py-3 flex flex-col justify-around sm:px-8 sm:py-6 max-sm:w-full max-sm:h-full bg-white rounded-r-lg">
      <div>
        <h2 className="text-center text-3xl min-[960px]:text-2xl font-medium font-nunito text-rose-500 capitalize">
          {variants.toLowerCase()}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-5 flex flex-col gap-4 sm:gap-6 sm:mt-8 min-[420px]:min-w-[420px]">
          {variants === "SIGN UP" && (
            <AuthInput
              id="name"
              type="text"
              required={false}
              register={register}
              disabled={isLoading}
              placeholder="Your Name"
            />
          )}

          <AuthInput
            id="email"
            type="email"
            placeholder="Email Adress"
            disabled={isLoading}
            required={false}
            register={register}
          />

          <AuthInput
            id="password"
            type="password"
            placeholder="Password"
            disabled={isLoading}
            required={false}
            register={register}
          />

          <FormButton type="submit" disabled={isLoading}>
            Continue
          </FormButton>
        </div>
      </form>

      <div className="mt-12 relative bg-red-200">
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-0 bg-white px-3">
          <p className="text-sm font-nunito font-light text-gray-600">
            Or Continue With
          </p>
        </div>
        <div className="w-full h-[1px] bg-slate-300" />
      </div>

      <div className="mt-4 flex gap-3 w-full">
        <AuthSocialButton
          disabled={isLoading}
          onClick={() => socialAction("google")}
          icon={BsGoogle}
        />
        <AuthSocialButton
          disabled={isLoading}
          onClick={() => socialAction("github")}
          icon={BsGithub}
        />
      </div>

      <div className="mt-6">
        {variants === "LOGIN" ? (
          <>
            <p className="text-sm text-center font-nunito text-gray-600 font-light">
              Just started using MediChat ?
            </p>
            <p
              onClick={toggleVariant}
              className=" text-sm text-center text-gray-800 font-nunito hover:underline cursor-pointer"
            >
              Create An Account
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-center font-nunito text-gray-600 font-light">
              Already have an account ?
            </p>
            <p
              onClick={toggleVariant}
              className="text-sm text-center text-gray-800 font-nunito hover:underline cursor-pointer"
            >
              Sign In
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthForm;

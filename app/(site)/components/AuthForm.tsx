"use client";

import axios from "axios"

import AuthInput from '@/app/components/inputs/AuthInput';
import {signIn, useSession} from "next-auth/react"
import { FormButton } from '@/app/components/inputs/FormButton';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { AuthSocialButton } from './AuthSocialButton';

import {BsGoogle, BsGithub} from "react-icons/bs"
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";


type Variants = "LOGIN" | "SIGN UP";

interface AuthFormProps {
    setCurrentForm : Dispatch<SetStateAction<"SIGN IN" | "SIGN UP">>
}

function AuthForm ( {setCurrentForm}  : AuthFormProps ) {

    const router = useRouter();
    const { status } = useSession();
  
    useEffect(()=>{
      if (status === "authenticated") {
        router.push("/conversations");
      }
    }, [status])

    
    const [variants, setVariants] = useState<Variants>("LOGIN");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const toggleVariant = ():void=>{
        if (variants === "LOGIN"){
            setVariants("SIGN UP")
            setCurrentForm("SIGN UP")}
        else{
            setVariants("LOGIN")
            setCurrentForm("SIGN IN")}
    }

    const { register, handleSubmit, reset, watch, formState : {errors} } = useForm<FieldValues>({
        defaultValues : {
            "name" : "",
            "email" : "",
            "password" : ""
        }
    })

    const onSubmit : SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        if (variants === "SIGN UP") {
            axios.post("../../../api/register", data)
            .then(()=>{
                signIn("credentials", {...data, redirect:false})
                .then(()=>{
                    router.push("/conversations");
                    toast.success("Registered Successfully !");
                })
            })
            .catch((e)=>{
                toast.error("Oops! Something went wrong")
            })
            .finally(()=>setIsLoading(false))
        }

        else {
            signIn("credentials", {
                ...data,
                redirect : false
            }).then((callback) => {
                if (callback?.error) {
                    toast.error("Something went wrong !")
                }

                if (callback?.ok && !callback?.error) {
                    toast.success("Logged In !");
                    router.push("/conversations");
                    reset();
                }
            }).finally(()=>setIsLoading(false))
        }
    }

    const socialAction = (social : string):void=>{
        setIsLoading(true);

        signIn(social, {redirect : false })
        .then((callback) => {
            if (callback?.error) {
                toast.error("Something went wrong !")
            }

            if (callback?.ok && !callback?.error) {
                toast.success("Logged In !");
            }
        }).finally(()=>setIsLoading(false))
    }

  return (
    <div className="relative px-6 py-6 sm:px-8 sm:py-6 bg-white w-11/12 min-[520px]:w-[420px] rounded-r-sm rounded-e-sm  border-l-[1.5px] border-l-[#211937] max-[520px]:left-1/2  max-[520px]:-translate-x-1/2">
        <div>
            <h2 className='text-center min-[520px]:text-left text-2xl font-bold text-indigo-950 capitalize'>{variants.toLowerCase()}</h2>
        </div>

        <div className=''>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='mt-5 flex flex-col gap-4 sm:gap-6 sm:mt-8 justify-center'>
                    { variants === "SIGN UP" &&
                        <AuthInput watch={watch} id="name" type='text' placeholder='Your Name' disabled={isLoading} required={false} register={register} errors={errors}/>
                    }

                    <AuthInput watch={watch} id="email" type='email' placeholder='Email Adress' disabled={isLoading} required={false} register={register} errors={errors}/>

                    <AuthInput watch={watch} id="password" type='password' placeholder='Password' disabled={isLoading} required={false} register={register} errors={errors}/>

                    <FormButton type='submit' disabled={isLoading}>continue</FormButton>
                </div>
            </form>
        </div>

        <div className='mt-8'>
            <div className='flex justify-center w-full'>
                <h3 className='text-center text-sm sm:text-base font-bold text-slate-500'>Or continue with</h3>
            </div>
            <div className='w-full mt-2 border-b-2 border-b-indigo-950' />
        </div>

        <div className='mt-4 flex gap-3 w-full'>
            <AuthSocialButton disabled={isLoading} onClick={() => socialAction("google")} icon={BsGoogle} />
            <AuthSocialButton disabled={isLoading} onClick={() => socialAction("github")} icon={BsGithub} />
        </div>

        <div className='mt-4'>
            {
                variants === "LOGIN" ? (
                    <>
                        <p className='text-sm text-center text-slate-600 font-normal'>Just started using MediChat ?</p>
                        <p onClick={toggleVariant} className=' text-sm text-center text-slate-700 font-medium underline cursor-pointer'>Create an account</p>
                    </>
                )

                :

                (
                    <>
                        <p className='text-sm text-center text-slate-600 font-normal'>Already have an account ?</p>
                        <p onClick={toggleVariant} className='text-sm text-center font-medium text-slate-700 underline cursor-pointer'>Sign In</p>
                    </>   
                )
            }
        </div>
    </div>
  )
}

export default AuthForm
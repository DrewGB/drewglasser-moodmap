"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, LoginSchema } from "@/lib/schemas"


export default function LoginForm() {
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    })

    async function onSubmit(data: LoginSchema){
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {"content-type" : "application/json"},
                body: JSON.stringify({
                    email: data.email,
                    password: data.password
                })
            })

            if(res.ok){
                // router.push("/dashboard")
            } else {
                setError("password", { type: "server", message: "Incorrect credentials"})
            }
        } catch (err) {
            console.error(err)
            setError("password", {type: "server", message: "Network Error"})
        }
        


    }

    return (
        <form className="m-10" onSubmit={handleSubmit(onSubmit)} noValidate>
          <h1 className="text-2xl mb-4">Sign in</h1>
          
          {/* E-mail */}
          <div className="mb-4">
            <label 
                className="block text-gray-200 text-sm font-bold mb-2" 
                htmlFor="username"
            >
              E-mail
            </label>
            <input 
                className="shadow bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                id="email"
                type="email" 
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
                placeholder="E-mail" 
            />
            {errors.email && (
                <p id="email-error" role="alert" className="text-sm text-gray-200 mt-1">
                    {String(errors.email.message)}
                </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-6">
            <label 
                className="block text-gray-200 text-sm font-bold mb-2" 
                htmlFor="password"
            >
              Password
            </label>
            <input 
                className="shadow bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                id="password"
                type="password" 
                {...register("password")}
                aria-invalid={errors.password ? "true" : "false"}
                aria-describedby={errors.password ? "password-error" : undefined }
                placeholder="******************" 
            />
            {errors.password && (
                <p id="password-error" role="alert" className="text-sm text-gray-200 mt-1">
                    {String(errors.password.message)}
                </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <button 
                className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                type="submit"
                disabled={isSubmitting}
            >
              Sign In
            </button>
            <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/register">
              Don't have an account?
            </Link>
          </div>
        </form>
    )
}
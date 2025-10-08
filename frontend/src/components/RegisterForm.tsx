"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registerSchema, RegisterSchema } from "@/lib/schemas"


export default function RegisterForm(){
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    });

    async function onSubmit(data: RegisterSchema) {
        const base = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000"
        
        try {
            const res = await fetch(`${base}/users/`, {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify({
                    first_name: data.firstName,
                    last_name: data.lastName,
                    email: data.email,
                    password: data.password
                })
            })

            if (res.ok) {
                router.push("/")
            } else {
                // try to parse JSON and show errors accordingly
                const payload = await res.json().catch(() => null);
                // Typical backend message: { detail: "Email already registered" }
                if (payload && payload.detail) {
                  // If the detail mentions email, bind it to the email field
                  const detail = payload.detail;
                  if (typeof detail === "string" && detail.toLowerCase().includes("email")) {
                    setError("email", { type: "server", message: String(detail) });
                  } else {
                    // generic form-level error
                    setError("confirmPassword", { type: "server", message: String(detail) }); 
                  }
                } else {
                  setError("confirmPassword", { type: "server", message: "Registration failed" });
                }
            }
        } catch (err) {
            console.error(err)
            setError("confirmPassword", {type: "server", message: "Network Error"})
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h1 className="text-2xl mb-4">Create an Account</h1>
            
            {/* First name */}
            <div className="mb-4">
                <label 
                    className="block text-gray-200 text-sm font-bold mb-2" 
                    htmlFor="firstName"
                >
                    First Name
                </label>
                <input 
                    className="shadow bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="firstName" 
                    {...register("firstName")} 
                    aria-invalid={errors.firstName ? "true" : "false"}
                    aria-describedby={errors.firstName ? "firstName-error" : undefined}
                    placeholder="First Name" 
                />
                {errors.firstName && (
                    <p id="firstName-error" role="alert" className="text-sm text-gray-200 mt-1">
                        {String(errors.firstName.message)}
                    </p>
                )}
            </div>

            {/* Last Name */}
            <div className="mb-4">
                <label 
                    className="block text-gray-200 text-sm font-bold mb-2" 
                    htmlFor="lastName"
                >   
                    Last Name
                </label>
                <input 
                    className="shadow bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="lastName"
                    {...register("lastName")}
                    aria-invalid={errors.lastName ? "true" : "false"}
                    aria-describedby={errors.lastName ? "lastName-error" : undefined}
                    placeholder="Last Name" 
                />
                {errors.lastName && (
                    <p id="lastName-error" role="alert" className="text-sm text-gray-200 mt-1">
                        {String(errors.lastName.message)}
                    </p>
                )}
            </div>

            {/* E-mail */}
            <div className="mb-4">
                <label 
                    className="block text-gray-200 text-sm font-bold mb-2" 
                    htmlFor="email"
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

            {/* Confirm Password */}
            <div className="mb-6">
                <label 
                    className="block text-gray-200 text-sm font-bold mb-2" 
                    htmlFor="confirmPassword"
                >
                    Confirm Password
                </label>
                <input 
                    className="shadow bg-gray-200 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="confirmPassword"
                    type="password" 
                    {...register("confirmPassword")}
                    aria-invalid={errors.confirmPassword ? "true" : "false" }
                    aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined }
                    placeholder="******************" 
                />
                {errors.confirmPassword && (
                    <p id="confirmPassword-error" role="alert" className="text-sm text-gray-200 mt-1">
                        {String(errors.confirmPassword.message)}
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
                    Register
                </button>
                <Link className="inline-block align-baseline font-bold text-sm text-white hover:text-gray-200" href="/">
                    Already have an account?
                </Link>
            </div>
        </form>
    )
}
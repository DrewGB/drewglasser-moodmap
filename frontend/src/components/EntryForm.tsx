"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { entrySchema, EntrySchema } from "@/lib/schemas"


export default function EntryForm()
{
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting }
    } = useForm<EntrySchema>({
        resolver: zodResolver(entrySchema),
        defaultValues: {
            title: "",
            body: "",
        }
    });

    async function onSubmit(data: EntrySchema)
    {
        try {
            const res = await fetch("/api/entries", {
                method: "POST",
                headers: { "content-type": "application/json"},
                body: JSON.stringify({
                    title: data.title,
                    body: data.body,
                    mood: data.mood
                })
            })

            if (res.ok){
                const payload = await res.json().catch(() => null);
                router.push(`/dashboard/entries/${payload.id}`)
            }
        } catch(err)
        {
            console.error(err)
        }
    }

    return (
        <form className="h-dvh w-full" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="grid">
                <input
                    className="mt-1 mx-1 p-1 border-2 text-xl"
                    type="text"
                    id="title" 
                    {...register("title")} 
                    aria-invalid={errors.title ? "true" : "false"}
                    aria-describedby={errors.title ? "title-error" : undefined}
                    placeholder="Title"
                />
                {errors.title && (
                    <p id="title-error" role="alert" className="text-sm text-red-500 mt-1 ml-2">
                        {String(errors.title.message)}
                    </p>
                )}
                {errors.body && (
                    <p id="body-error" role="alert" className="text-sm text-red-500 mt-1 ml-2">
                        {String(errors.body.message)}
                    </p>
                )}
            </div>
            <div className="grid">
                <input 
                    className="mt-1 mx-1 p-1 border-2 text-xl"
                    type="number" 
                    min="1" 
                    max="10"
                    id="mood" 
                    {...register("mood")} 
                    aria-invalid={errors.mood ? "true" : "false"}
                    aria-describedby={errors.mood ? "mood-error" : undefined}
                    placeholder="Mood (1-10)"
                />
                {errors.mood && (
                    <p id="mood-error" role="alert" className="text-sm text-red-500 mt-1 ml-2">
                        {String(errors.mood.message)}
                    </p>
                )}
            </div>
            <div className="grid h-4/6">
                <textarea 
                    className="mt-1 mx-1 p-1 border-2 h-full text-xl" 
                    placeholder="Description" 
                    id="body" 
                    {...register("body")} 
                    aria-invalid={errors.body ? "true" : "false"}
                    aria-describedby={errors.body ? "body-error" : undefined}
                    >    
                </textarea>
            </div>
            <div className="row-span-1">
                <button 
                    className="mt-4 mx-1 py-2 text-2xl rounded bg-green-500 hover:bg-green-500 w-full h-full text-black cursor-pointer" 
                    type="submit" 
                    disabled={isSubmitting}
                >
                    Save
                </button>
            </div>
        </form>
    )
}
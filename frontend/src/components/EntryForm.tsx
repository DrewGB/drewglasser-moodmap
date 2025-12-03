"use client"

export default function EntryForm()
{
    return (
        <form className="h-dvh w-full">
            <div className="grid">
                <input
                    className="mt-1 mx-1 p-2 border-2 text-2xl"
                    type="text" 
                    placeholder="Title"
                />
            </div>
            <div className="grid">
                <input 
                    className="mt-1 mx-1 p-2 border-2 text-2xl"
                    type="number" 
                    min="1" 
                    max="10"
                    placeholder="Mood (1-10)"
                />
            </div>
            <div className="grid h-5/6">
                <textarea className="mt-1 mx-1 border-2 h-full text-2xl" placeholder="Description" name="" id="" ></textarea>
            </div>
            <div className="row-span-1">
                <button className="mt-4 mx-1 py-2 text-2xl rounded bg-green-400 hover:bg-green-500 w-full h-full text-black" type="submit">
                    Save
                </button>
            </div>
        </form>
    )
}
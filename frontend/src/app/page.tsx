import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function Home() {
  return (
    <div id="landing-main" className="bg-black min-h-dvh overflow-hidden absolute top-0 left-0 w-full">
      <div id="image-shader" className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
      <nav className="bg-brand-bg p-6 flex absolute top-0 left-0 w-full justify-between">
        <Link href={"/"}>
          <h1 className="text-2xl">MoodMap</h1>
        </Link>
        <ul>
        </ul>
      </nav>
      <main className="grid grid-cols-3 min-h-dvh overflow-hidden">
        <div className="m-10 col-span-2 flex flex-col justify-around">
          <div>
            <h1 className="text-2xl">Welcome to MoodMap!</h1>
            <p className="mt-5">Journal how you are feeling and see your mood mapped out so you can understand how your mood is changing over time.</p>
          </div>
          
        </div>
        <div className="bg-brand-primary h-full flex flex-col justify-around">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}

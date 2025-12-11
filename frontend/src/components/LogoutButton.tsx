"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
      });
    } catch (err) {
      console.error("Failed to logout", err);
    } finally {
      router.push("/");
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="block w-full p-3 text-center hover:bg-brand-bg text-2xl text-red-400 cursor-pointer"
    >
      Logout
    </button>
  );
}

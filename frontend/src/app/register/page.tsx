import NavBar from "@/components/Navbar";
import RegisterForm from "@/components/RegisterForm";

export default function Register() {
  return (
    <div className="bg-brand-muted min-h-dvh flex flex-col justify-around">
      <NavBar />
      <main className="">
        <div className="p-10 w-1/2 mx-auto bg-brand-accent rounded-2xl">
            <RegisterForm />
        </div>
      </main>
    </div>
  );
}

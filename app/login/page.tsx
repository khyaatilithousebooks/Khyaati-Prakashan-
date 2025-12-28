import Image from "next/image";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen lg:h-screen grid grid-cols-1 lg:grid-cols-2">
     
      <div className="flex flex-col">
        <header className="p-6">
          <div className="flex items-center gap-2 text-sm font-medium">
            <div className="h-6 w-6 rounded-md bg-black" />
            Acme Inc.
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-6">
          <div className="w-full max-w-sm">
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-semibold">Login to your account</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your email below to login to your account.
              </p>
            </div>

            <LoginForm />
          </div>
        </main>
      </div>

     
      <div className="relative hidden lg:flex items-center justify-center bg-slate-50">
        <Image
          src="/LoginPage1.jpg"
          alt="Login illustration"
          fill
          className="object-contain"
          sizes="(min-width:1024px) 50vw, 100vw"
          priority
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>
    </div>
  );
}

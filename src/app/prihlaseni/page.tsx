import LoginForm from "./patch";
import { Suspense } from "react";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-teal-100 p-6">
      <div className="w-full max-w-md bg-yellow-50 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-teal-900">
          Vítejte v aplikaci Telibo🚀
        </h1>
        <Suspense
          fallback={<div className="text-center text-teal-800">Načítání…</div>}
        >
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}

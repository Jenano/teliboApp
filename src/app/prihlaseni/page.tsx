import LoginForm from "./patch";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-teal-100 p-6">
      <div className="w-full max-w-md bg-yellow-50 rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Přihlášení</h1>
        <LoginForm />
      </div>
    </main>
  );
}

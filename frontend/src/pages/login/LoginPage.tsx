import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { setAuth } from "../../services/authService";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Preencha email e senha.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await api.post("/login/", {
        email,
        password,
      });

      setAuth(data);

      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError("Credenciais inválidas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-[360px] bg-white border border-gray-200 rounded-xl shadow-md p-6">

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 border border-red-200 px-3 py-2 rounded-md">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div className="mb-4">
            <label className="text-xs text-gray-500 uppercase font-bold">
              Email
            </label>
            <input
              type="email"
              className="w-full mt-1 border-b border-gray-300 p-2 outline-none focus:border-teal-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
            />
          </div>

          <div className="mb-6">
            <label className="text-xs text-gray-500 uppercase font-bold">
              Senha
            </label>
            <input
              type="password"
              className="w-full mt-1 border-b border-gray-300 p-2 outline-none focus:border-teal-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 text-white py-2 rounded-lg font-semibold hover:bg-teal-800 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );  
}
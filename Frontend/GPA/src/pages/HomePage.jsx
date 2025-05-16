import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [mostrarLogin, setMostrarLogin] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulação de autenticação
    if (usuario === "admin" && senha === "1234") {
      navigate("/admin");
    } else if (usuario === "aluno" && senha === "1234") {
      navigate("/aluno/1");
    } else {
      alert("Credenciais inválidas.");
    }
  };

  return (
    <div>
      <Header />
      <main style={{ textAlign: "center", padding: "2rem" }}>
        <h2>Bem-vindo ao GPA</h2>
        <p>Sistema de acompanhamento de progresso acadêmico</p>

        {!mostrarLogin ? (
          <button
            onClick={() => setMostrarLogin(true)}
            style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
          >
            Login
          </button>
        ) : (
          <form
            onSubmit={handleLogin}
            style={{
              maxWidth: "300px",
              margin: "2rem auto",
              textAlign: "left",
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "8px",
            }}
          >
            <h3>Login</h3>
            <div>
              <label>Usuário:</label>
              <input
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <label>Senha:</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            <button type="submit" style={{ marginTop: "1rem" }}>
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMostrarLogin(false)}
              style={{
                marginLeft: "0.5rem",
                background: "#ccc",
                border: "none",
                padding: "0.4rem 0.8rem",
              }}
            >
              Cancelar
            </button>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}

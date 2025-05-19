import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulação de autenticação
    if (usuario === "admin" && senha === "1234") {
      onLogin("admin");
    } else if (usuario === "aluno" && senha === "1234") {
      onLogin("aluno");
    } else {
      alert("Credenciais inválidas.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "300px", margin: "auto" }}>
      <h2>Login</h2>
      <div>
        <label>Usuário:</label>
        <input value={usuario} onChange={(e) => setUsuario(e.target.value)} />
      </div>
      <div>
        <label>Senha:</label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
      </div>
      <button type="submit" style={{ marginTop: "1rem" }}>Entrar</button>
    </form>
  );
}
    
import { useState,useEffect  } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
  
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [alunos, setAlunos] = useState([]);
  const navigate = useNavigate();

  // Ao montar o componente, carrega a lista de alunos do backend
  useEffect(() => {
    axios
      .get("http://localhost:3000/alunos")  // rota do backend que retorna alunos
      .then((res) => {
        setAlunos(res.data);  // salva no estado alunos
      })
      .catch((error) => {
        console.error("Erro ao carregar alunos", error);
      });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    // Se for admin, faz login direto
    if (usuario === "admin" && senha === "admin1234") {
      sessionStorage.setItem(
        "usuarioLogado",
        JSON.stringify({ perfil: "admin", usuario })
      );
      navigate("/admin");
      return;
    }

    // Procura aluno pelo email (usuario) na lista carregada
    const alunoEncontrado = alunos.find((a) => a.email === usuario);

    // Verifica se o aluno foi encontrado e se a senha bate (aqui senha fixa só pra teste)
    if (alunoEncontrado && senha === "12345") {
      sessionStorage.setItem(
        "usuarioLogado",
        JSON.stringify({ perfil: "aluno", usuario, id: alunoEncontrado.id })
      );
      navigate(`/aluno/${alunoEncontrado.id}`);
    } else {
      alert("Credenciais inválidas.");
    }
  };

  return (
    <div>
      <Header />
      <main style={{ textAlign: "center", padding: "2rem" }}>
        <h2 style={{
          fontSize: "32px",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "1rem",
        }}
          
        >Bem-vindo ao GPA</h2>
        <p style={{
          fontSize: "18px",
          fontWeight: "bold",
          color: "#333",
        }}>Sistema de acompanhamento de progresso acadêmico</p> 
          <form
            onSubmit={handleLogin}
            style={{
              maxWidth: "300px",
              margin: "2rem auto",
              textAlign: "left",
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#f9f9f9",
            }}
          >

            <h3 style={{textAlign: "center",
              fontSize: "24px",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "1rem",
              textDecoration: "underline"
            }}>Login</h3>
            <div style={{ marginTop: "0.5rem" }}>
              <label style={{marginRight: 410,
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
                display: "block",
                marginBottom: "0.5rem",
                textAlign: "left"
               }}>Usuário:</label>
            
              <input
                value={usuario}
                type="text"
                style={{
                  width: "95%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "16px",
                  color: "#333",
                  backgroundColor: "#fff",
                  transition: "border-color 0.3s",
                  outline: "none",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  marginRight: 10,
                }}
                onChange={(e) => setUsuario(e.target.value)}
                required
              />
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <label style={{marginRight: 410,
                fontSize: "16px",
                fontWeight: "bold",
                color: "#333",
                display: "block",
                marginBottom: "0.5rem",
                textAlign: "left"
               }}>Senha:</label>
              <input
                type="password"
                style={{
                  width: "95%",
                  padding: "0.5rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "16px",
                  color: "#333",
                  backgroundColor: "#fff",
                  transition: "border-color 0.3s",
                  outline: "none",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  marginRight: 10,
                }}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            <button type="submit" style={{ marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background-color 0.3s",
              width: "100%",
              textAlign: "center",
              textDecoration: "none",
              display: "inline-block",  
             }}>
              Entrar
            </button>
          </form>
      
      </main>
      <Footer />
    </div>
  );
}

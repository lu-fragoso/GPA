import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

export default function AddMateriaPage() {
  const [className, setClassName] = useState("");
  const [classDescription, setClassDescription] = useState("");
  const [classTime, setClassTime] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const navigate = useNavigate();

  const handleAddClass = async (e) => {
  e.preventDefault();

  if (className.trim() === "") {
    alert("Nome da matéria não pode estar vazio!");
   
    return;
  }
  if (classDescription.trim() === "") {
    alert("Descrição da matéria não pode estar vazia!");

    return;
  }
  if (classTime.trim() === "") {
    alert("Duração da matéria não pode estar vazia!");
  
    return;
  }
  if (classLevel.trim() === "") {
    alert("Nível da matéria não pode estar vazio!");
   
    return;
  }

  console.log("Nova matéria:", { className, classDescription, classTime, classLevel });

  try {
    const payload = {
      nome: className,
      descricao: classDescription,
      duracao: parseInt(classTime, 10),
      nivel: classLevel,
    };

    const response = await axios.post("http://localhost:3000/cursos", payload);
  

    navigate("/admin"); // Navega só se deu certo
  } catch (error) {
    alert("Erro ao adicionar matéria. Tente novamente.");
    console.error(error);
  } finally {
    setClassName("");
    setClassDescription("");
    setClassTime("");
    setClassLevel("");
    
  }
};


  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    },
    content: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "start",
      padding: 24,
      backgroundColor: "#f9fafb",
    },
    formBox: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 32,
      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
      width: "100%",
      maxWidth: 600,
      display: "flex",
      flexDirection: "column",
      gap: 16,
    },
    title: {
      fontSize: "2rem",
      fontWeight: "700",
      marginBottom: 24,
      color: "#333",
      textAlign: "center",
    },
    input: {
      border: "1.5px solid #cbd5e1",
      borderRadius: 8,
      padding: "12px 16px",
      fontSize: 16,
      outline: "none",
      transition: "border-color 0.2s",
    },
    inputFocus: {
      borderColor: "#2563eb",
    },
    button: {
      backgroundColor: "#333",
      color: "white",
      padding: "12px 16px",
      fontSize: 16,
      fontWeight: "600",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    buttonHover: {
      backgroundColor: "#1e40af",
    },
  };

  // State para hover no botão (opcional, para melhor UX)
  const [isHover, setIsHover] = useState(false);

  return (
    <div style={styles.container}>
      <Header />
      <main style={styles.content}>
        <div style={styles.formBox}>
          <h1 style={styles.title}>Adicionar Matéria</h1>

          <input
            type="text"
            placeholder="Nome da matéria"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
          />

          <input
            type="text"
            placeholder="Descrição da matéria"
            value={classDescription}
            onChange={(e) => setClassDescription(e.target.value)}
            style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
          />

          <input
            type="number"
            placeholder="Duração da matéria (minutos)"
            value={classTime}
            onChange={(e) => setClassTime(e.target.value)}
            style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
          />

          <input
            type="text"
            placeholder="Nível"
            value={classLevel}
            onChange={(e) => setClassLevel(e.target.value)}
            style={styles.input}
            onFocus={(e) => (e.target.style.borderColor = "#2563eb")}
            onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
          />

          <button
            style={isHover ? { ...styles.button, ...styles.buttonHover } : styles.button}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onClick={handleAddClass}
          >
            Adicionar Matéria
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

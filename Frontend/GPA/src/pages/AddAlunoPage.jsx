import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  content: {
    flex: 1,
    maxWidth: 480,
    margin: "40px auto",
    padding: "0 16px",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 24,
    color: "#111827",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  input: {
    padding: "12px 16px",
    fontSize: 16,
    borderRadius: 8,
    border: "1.5px solid #d1d5db",
    outline: "none",
    transition: "border-color 0.3s, box-shadow 0.3s",
  },
  inputFocus: {
    borderColor: "#2563eb",
    boxShadow: "0 0 6px rgba(37, 99, 235, 0.5)",
  },
  select: {
    padding: "12px 16px",
    fontSize: 16,
    borderRadius: 8,
    border: "1.5px solid #d1d5db",
    outline: "none",
    transition: "border-color 0.3s, box-shadow 0.3s",
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#333",
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    padding: "12px 0",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonHover: {
    backgroundColor: "#1e40af",
  },
  errorMessage: {
    color: "#b91c1c",
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  formContainer: {
  border: "2px ",  // borda azul sólida
  borderRadius: 12,
  padding: 24,
  marginTop: 20,
  boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)", // sombra leve
  backgroundColor: "#ffffff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  maxWidth: 600,   // largura máxima maior
  width: "90%",    // largura relativa à tela, até o maxWidth
},
};

export default function AddAlunoPage() {
  const [studentName, setStudentName] = useState("");
  const [studentsAge, setStudentsAge] = useState("");
  const [studentsEmail, setstudentsEmail] = useState("");
  const [studentsClass, setStudentsClass] = useState("");
  const [classes, setClasses] = useState([]);
  const [focusedInput, setFocusedInput] = useState(null);
  const [hoverButton, setHoverButton] = useState(false);
  const navigate = useNavigate();

  const handleGetData = async () => {
    try {
      

       const resCursos = await axios.get("http://localhost:3000/cursos");
       
       setClasses(resCursos.data);

     
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
    }
     
  };


  useEffect(() => {
    handleGetData();
  }, []);

  const handleAddStudent = async (e) => {
  e.preventDefault();


  if (studentName.trim() === "") {
    alert("Nome do aluno não pode estar vazio!");
   
    return;
  }
  if (studentsAge === "") {
    alert("Idade do aluno não pode estar vazia!");
   
    return;
  }
  if (studentsClass === "") {
    alert("Selecione uma turma!");
    
    return;
  }

  try {
    const payload = {
      nome: studentName,
      idade: parseInt(studentsAge, 10),
      email: studentsEmail,
      curso: studentsClass,
    };

    // Cria aluno
    const response = await axios.post("http://localhost:3000/alunos", payload);
    const alunoId = response.data.id;

    // Pega módulos da matéria
    const resModulos = await axios.get(`http://localhost:3000/modulos?curso_id=${studentsClass}`);
    const modulosDaMateria = resModulos.data;

    // Cria progresso inicial para cada módulo (concluido: false)
    for (const modulo of modulosDaMateria) {
      await axios.post("http://localhost:3000/progresso_modulos", {
        aluno_id: alunoId,
        curso_id: studentsClass,
        modulo_id: modulo.id,
        concluido: false,
      });
    }

    alert("Aluno cadastrado com sucesso!");
    navigate("/admin");
  } catch (error) {
    console.error("Erro ao cadastrar aluno:", error);
    alert("Erro ao cadastrar aluno. Tente novamente.");
  } finally {
    setStudentName("");
    setStudentsAge("");
    setstudentsEmail("");
    setStudentsClass("");
   
  }
};


  return (
     <div style={styles.container}>
      <Header />
      <main style={styles.content}>

        <div style={styles.formContainer}>
        <h1 style={styles.title}>Adicionar Aluno</h1>
          <div style={styles.form}>
            <input
              type="text"
              placeholder="Nome do Aluno"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              style={{
                ...styles.input,
                ...(focusedInput === "name" ? styles.inputFocus : {}),
              }}
              onFocus={() => setFocusedInput("name")}
              onBlur={() => setFocusedInput(null)}
            />

            <input
              type="text"
              placeholder="E-mail do Aluno"
              value={studentsEmail}
              onChange={(e) => setstudentsEmail(e.target.value)}
              style={{
                ...styles.input,
                ...(focusedInput === "name" ? styles.inputFocus : {}),
              }}
              onFocus={() => setFocusedInput("name")}
              onBlur={() => setFocusedInput(null)}
            />

            <input
              type="number"
              placeholder="Idade do Aluno"
              value={studentsAge}
              onChange={(e) => setStudentsAge(e.target.value)}
              style={{
                ...styles.input,
                ...(focusedInput === "age" ? styles.inputFocus : {}),
              }}
              onFocus={() => setFocusedInput("age")}
              onBlur={() => setFocusedInput(null)}
            />

            <select
              value={studentsClass}
              onChange={(e) => setStudentsClass(e.target.value)}
              style={{
                ...styles.select,
                ...(focusedInput === "class" ? styles.inputFocus : {}),
              }}
              onFocus={() => setFocusedInput("class")}
              onBlur={() => setFocusedInput(null)}
            >
              <option value="">Selecione a Turma</option>
              {classes.map((turma) => (
                <option key={turma.id} value={turma.nome}>
                  {turma.nome}
                </option>
              ))}
            </select>

            <button
              onClick={handleAddStudent}
              style={hoverButton ? { ...styles.button, ...styles.buttonHover } : styles.button}
              onMouseEnter={() => setHoverButton(true)}
              onMouseLeave={() => setHoverButton(false)}
            >
              Adicionar Aluno
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

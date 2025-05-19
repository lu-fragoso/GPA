import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import materias from "../data/materias.json";


export default function AddAlunoPage() {
  
 const [studentName, setStudentName] = useState("");
 const [studentsAge, setStudentsAge] = useState("");
 const [studentsClass, setStudentsClass] = useState("");
 const [classes, setClasses] = useState([]); // estado para armazenar as turmas
 const navigate = useNavigate();

  useEffect(() => {
    handlegetData();
  }, []);
  
  const handlegetData = () => {
    setClasses(materias);
  }

  const handleAddStudent = () => {
    // Aqui futuramente você insere no banco Cassandra via API
    if (studentName.trim() === "") {
        alert("Nome do aluno não pode estar vazio!");
    }
    if (studentsAge === "") {
      alert("Idade do aluno não pode estar vazia!");
      return;
    }

        if (studentsClass === "") {
      alert("Selecione uma turma!");
      return;
    }
    console.log("Novo aluno:", { studentName, studentPassword });

    // Após cadastrar, volta para AdminPage
    navigate("/admin");
  };

  return (
    
    <div>
        <Header />
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Adicionar Aluno</h1>
            <div className="flex flex-col gap-4">
            <input
                type="text"
                placeholder="Nome do Aluno"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="border rounded p-2"
            />
            <input
                type="number"
                placeholder="Idade do Aluno"
                value={studentsAge}
                onChange={(e) => setStudentsAge(e.target.value)}
                className="border rounded p-2"
            />
            <select
            value={studentsClass}
            onChange={(e) => setStudentsClass(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Selecione a Turma</option>
            {classes.map((turma) => (
              <option key={turma.id} value={turma.nome}>
                {turma.name}
              </option>
            ))}
          </select>
            <button
                onClick={handleAddStudent}
                className="bg-blue-500 text-white px-3 py-1 rounded"
            >
                Adicionar Aluno
            </button>
            </div>
        </div>
        <Footer />
    </div>
  );
}

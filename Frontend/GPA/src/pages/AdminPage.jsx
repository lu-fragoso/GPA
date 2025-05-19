import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import materias from "../data/materias.json";
import alunos from "../data/alunos.json";


export default function AdminPage() {

  const [students, setStudents] = useState([]);
  const [materiasList, setMateriasList] = useState([]);

  

  const navigate = useNavigate();

  useEffect(() => {
  handlegetData();
}, []);

  const handlegetData = () => {
  setMateriasList(materias);
  setStudents(alunos);
  }

  return (
    <div>
      <Header />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Página Administrativa</h1>

        {/* Container flex para Alunos e Matérias */}
        <div className="flex gap-8">
          {/* Div Matérias */}
          <div className="flex-1 border rounded-lg p-4 shadow">
            <h2 className="text-2xl font-semibold mb-4">Matérias</h2>
            <ul className="border rounded p-4 min-h-[300px]">
              {materiasList.map((materia) => (
                <li
                  key={materia.id}
                  className="flex justify-between items-center mb-2 cursor-pointer"
                  onClick={() => navigate(`/admin/materia/${materia.id}`)}
                >
                  <span>{materia.nome}</span>
                </li>
              ))}
            </ul>

            <button
                onClick={() => navigate("/admin/add-materia")}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                + Nova Matéria
              </button>
          </div>

          {/* Div Alunos */}
          <div className="flex-1 border rounded-lg p-4 shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Alunos</h2>          

            </div>
            <ul className="border rounded p-4 min-h-[300px]">
              {students.map((student) => (
                <li
                  key={student.id}
                  className="flex justify-between items-center mb-2 cursor-pointer"
                  onClick={() => navigate(`/admin/aluno/${student.id}`)}
                >
                  <span>{student.nome}</span>
                </li>
              ))}
            </ul>
           <button
                onClick={() => navigate("/admin/add-aluno")}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                + Novo aluno
              </button>
              </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

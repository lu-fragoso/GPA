import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import alunos from "../data/alunos.json";
import progresso from "../data/progresso.json";
import materias from "../data/materias.json";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AlunoPage() {
  const { id } = useParams();
  const [aluno, setAluno] = useState(null);
  const [materiasDoAluno, setMateriasDoAluno] = useState([]);

 useEffect(() => {
    const alunoEncontrado = alunos.find((a) => a.id === id);
    setAluno(alunoEncontrado);

    if (alunoEncontrado) {
      const materiasEncontradas = materias
        .filter((m) => alunoEncontrado.turma.includes(m.id))
        .map((materia) => {
          // Buscar progresso correspondente
          const nota = progresso.find(
            (p) => p.aluno_id === alunoEncontrado.id && p.curso_id === materia.id
          );
          return {
            ...materia,
            progresso: nota ? nota.progresso : "Sem nota"
          };
        });
      setMateriasDoAluno(materiasEncontradas);
    }
  }, [id]);

  if (!aluno) return <p>Carregando aluno...</p>;

  return (
   <div>
      <Header />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Aluno: {aluno.nome}</h1>
        <p><strong>Email:</strong> {aluno.email}</p>
        <p><strong>Idade:</strong> {aluno.idade}</p>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Matérias e Notas</h2>
          {materiasDoAluno.length === 0 ? (
            <p>Este aluno ainda não está matriculado em nenhuma matéria.</p>
          ) : (
            <ul className="list-disc pl-6">
              {materiasDoAluno.map((materia) => (
                <li key={materia.id}>
                  <strong>{materia.nome}</strong> — Nota: {materia.progresso}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </div>
    
  );
}

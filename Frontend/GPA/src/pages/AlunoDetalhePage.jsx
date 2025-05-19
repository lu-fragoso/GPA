import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import alunos from "../data/alunos.json";
import materias from "../data/materias.json";
import { useState } from "react";

export default function AlunoDetalhePage() {
  const { id } = useParams();
  const aluno = alunos.find((a) => a.id === id);

  const [notas, setNotas] = useState({});
  const [inputs, setInputs] = useState({});

  if (!aluno) {
    return <div>Aluno não encontrado.</div>;
  }

  const materiasDoAluno = materias.filter((materia) =>
    aluno.turma.includes(materia.id)
  );

  const handleInputChange = (materiaId, valor) => {
    setInputs((prev) => ({ ...prev, [materiaId]: valor }));
  };

  const enviarNota = (materiaId) => {
    const nota = Number(inputs[materiaId]);
    if (isNaN(nota) || nota < 0 || nota > 10) {
      alert("Informe uma nota válida entre 0 e 10.");
      return;
    }

    setNotas((prev) => ({ ...prev, [materiaId]: nota }));
    // Opcional: limpar input após envio
    setInputs((prev) => ({ ...prev, [materiaId]: "" }));
  };

  const verificarStatus = (materiaId) => {
    const nota = notas[materiaId];
    if (nota) return "✅ Concluída";
    return "🕒 Em andamento (Sem nota)";
  };

  return (
    <div>
      <Header />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Detalhes do Aluno</h1>
        <p><strong>Nome:</strong> {aluno.nome}</p>
        <p><strong>Idade:</strong> {aluno.idade}</p>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Turmas (Matérias)</h2>
          {materiasDoAluno.length === 0 ? (
            <p>Este aluno ainda não está matriculado em nenhuma matéria.</p>
          ) : (
            <ul className="space-y-2">
              {materiasDoAluno.map((materia) => (
                <li key={materia.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <strong>{materia.nome}</strong> – {materia.nivel}
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={inputs[materia.id] || ""}
                    onChange={(e) => handleInputChange(materia.id, e.target.value)}
                    className="border rounded px-2 py-1 w-16"
                  />
                  <button
                    onClick={() => enviarNota(materia.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Enviar
                  </button>
                  <span>{verificarStatus(materia.id)}</span>
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

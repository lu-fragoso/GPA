import { useState } from "react";
import { alunos as initialAlunos } from "../api/alunosData";
import { materias } from "../api/materiasData";

export default function AlunoList() {
  const [alunos, setAlunos] = useState(initialAlunos);
  const [novoAluno, setNovoAluno] = useState("");

  const adicionarAluno = () => {
    const novo = { id: alunos.length + 1, nome: novoAluno, materias: [] };
    setAlunos([...alunos, novo]);
    setNovoAluno("");
  };

  const adicionarMateriaAoAluno = (idAluno, idMateria) => {
    if (!idMateria) {
      alert("Por favor, selecione uma matéria.");
      return;
    }
    if (alunos.find(aluno => aluno.id === idAluno).materias.includes(idMateria)) {
      alert("Essa matéria já está atribuída a este aluno.");
      return;
    };
    setAlunos(alunos.map(aluno => 
      aluno.id === idAluno
        ? { ...aluno, materias: [...aluno.materias, idMateria] }
        : aluno
    ));
  };

  return (
    <div>
      <h2>Alunos</h2>
      <ul>
        {alunos.map((a) => (
          <li key={a.id}>
            {a.nome} — Matérias: {a.materias.map(id => materias.find(m => m.id === id)?.nome).join(", ")}
            <br />
            <select onChange={(e) => adicionarMateriaAoAluno(a.id, parseInt(e.target.value))}>
              <option>Adicionar matéria</option>
              {materias.map(m => (
                <option key={m.id} value={m.id}>{m.nome}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
      <input
        value={novoAluno}
        onChange={(e) => setNovoAluno(e.target.value)}
        placeholder="Novo aluno"
      />
      <button onClick={adicionarAluno}>Adicionar</button>
    </div>
  );
}

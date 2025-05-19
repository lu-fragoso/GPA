import { useState } from "react";
import { materias as initialMaterias } from "../api/materiasData";

export default function MateriaList() {
  const [materias, setMaterias] = useState(initialMaterias);
  const [novaMateria, setNovaMateria] = useState("");

  const adicionarMateria = () => {
    const nova = { id: materias.length + 1, nome: novaMateria };

     if (!novaMateria) {
      alert("Por favor, insira o nome da matéria.");
      return;
    }
    if (materias.some((m) => m.nome === novaMateria)) {
      alert("Essa matéria já existe.");
      return;
    }
    setMaterias([...materias, nova]);
    setNovaMateria("");
  };

  return (
    <div>
      <h2>Matérias</h2>
      <ul>
        {materias.map((m) => (
          <li key={m.id}>{m.nome}</li>
        ))}
      </ul>
      <input
        value={novaMateria}
        onChange={(e) => setNovaMateria(e.target.value)}
        placeholder="Nova matéria"
      />
      <button onClick={adicionarMateria}>Adicionar</button>
    </div>
  );
}

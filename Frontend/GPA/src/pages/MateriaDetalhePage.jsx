import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import materias from "../data/materias.json";
import modulos from "../data/modulos.json";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function MateriaDetalhePage() {
  const { id } = useParams();
  const materia = materias.find((m) => m.id === id);

  const [modulosDaMateria, setModulosDaMateria] = useState(
    modulos.filter((m) => m.curso_id === id)
  );

  const [novoModulo, setNovoModulo] = useState({
    nome: "",
    descricao: "",
  });

  if (!materia) {
    return <div>Matéria não encontrada.</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoModulo((prev) => ({ ...prev, [name]: value }));
  };

  const adicionarModulo = () => {
    if (novoModulo.nome.trim() === "" || novoModulo.descricao.trim() === "") {
      alert("Preencha todos os campos.");
      return;
    }

    const novo = {
      curso_id: id,
      id: uuidv4(),
      nome: novoModulo.nome,
      descricao: novoModulo.descricao,
    };

    setModulosDaMateria((prev) => [...prev, novo]);

    setNovoModulo({ nome: "", descricao: "" });

    alert("Módulo adicionado com sucesso!");
  };

  return (
    <div>
      <Header />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Detalhes da Matéria</h1>
        <p><strong>Nome:</strong> {materia.nome}</p>
        <p><strong>Descrição:</strong> {materia.descricao}</p>
        <p><strong>Duração:</strong> {materia.duracao} horas</p>
        <p><strong>Nível:</strong> {materia.nivel}</p>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Módulos</h2>
          {modulosDaMateria.length === 0 ? (
            <p>Nenhum módulo cadastrado para essa matéria.</p>
          ) : (
            <ul className="space-y-2">
              {modulosDaMateria.map((modulo) => (
                <li key={modulo.id} className="border p-3 rounded">
                  <strong>{modulo.nome}</strong>
                  <p className="text-sm text-gray-600">{modulo.descricao}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Adicionar Novo Módulo</h2>
          <input
            type="text"
            name="nome"
            placeholder="Nome do módulo"
            value={novoModulo.nome}
            onChange={handleInputChange}
            className="border rounded p-2 w-full mb-2"
          />
          <input
            type="text"
            name="descricao"
            placeholder="Descrição do módulo"
            value={novoModulo.descricao}
            onChange={handleInputChange}
            className="border rounded p-2 w-full mb-2"
          ></input>
          <button
            onClick={adicionarModulo}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Adicionar Módulo
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

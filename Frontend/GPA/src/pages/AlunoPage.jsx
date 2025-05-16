import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAluno, marcarModuloConcluido } from "../api/api";
import ModuloCard from "../components/ModuloCard";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AlunoPage() {
  const { id } = useParams();
  const [aluno, setAluno] = useState(null);

  useEffect(() => {
    getAluno(id).then((response) => setAluno(response.data));
  }, [id]);

  const concluirModulo = (moduloId) => {
    marcarModuloConcluido(id, moduloId).then((response) => {
      alert(response.message);
    });
  };

  if (!aluno) return <p>Carregando aluno...</p>;

  return (
    <div>
      <Header />
      <h1>Aluno: {aluno.nome}</h1>
      <h3>Matérias:</h3>
      {aluno.modulos.map((modulo) => (
        <ModuloCard
          key={modulo.id}
          titulo={modulo.nome}
          onConcluir={() => concluirModulo(modulo.id)}
        />
      ))}
      <Footer />
    </div>
  );
}

import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import materias from "../data/materias.json";
import modulos from "../data/modulos.json";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    padding: 24,
    backgroundColor: "#f9fafb",
    paddingBottom: 100,
  },
  topContainer: {
    display: "flex",
    gap: 32,
    marginBottom: 32,
    flexWrap: "wrap",
  },
  cardMateria: {
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: 24,
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgb(0 0 0 / 0.1)",
    flex: "1 1 300px",
    minWidth: 280,
  },
  cardAddModulo: {
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: 24,
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgb(0 0 0 / 0.1)",
    flex: "1 1 300px",
    minWidth: 280,
  },
  modulosContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
  },
  cardModulo: {
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgb(0 0 0 / 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
  border: "1px solid #d1d5db",
  borderRadius: 6,
  padding: "8px 12px",
  fontSize: 16,
  outline: "none",
  marginBottom: 16, // aumentei de 12 para 16
  boxSizing: "border-box",
},

  button: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s",
  },
};

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
    return <div style={{ padding: 24 }}>Matéria não encontrada.</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoModulo((prev) => ({ ...prev, [name]: value }));
  };

  const adicionarModulo = () => {
    if (!novoModulo.nome || !novoModulo.descricao) {
      alert("Preencha todos os campos para adicionar um módulo.");
      return;
    }

    const novo = {
      id: uuidv4(),
      curso_id: id,
      ...novoModulo,
    };

    setModulosDaMateria((prev) => [...prev, novo]);
    setNovoModulo({ nome: "", descricao: "" });
  };

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.content}>
        <h1 style={{ fontSize: 32, fontWeight: "700", marginBottom: 24 }}>
          Detalhes da Matéria
        </h1>

        <div style={styles.topContainer}>
          <div style={styles.cardMateria}>
            <p style={{ fontSize: 18, marginBottom: 8 }}>
              <strong>Nome:</strong> {materia.nome}
            </p>
            <p style={{ fontSize: 18 }}>
              <strong>Nível:</strong> {materia.nivel}
            </p>
          </div>

          <div style={styles.cardAddModulo}>
            <h2 style={{ fontSize: 22, fontWeight: "700", marginBottom: 16 }}>
              Adicionar Módulo
            </h2>

            <input
              type="text"
              name="nome"
              placeholder="Nome do módulo"
              value={novoModulo.nome}
              onChange={handleInputChange}
              style={styles.input}
            />
            <input
              type="text"
              name="descricao"
              placeholder="Descrição"
              value={novoModulo.descricao}
              onChange={handleInputChange}
              style={styles.input}
            />
            <button onClick={adicionarModulo} style={styles.button}>
              Adicionar
            </button>
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
            Módulos
          </h2>

          {modulosDaMateria.length === 0 ? (
            <p>Esta matéria ainda não possui módulos cadastrados.</p>
          ) : (
            <div style={styles.modulosContainer}>
              {modulosDaMateria.map((modulo) => (
                <div key={modulo.id} style={styles.cardModulo}>
                  <h3 style={{ fontSize: 18, fontWeight: "600" }}>{modulo.nome}</h3>
                  <p style={{ fontSize: 14, color: "#6b7280" }}>
                    {modulo.descricao}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer style={{ position: "fixed", bottom: 0, width: "100%", height: "80px" }} />
    </div>
  );
}

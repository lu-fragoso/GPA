import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import alunos from "../data/alunos.json";
import materias from "../data/materias.json";
import { useState } from "react";
import axios from "axios";

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
  cardAluno: {
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: 24,
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgb(0 0 0 / 0.1)",
    flex: "1 1 300px",
    minWidth: 280,
  },
  cardAddMateria: {
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: 24,
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgb(0 0 0 / 0.1)",
    flex: "1 1 300px",
    minWidth: 280,
  },
  materiasContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
  },
  cardMateria: {
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: 16,
    backgroundColor: "#fff",
    boxShadow: "0 1px 3px rgb(0 0 0 / 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  materiaTitulo: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  materiaNivel: {
    fontSize: 14,
    color: "#6b7280",
  },
  inputNota: {
    border: "1px solid #d1d5db",
    borderRadius: 6,
    padding: "8px 12px",
    width: 80,
    fontSize: 16,
    outline: "none",
    boxSizing: "border-box",
  },
  inputNotaFocus: {
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.4)",
  },
  buttonEnviar: {
    backgroundColor: "#333",
    color: "#fff",
    padding: "8px 16px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s",
  },
  buttonEnviarHover: {
    backgroundColor: "#333",
  },
  statusText: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: "500",
  },
  alunoNaoEncontrado: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    fontSize: 24,
    fontWeight: "700",
  },
  selectMateria: {
    width: "100%",
    padding: "8px 12px",
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #d1d5db",
    outline: "none",
    marginBottom: 16,
  },
};

export default function AlunoDetalhePage() {
 const { id } = useParams();

const [aluno, setAluno] = useState(null);
const [materias, setMaterias] = useState([]);
const [modulos, setModulos] = useState([]);
const [progresso, setProgresso] = useState([]);
const [notas, setNotas] = useState({});
const [inputs, setInputs] = useState({});
const [novaMateriaId, setNovaMateriaId] = useState("");

// Carregar dados
useEffect(() => {
  carregarDados();
}, []);

const carregarDados = async () => {
  try {
    const resAluno = await axios.get(`http://localhost:3000/alunos/${id}`);
    const resMaterias = await axios.get(`http://localhost:3000/materias`);
    const resModulos = await axios.get(`http://localhost:3000/modulos`);
    const resProgresso = await axios.get(`http://localhost:3000/progresso/${id}`);

    setAluno(resAluno.data);
    setMaterias(resMaterias.data);
    setModulos(resModulos.data);
    setProgresso(resProgresso.data);
  } catch (error) {
    console.error("Erro ao carregar dados", error);
  }
};


  if (!aluno) {
    return <div style={styles.alunoNaoEncontrado}>Aluno não encontrado.</div>;
  }

  // Filtra matérias que aluno já tem (usado para mostrar notas e status)
  const materiasDoAluno = materias.filter((materia) => turma.includes(materia.id));

  // Matérias disponíveis para adicionar (não estão na turma)
  const materiasDisponiveis = materias.filter((materia) => !turma.includes(materia.id));

  const handleInputChange = (materiaId, valor) => {
    setInputs((prev) => ({ ...prev, [materiaId]: valor }));
  };

  const enviarNota = async (cursoId) => {
  const nota = Number(inputs[cursoId]);
  if (isNaN(nota) || nota < 0 || nota > 10) {
    alert("Informe uma nota válida entre 0 e 10.");
    return;
  }

  setNotas((prev) => ({ ...prev, [cursoId]: nota }));
  setInputs((prev) => ({ ...prev, [cursoId]: "" }));

  try {
    
    const progressoPayload = {
      aluno_id: aluno.id,
      curso_id: cursoId,
      progresso: nota 
    };

    await axios.post(`http://localhost:3000/progresso`, progressoPayload);

    // Marca todos os módulos daquele curso como concluídos
    const modulosDoCurso = modulos.filter((m) => m.curso_id === cursoId);

    for (const modulo of modulosDoCurso) {
      await axios.post(`http://localhost:3000/progresso_modulos`, {
        aluno_id: aluno.id,
        curso_id: cursoId,
        modulo_id: modulo.id,
        concluido: true,
      });
    }

    alert("Nota registrada e progresso atualizado!");

    // Atualiza dados
    carregarDados();
  } catch (error) {
    console.error("Erro ao registrar nota", error);
  }
};


  const verificarStatus = (materiaId) => {
    const nota = notas[materiaId];
    if (nota !== undefined) return "✅ Concluída";
    return "🕒 Em andamento";
  };

  // Adiciona matéria nova à turma do aluno localmente
  const adicionarMateria = async () => {
  if (!novaMateriaId) {
    alert("Selecione uma matéria para adicionar.");
    return;
  }

  if (turma.includes(novaMateriaId)) {
    alert("Esta matéria já está na turma do aluno.");
    return;
  }

  try {
    // Atualiza curso do aluno
    await axios.put(`http://localhost:3000/alunos/${aluno.id}`, {
      curso: novaMateriaId,
    });

    // Pega os módulos da matéria
    const modulosDaMateria = modulos.filter((m) => m.curso_id === novaMateriaId);

    // Cria progresso inicial para cada módulo
    for (const modulo of modulosDaMateria) {
      await axios.post(`http://localhost:3000/progresso_modulos`, {
        aluno_id: aluno.id,
        curso_id: novaMateriaId,
        modulo_id: modulo.id,
        concluido: false,
      });
    }

    // Atualiza estado local pra refletir a mudança sem precisar reload
    setTurma((prev) => [...prev, novaMateriaId]);
    setNovaMateriaId("");
    alert("Matéria adicionada com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar matéria ao aluno", error);
    alert("Erro ao adicionar matéria.");
  }
};


  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.content}>
        <h1 style={{ fontSize: 32, fontWeight: "700", marginBottom: 24 }}>
          Detalhes do Aluno
        </h1>

        <div style={styles.topContainer}>
          <div style={styles.cardAluno}>
            <p style={{ fontSize: 18, marginBottom: 8 }}>
              <strong>Nome:</strong> {aluno.nome}
            </p>
            <p style={{ fontSize: 18 }}>
              <strong>Idade:</strong> {aluno.idade}
            </p>
            <p style={{ fontSize: 18 }}>
              <strong>Email:</strong> {aluno.email}
            </p>
          </div>

          <div style={styles.cardAddMateria}>
            <h2 style={{ fontSize: 22, fontWeight: "700", marginBottom: 16 }}>
              Adicionar Matéria
            </h2>

            {materiasDisponiveis.length === 0 ? (
              <p>Não há matérias disponíveis para adicionar.</p>
            ) : (
              <>
                <select
                  value={novaMateriaId}
                  onChange={(e) => setNovaMateriaId(e.target.value)}
                  style={styles.selectMateria}
                >
                  <option value="">Selecione uma matéria</option>
                  {materiasDisponiveis.map((materia) => (
                    <option key={materia.id} value={materia.id}>
                      {materia.nome} – {materia.nivel}
                    </option>
                  ))}
                </select>
                <button
                  onClick={adicionarMateria}
                  style={styles.buttonEnviar}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#2563eb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#3b82f6")
                  }
                >
                  Adicionar
                </button>
              </>
            )}
          </div>
        </div>

        <div>
          <h2 style={{ fontSize: 24, fontWeight: "700", marginBottom: 16 }}>
            Turmas (Matérias)
          </h2>

          {materiasDoAluno.length === 0 ? (
            <p>Este aluno ainda não está matriculado em nenhuma matéria.</p>
          ) : (
            <div style={styles.materiasContainer}>
              {materiasDoAluno.map((materia) => (
                <div key={materia.id} style={styles.cardMateria}>
                  <div>
                    <h3 style={styles.materiaTitulo}>{materia.nome}</h3>
                    <p style={styles.materiaNivel}>{materia.nivel}</p>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={inputs[materia.id] || ""}
                      onChange={(e) =>
                        handleInputChange(materia.id, e.target.value)
                      }
                      onFocus={() => setInputFocus(materia.id)}
                      onBlur={() => setInputFocus(null)}
                      style={{
                        ...styles.inputNota,
                        ...(inputFocus === materia.id ? styles.inputNotaFocus : {}),
                      }}
                      placeholder="Nota"
                    />
                    <button
                      onClick={() => enviarNota(materia.id)}
                      style={styles.buttonEnviar}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#2563eb")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#3b82f6")
                      }
                    >
                      Enviar
                    </button>
                  </div>

                  <div style={styles.statusText}>
                    <strong>Status:</strong> {verificarStatus(materia.id)}
                  </div>
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

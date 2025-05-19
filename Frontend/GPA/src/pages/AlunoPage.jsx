import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f9fafb",
  },
  content: {
    flex: 1,
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  card: {
    backgroundColor: "#fff",
    border: "1px solid #d1d5db",
    borderRadius: "10px",
    padding: "32px",
    marginBottom: "32px",
    boxShadow: "0 1px 4px rgb(0 0 0 / 0.1)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "24px",
  },
  subtitle: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
    marginTop: "32px",
  },
  infoText: {
    fontSize: "18px",
    marginBottom: "12px",
  },
  materiasContainerWrapper: {
    overflowX: "auto",       // rolamento horizontal
    paddingBottom: "12px",
    marginTop: "12px",
  },
  materiasContainer: {
    display: "flex",
    gap: "16px",
    minHeight: "140px",       // altura mínima do container para ficar legal
  },
  materiaCard: {
    backgroundColor: "#f3f4f6",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "20px",
    flex: "0 0 220px",       // largura fixa e não encolhe
    boxShadow: "0 1px 3px rgb(0 0 0 / 0.05)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  materiaNome: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "12px",
  },
  notaText: {
    fontSize: "16px",
    color: "#374151",
    fontWeight: "600",
  },
};

export default function AlunoPage() {
  const { id } = useParams();
  const [aluno, setAluno] = useState(null);
  const [materiasDoAluno, setMateriasDoAluno] = useState([]);
  
  const [progresso, setProgresso] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDados() {
      try {
        setLoading(true);
        // Buscar dados do aluno
        const resAluno = await axios.get(`http://localhost:3000/alunos/${id}`);
        setAluno(resAluno.data);

        // Buscar progresso do aluno
        const resProgresso = await axios.get(`http://localhost:3000/progresso/${id}`);
        setProgresso(resProgresso.data);

        // Buscar todos os cursos
        const resCursos = await axios.get("http://localhost:3000/cursos");
        setCursos(resCursos.data);

        setLoading(false);
      } catch (err) {
        setError("Erro ao carregar os dados.");
        setLoading(false);
      }
    }

    fetchDados();
  }, [id]);





  /*useEffect(() => {
    const alunoEncontrado = alunos.find((a) => a.id === id);
    setAluno(alunoEncontrado);

    if (alunoEncontrado) {
      const materiasEncontradas = materias
        .filter((m) => alunoEncontrado.turma.includes(m.id))
        .map((materia) => {
          const nota = progresso.find(
            (p) => p.aluno_id === alunoEncontrado.id && p.curso_id === materia.id
          );
          return {
            ...materia,
            progresso: nota ? nota.progresso : "Sem nota",
          };
        });
      setMateriasDoAluno(materiasEncontradas);
    }
  }, [id]);*/

  //if (!aluno) return <p>Carregando aluno...</p>;
  if (loading) return <p>Carregando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={styles.container}>
      <Header />
      <main style={styles.content}>
        <div style={styles.card}>
          <h1 style={styles.title}>Aluno: {aluno.nome}</h1>
          <p style={styles.infoText}>
            <strong>Email:</strong> {aluno.email}
          </p>
          <p style={styles.infoText}>
            <strong>Idade:</strong> {aluno.idade}
          </p>

          <h2 style={styles.subtitle}>Matérias e Notas</h2>
          {materiasDoAluno.length === 0 ? (
            <p style={styles.infoText}>
              Este aluno ainda não está matriculado em nenhuma matéria.
            </p>
          ) : (
            <div style={styles.materiasContainerWrapper}>
              <div style={styles.materiasContainer}>
                <ul>
                  {progresso.map((p) => {
                    // Encontrar o nome do curso pelo id do curso no progresso
                    const curso = cursos.find((c) => c.id === p.cursoId);
                    return (
                      <li key={p.cursoId}>
                        {curso ? curso.nome : "Curso desconhecido"} - Progresso: {p.status || p.porcentagem || "N/A"}
                      </li>
                    );
                  })}
                </ul>



                
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer style={{ height: "80px" }} />
    </div>
  );
}

/*{materiasDoAluno.map((materia) => (
                  <div key={materia.id} style={styles.materiaCard}>
                    <div style={styles.materiaNome}>{materia.nome}</div>
                    <div style={styles.notaText}>{materia.progresso}</div>
                  </div>
                ))}*/
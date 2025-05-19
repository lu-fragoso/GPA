import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import materias from "../data/materias.json";
import alunos from "../data/alunos.json";


export default function AdminPage() {

  const [students, setStudents] = useState([]);
  const [materiasList, setMateriasList] = useState([]);
  const [materiaFiltro, setMateriaFiltro] = useState("");
  const [alunoFiltro, setAlunoFiltro] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    handlegetData();
  }, []);

  const handlegetData = () => {
    setMateriasList(materias);
    setStudents(alunos);
  };

  const materiasFiltradas = materiasList.filter((materia) =>
    materia.nome.toLowerCase().includes(materiaFiltro.toLowerCase())
  );

  const alunosFiltrados = students.filter((student) =>
    student.nome.toLowerCase().includes(alunoFiltro.toLowerCase())
  );

  return (
    <div className="flex flex-col" style={{ height: "100vh" }}>
  {/* Header */}
  <Header />

  {/* Conteúdo com rolagem central */}
  <div
    className="flex-1"
    style={{
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
      padding: "24px",
      backgroundColor: "#f9fafb",
      paddingBottom: "100px", // reserva espaço pro footer
    }}
  >
    <h1 className="text-3xl font-bold mb-6">Página Administrativa</h1>

    {/* Container horizontal */}
    <div
      className="gap-8"
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "32px",
        flex: 1,
        overflow: "hidden", // impede quebra
      }}
    >
      {/* Matérias */}
      <div
        style={{
          flex: 1,
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 className="text-2xl font-semibold mb-4">Matérias</h2>
        <input
              type="text"
              placeholder="Buscar matéria..."
              value={materiaFiltro}
              onChange={(e) => setMateriaFiltro(e.target.value)}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "8px 12px",
                marginBottom: "12px",
                fontSize: "14px",
                outline: "none",
              }}
            />

            <ul
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "16px",
                height: "100%",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {materiasFiltradas.map((materia) => (
                <li
                  key={materia.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                  onClick={() => navigate(`/admin/materia/${materia.id}`)}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f3f4f6")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <span>{materia.nome}</span>
                </li>
              ))}
            </ul>


        <button
          onClick={() => navigate("/admin/add-materia")}
          style={{
            marginTop: "16px",
            backgroundColor: "#333",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
              textDecoration: "none",
            textAlign: "center",
            width: "100%",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          + Nova Matéria
        </button>
      </div>

      {/* Alunos */}
      <div
        style={{
          flex: 1,
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "16px",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 className="text-2xl font-semibold mb-4">Alunos</h2>
        <input
              type="text"
              placeholder="Buscar aluno..."
              value={alunoFiltro}
              onChange={(e) => setAlunoFiltro(e.target.value)}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "8px 12px",
                marginBottom: "12px",
                fontSize: "14px",
                outline: "none",
              }}
            />

            <ul
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "16px",
                height: "100%",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {alunosFiltrados.map((student) => (
                <li
                  key={student.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                    cursor: "pointer",
                    padding: "8px",
                    borderRadius: "4px",
                  }}
                  onClick={() => navigate(`/admin/aluno/${student.id}`)}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f3f4f6")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <span>{student.nome}</span>
                </li>
              ))}
            </ul>

        <button
          onClick={() => navigate("/admin/add-aluno")}
          style={{
            marginTop: "16px",
            backgroundColor: "#333",
            color: "#fff",
            padding: "8px 12px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
            textDecoration: "none",
            textAlign: "center",
            width: "100%",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          + Novo Aluno
        </button>
      </div>
    </div>
  </div>

  {/* Footer fixo */}
  <Footer style={{ position: "fixed", bottom: 0, width: "100%", height: "80px" }} />
</div>




  );
}

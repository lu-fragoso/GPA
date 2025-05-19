import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AlunoPage from "./pages/AlunoPage";
import AdminPage from "./pages/AdminPage";
import AddAlunoPage from "./pages/AddAlunoPage";
import AddMateriaPage from "./pages/AddMateriaPage";
import AlunoDetalhePage from "./pages/AlunoDetalhePage";
import MateriaDetalhePage from "./pages/MateriaDetalhePage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aluno/:id" element={<AlunoPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/add-aluno" element={<AddAlunoPage />} />
        <Route path="/admin/add-materia" element={<AddMateriaPage />} />
        <Route path="/admin/aluno/:id" element={<AlunoDetalhePage />} />
        <Route path="/admin/materia/:id" element={<MateriaDetalhePage />} />
      </Routes>
    </Router>
  );
}

export default App;

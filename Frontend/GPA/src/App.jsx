import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AlunoPage from "./pages/AlunoPage";
import AdminPage from "./pages/AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/aluno/:id" element={<AlunoPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;

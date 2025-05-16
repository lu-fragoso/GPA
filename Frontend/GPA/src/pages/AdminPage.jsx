import Header from "../components/Header";
import Footer from "../components/Footer";
import AlunoList from "../components/AlunoList";
import MateriaList from "../components/MateriaList";

export default function AdminPage() {
  return (
    <div>
      <Header />
      <h1>Página Administrativa</h1>
      <MateriaList />
      <AlunoList />
      <Footer />
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";

export default function AddMateriaPage() {
  
 const [className, setClassName] = useState("");
 const [classDescription, setClassDescription] = useState("");
 const [classTime, setClassTime] = useState("");
 const [classLevel, setClassLevel] = useState("");
 const navigate = useNavigate();

  const handleAddClass = () => {
    // Aqui futuramente você insere no banco Cassandra via API
    if (className.trim() === "") {
        alert("Nome da matéria não pode estar vazio!");
    }
    if (classDescription.trim() === "") {
        alert("Descrição da matéria não pode estar vazia!");
        return;
    }
    if (classTime.trim() === "") {
        alert("Duração da matéria não pode estar vazia!");
        return;
    }
    if (classLevel.trim() === "") {
        alert("Nível da matéria não pode estar vazio!");
        return;
    }
    console.log("Nova matéria:", { className, classDescription, classTime, classLevel });
    // Aqui você pode fazer uma requisição para a API para adicionar a matéria    

    // Após cadastrar, volta para AdminPage
    navigate("/admin");
  };

  return (
    
    <div>
        <Header />
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Adicionar matéria</h1>
            <div className="flex flex-col gap-4">
            <input
                type="text"
                placeholder="Nome do matéria"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="border rounded p-2"
            />
            <input
                type="text"
                placeholder="Descrição do matéria"
                value={classDescription}
                onChange={(e) => setClassDescription(e.target.value)}
                className="border rounded p-2"
            />
            <input
                type="number"
                placeholder="Duração do matéria (minutos)" 
                value={classTime}
                onChange={(e) => setClassTime(e.target.value)}
                className="border rounded p-2"
            />
            <input
                type="text"
                placeholder="Nível"
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="border rounded p-2"
            />
            
            <button
                onClick={handleAddClass}
                className="bg-blue-500 text-white px-3 py-1 rounded"
            >
                Adicionar Matéria
            </button>
            </div>
        </div>
        <Footer />
    </div>
  );
}

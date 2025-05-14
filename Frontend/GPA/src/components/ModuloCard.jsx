export default function ModuloCard({ titulo, descricao, onConcluir }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
      <h2>{titulo}</h2>
      <p>{descricao}</p>
      <button onClick={onConcluir}>Concluir</button>
    </div>
  );
}

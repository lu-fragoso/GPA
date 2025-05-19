// Aqui futuramente você troca pelos endpoints da sua API real.
import alunos from '../data/alunos.json';

export const getAluno = (id) => {
  return new Promise((resolve) => {
    const aluno = alunos.find((a) => a.id === parseInt(id));
    resolve({ data: aluno });
  });
};

export const marcarModuloConcluido = (alunoId, moduloId) => {
  return new Promise((resolve) => {
    console.log(`Aluno ${alunoId} concluiu módulo ${moduloId}`);
    resolve({ message: 'Módulo concluído!' });
  });
};

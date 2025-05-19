import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

// Alunos
export const getAlunos = async () => {
  const response = await api.get('/alunos');
  return response.data;
};

export const getAlunoById = async (id) => {
  const response = await api.get(`/alunos/${id}`);
  return response.data;
};

export const createAluno = async (aluno) => {
  const response = await api.post('/alunos', aluno);
  return response.data;
};

export const updateAluno = async (id, aluno) => {
  const response = await api.put(`/alunos/${id}`, aluno);
  return response.data;
};

export const deleteAluno = async (id) => {
  const response = await api.delete(`/alunos/${id}`);
  return response.data;
};

// Cursos
export const getCursos = async () => {
  const response = await api.get('/cursos');
  return response.data;
};

export const getCursoById = async (id) => {
  const response = await api.get(`/cursos/${id}`);
  return response.data;
};

export const createCurso = async (curso) => {
  const response = await api.post('/cursos', curso);
  return response.data;
};

// Módulos
export const getModulos = async () => {
  const response = await api.get('/modulos');
  return response.data;
};

export const getModulosByCursoId = async (curso_id) => {
  const response = await api.get(`/modulos/${curso_id}`);
  return response.data;
};

export const createModulo = async (modulo) => {
  const response = await api.post('/modulos', modulo);
  return response.data;
};

// Progresso
export const getProgressoByAlunoId = async (aluno_id) => {
  const response = await api.get(`/alunos/${aluno_id}/progresso`);
  return response.data;
};

export const postProgresso = async (progresso) => {
  const response = await api.post('/progresso', progresso);
  return response.data;
};

export const marcarModuloConcluido = async (aluno_id, curso_id, modulo_id) => {
  const response = await api.patch(`/alunos/${aluno_id}/modulos`, { curso_id, modulo_id });
  return response.data;
};

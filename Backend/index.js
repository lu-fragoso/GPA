const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const cassandraClient = require('./CassandraClient');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

function isValidUUID(uuid) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

cassandraClient.connect()
  .then(() => console.log('✅ Conectado ao Cassandra'))
  .catch(err => console.error('❌ Erro ao conectar ao Cassandra', err));

app.get('/', (req, res) => {
  res.send('API rodando!');
});

app.get('/alunos/inativos', async (req, res) => {
  try {
    const alunosResult = await cassandraClient.execute('SELECT * FROM alunos');
    const alunos = alunosResult.rows;

    const progressoResult = await cassandraClient.execute('SELECT aluno_id FROM progresso');
    const alunosComProgresso = new Set();

    for (const p of progressoResult.rows) {
      if (p.aluno_id) {
        alunosComProgresso.add(p.aluno_id.toString());
      }
    }

    const inativos = alunos.filter(aluno => aluno.id && !alunosComProgresso.has(aluno.id.toString()));
    res.json(inativos);
  } catch (error) {
    console.error('Erro ao buscar alunos inativos:', error);
    res.status(500).send('Erro ao buscar aluno');
  }
});

app.get('/alunos', async (req, res) => {
  try {
    const result = await cassandraClient.execute('SELECT * FROM alunos');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar alunos');
  }
});

app.get('/alunos/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidUUID(id)) return res.status(400).send('ID inválido');
  try {
    const result = await cassandraClient.execute('SELECT * FROM alunos WHERE id = ?', [id], { prepare: true });
    if (result.rowLength === 0) return res.status(404).send('Aluno não encontrado');
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar aluno');
  }
});

app.post('/alunos', async (req, res) => {
  const { nome, email, curso, idade } = req.body;
  const id = uuidv4();
  try {
    await cassandraClient.execute(
      'INSERT INTO alunos (id, nome, email, curso, idade) VALUES (?, ?, ?, ?, ?)',
      [id, nome, email, curso, idade],
      { prepare: true }
    );
    res.status(201).json({ id, nome, email, curso, idade });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao adicionar aluno');
  }
});

app.put('/alunos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, curso, idade } = req.body;
  if (!isValidUUID(id)) return res.status(400).send('ID inválido');
  try {
    await cassandraClient.execute(
      'UPDATE alunos SET nome = ?, email = ?, curso = ?, idade = ? WHERE id = ?',
      [nome, email, curso, idade, id],
      { prepare: true }
    );
    res.send('Aluno atualizado com sucesso');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao atualizar aluno');
  }
});

app.delete('/alunos/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidUUID(id)) return res.status(400).send('ID inválido');
  try {
    await cassandraClient.execute('DELETE FROM alunos WHERE id = ?', [id], { prepare: true });
    res.send('Aluno deletado com sucesso');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao deletar aluno');
  }
});

app.get('/progresso', async (req, res) => {
  try {
    const result = await cassandraClient.execute('SELECT * FROM progresso');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar progresso');
  }
});

app.get('/alunos/:id/progresso', async (req, res) => {
  const { id } = req.params;
  if (!isValidUUID(id)) return res.status(400).send('ID inválido');
  try {
    const result = await cassandraClient.execute(
      'SELECT * FROM progresso WHERE aluno_id = ?',
      [id],
      { prepare: true }
    );
    if (result.rowLength === 0) return res.status(404).send('Progresso não encontrado para este aluno');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar progresso do aluno');
  }
});

app.post('/progresso', async (req, res) => {
  const { aluno_id, curso_id, progresso } = req.body;
  if (!isValidUUID(aluno_id) || !isValidUUID(curso_id)) return res.status(400).send('IDs inválidos');
  try {
    await cassandraClient.execute(
      'INSERT INTO progresso (aluno_id, curso_id, progresso) VALUES (?, ?, ?)',
      [aluno_id, curso_id, progresso],
      { prepare: true }
    );
    res.status(201).send('Progresso registrado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao registrar progresso');
  }
});

app.patch('/alunos/:id/modulos', async (req, res) => {
  const aluno_id = req.params.id;
  const { curso_id, modulo_id } = req.body;
  if (!isValidUUID(aluno_id) || !isValidUUID(curso_id) || !isValidUUID(modulo_id)) return res.status(400).send('IDs inválidos');
  try {
    await cassandraClient.execute(
      'INSERT INTO progresso_modulos (aluno_id, curso_id, modulo_id, concluido) VALUES (?, ?, ?, true)',
      [aluno_id, curso_id, modulo_id],
      { prepare: true }
    );
    res.send('Módulo marcado como concluído');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao registrar progresso');
  }
});

app.get('/cursos', async (req, res) => {
  try {
    const result = await cassandraClient.execute('SELECT * FROM cursos');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar cursos');
  }
});

app.post('/cursos', async (req, res) => {
  const { nome, descricao, duracao, nivel } = req.body;
  const id = uuidv4();
  try {
    await cassandraClient.execute(
      'INSERT INTO cursos (id, nome, descricao, duracao, nivel) VALUES (?, ?, ?, ?, ?)',
      [id, nome, descricao, duracao, nivel],
      { prepare: true }
    );
    res.status(201).send({ id, nome, descricao, duracao, nivel });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao inserir curso');
  }
});

app.get('/cursos/:id', async (req, res) => {
  const { id } = req.params;
  if (!isValidUUID(id)) return res.status(400).send('ID inválido');
  try {
    const result = await cassandraClient.execute('SELECT * FROM cursos WHERE id = ?', [id], { prepare: true });
    if (result.rowLength === 0) return res.status(404).send('Curso não encontrado');
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar curso');
  }
});

app.get('/modulos', async (req, res) => {
  try {
    const result = await cassandraClient.execute('SELECT * FROM modulos');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar módulos');
  }
});

app.get('/modulos/:curso_id', async (req, res) => {
  const { curso_id } = req.params;
  if (!isValidUUID(curso_id)) return res.status(400).send('ID inválido');
  try {
    const result = await cassandraClient.execute('SELECT * FROM modulos WHERE curso_id = ?', [curso_id], { prepare: true });
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar módulos');
  }
});

app.post('/modulos', async (req, res) => {
  const { curso_id, nome, descricao } = req.body;
  const id = uuidv4();
  if (!isValidUUID(curso_id)) return res.status(400).send('ID inválido');
  try {
    await cassandraClient.execute(
      'INSERT INTO modulos (id, curso_id, nome, descricao) VALUES (?, ?, ?, ?)',
      [id, curso_id, nome, descricao],
      { prepare: true }
    );
    res.status(201).json({ id, curso_id, nome, descricao });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao criar módulo');
  }
});

app.get('/alunos/modulo/:nome', async (req, res) => {
  const { nome } = req.params;
  try {
    const modulosResult = await cassandraClient.execute(
      'SELECT id FROM modulos WHERE nome = ? ALLOW FILTERING',
      [nome],
      { prepare: true }
    );
    if (modulosResult.rowLength === 0) return res.status(404).send('Módulo não encontrado');
    const modulo_id = modulosResult.rows[0].id;

    const progressoResult = await cassandraClient.execute(
      'SELECT aluno_id FROM progresso_modulos WHERE modulo_id = ? AND concluido = true ALLOW FILTERING',
      [modulo_id],
      { prepare: true }
    );

    if (progressoResult.rowLength === 0) return res.json([]);

    const aluno_ids = progressoResult.rows.map(row => row.aluno_id);
    const alunos = [];

    for (const id of aluno_ids) {
      const alunoResult = await cassandraClient.execute('SELECT * FROM alunos WHERE id = ?', [id], { prepare: true });
      if (alunoResult.rowLength > 0) alunos.push(alunoResult.rows[0]);
    }

    res.json(alunos);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno');
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});

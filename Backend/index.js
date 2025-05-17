// index.js
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const cassandraClient = require('./CassandraClient');


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Função para validar UUID no formato padrão
function isValidUUID(uuid) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

// Conectar ao Cassandra
cassandraClient.connect()
  .then(() => console.log('✅ Conectado ao Cassandra'))
  .catch(err => console.error('❌ Erro ao conectar ao Cassandra', err));

// ——— ROTAS ———
app.get('/', (req, res) => {
  res.send('API rodando!');
});

// Rota para listar alunos inativos (deve vir ANTES da rota /alunos/:id)
app.get('/alunos/inativos', async (req, res) => {
  try {
    const alunosResult = await client.execute('SELECT * FROM alunos');
    const alunos = alunosResult.rows;

    const progressoResult = await client.execute('SELECT aluno_id FROM progresso');
    const alunosComProgresso = new Set();

    for (const p of progressoResult.rows) {
      if (p.aluno_id) {
        alunosComProgresso.add(p.aluno_id.toString());
      } else {
        console.warn('Progresso com aluno_id nulo:', p);
      }
    }

    const inativos = alunos.filter(aluno => {
      if (!aluno.id) {
        console.warn('Aluno com id nulo:', aluno);
        return false;
      }
      return !alunosComProgresso.has(aluno.id.toString());
    });

    res.json(inativos);
  } catch (error) {
    console.error('Erro ao buscar alunos inativos:', error);
    res.status(500).send('Erro ao buscar aluno');
  }
});

// Rota para listar todos os alunos
app.get('/alunos', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM alunos');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar alunos');
  }
});

// Rota para buscar aluno por ID (deve vir DEPOIS da rota /alunos/inativos)
app.get('/alunos/:id', async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return res.status(400).send('ID inválido');
  }

  const query = 'SELECT * FROM alunos WHERE id = ?';

  try {
    const result = await client.execute(query, [id], { prepare: true });
    if (result.rowLength === 0) return res.status(404).send('Aluno não encontrado');
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar aluno');
  }
});

// Rota para adicionar um novo aluno
app.post('/alunos', async (req, res) => {
  const { nome, email, curso, idade } = req.body;
  const id = uuidv4();

  const query = 'INSERT INTO alunos (id, nome, email, curso, idade) VALUES (?, ?, ?, ?, ?)';
  const params = [id, nome, email, curso, idade];

  try {
    await client.execute(query, params, { prepare: true });
    res.status(201).json({ id, nome, email, curso, idade });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao adicionar aluno');
  }
});

// Rota para atualizar aluno por ID
app.put('/alunos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, curso, idade } = req.body;

  if (!isValidUUID(id)) {
    return res.status(400).send('ID inválido');
  }

  const query = `
    UPDATE alunos
    SET nome = ?, email = ?, curso = ?, idade = ?
    WHERE id = ?
  `;
  const params = [nome, email, curso, idade, id];

  try {
    await client.execute(query, params, { prepare: true });
    res.send('Aluno atualizado com sucesso');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao atualizar aluno');
  }
});

// Rota para deletar aluno por ID
app.delete('/alunos/:id', async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return res.status(400).send('ID inválido');
  }

  const query = 'DELETE FROM alunos WHERE id = ?';

  try {
    await client.execute(query, [id], { prepare: true });
    res.send('Aluno deletado com sucesso');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao deletar aluno');
  }
});

// Rota para listar todo o progresso de todos os alunos
app.get('/progresso', async (req, res) => {
  const query = 'SELECT * FROM progresso';

  try {
    const result = await client.execute(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    res.status(500).send('Erro ao buscar progresso');
  }
});

// Rota para obter progresso do aluno
app.get('/alunos/:id/progresso', async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return res.status(400).send('ID inválido');
  }

  const query = 'SELECT * FROM progresso WHERE aluno_id = ?';

  try {
    const result = await client.execute(query, [id], { prepare: true });
    if (result.rowLength === 0) {
      return res.status(404).send('Progresso não encontrado para este aluno');
    }
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar progresso do aluno');
  }
});

// Rota para registrar progresso do aluno
app.post('/progresso', async (req, res) => {
  const { aluno_id, curso_id, progresso } = req.body;

  if (!isValidUUID(aluno_id) || !isValidUUID(curso_id)) {
    return res.status(400).send('IDs inválidos');
  }

  const query = `
    INSERT INTO progresso (aluno_id, curso_id, progresso)
    VALUES (?, ?, ?)
  `;

  try {
    await client.execute(query, [aluno_id, curso_id, progresso], { prepare: true });
    res.status(201).send('Progresso registrado');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao registrar progresso');
  }
});

// Rota para marcar módulo como concluído para um aluno
app.patch('/alunos/:id/modulos', async (req, res) => {
  const aluno_id = req.params.id;
  const { curso_id, modulo_id } = req.body;

  if (!isValidUUID(aluno_id) || !isValidUUID(curso_id) || !isValidUUID(modulo_id)) {
    return res.status(400).send('IDs inválidos');
  }

  if (!curso_id || !modulo_id) {
    return res.status(400).send('curso_id e modulo_id são obrigatórios');
  }

  const query = `
    INSERT INTO progresso_modulos (aluno_id, curso_id, modulo_id, concluido)
    VALUES (?, ?, ?, true)
  `;

  try {
    await client.execute(query, [aluno_id, curso_id, modulo_id], { prepare: true });
    res.send('Módulo marcado como concluído');
  } catch (error) {
    console.error('Erro ao registrar progresso do módulo:', error);
    res.status(500).send('Erro ao registrar progresso');
  }
});

// Listar cursos
app.get('/cursos', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM cursos');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar cursos');
  }
});

// Criar curso
app.post('/cursos', async (req, res) => {
  const { nome, descricao, duracao, nivel } = req.body;
  const id = uuidv4();

  try {
    await client.execute(
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

// Rota para buscar curso por ID
app.get('/cursos/:id', async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return res.status(400).send('ID inválido');
  }

  const query = 'SELECT * FROM cursos WHERE id = ?';

  try {
    const result = await client.execute(query, [id], { prepare: true });
    if (result.rowLength === 0) {
      return res.status(404).send('Curso não encontrado');
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar curso:', error);
    res.status(500).send('Erro ao buscar curso');
  }
});

// Rota para listar todos os módulos
app.get('/modulos', async (req, res) => {
  try {
    const result = await client.execute('SELECT * FROM modulos');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar módulos:', error);
    res.status(500).send('Erro ao buscar módulos');
  }
});

// Rota para listar módulos de um curso
app.get('/modulos/:curso_id', async (req, res) => {
  const { curso_id } = req.params;

  if (!isValidUUID(curso_id)) {
    return res.status(400).send('ID inválido');
  }

  try {
    const result = await client.execute('SELECT * FROM modulos WHERE curso_id = ?', [curso_id], { prepare: true });
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao buscar módulos');
  }
});

// Rota para criar módulo
app.post('/modulos', async (req, res) => {
  const { curso_id, nome, descricao } = req.body;
  const id = uuidv4();

  if (!isValidUUID(curso_id)) {
    return res.status(400).send('ID inválido');
  }

  try {
    await client.execute(
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

// Rota para listar alunos que concluíram um módulo pelo nome
app.get('/alunos/modulo/:nome', async (req, res) => {
  const { nome } = req.params;

  try {
    // Buscar módulo pelo nome
    const modulosResult = await client.execute(
      'SELECT id FROM modulos WHERE nome = ? ALLOW FILTERING',
      [nome],
      { prepare: true }
    );

    if (modulosResult.rowLength === 0) {
      return res.status(404).send('Módulo não encontrado');
    }

    const modulo_id = modulosResult.rows[0].id;

    // Buscar progresso dos alunos que concluíram esse módulo
    const progressoResult = await client.execute(
      'SELECT aluno_id FROM progresso_modulos WHERE modulo_id = ? AND concluido = true ALLOW FILTERING',
      [modulo_id],
      { prepare: true }
    );

    if (progressoResult.rowLength === 0) {
      return res.json([]); // Ninguém concluiu
    }

    const aluno_ids = progressoResult.rows.map(row => row.aluno_id);

    // Buscar dados dos alunos
    const alunos = [];
    for (const id of aluno_ids) {
      const alunoResult = await client.execute('SELECT * FROM alunos WHERE id = ?', [id], { prepare: true });
      if (alunoResult.rowLength > 0) {
        alunos.push(alunoResult.rows[0]);
      }
    }

    res.json(alunos);
  } catch (error) {
    console.error('Erro ao buscar alunos que concluíram o módulo:', error);
    res.status(500).send('Erro interno');
  }
});


// Start servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});

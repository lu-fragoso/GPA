// index.js
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const client = require('./GPA/Backend/CassandraClient');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Conectar ao Cassandra
client.connect()
  .then(() => console.log('✅ Conectado ao Cassandra'))
  .catch(err => console.error('❌ Erro ao conectar ao Cassandra', err));

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

// Rota para buscar aluno por ID
app.get('/alunos/:id', async (req, res) => {
  const { id } = req.params;
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

// Rota para atualizar aluno por ID
app.put('/alunos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, email, curso, idade } = req.body;

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
  const query = 'DELETE FROM alunos WHERE id = ?';

  try {
    await client.execute(query, [id], { prepare: true });
    res.send('Aluno deletado com sucesso');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao deletar aluno');
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
  const { nome, descricao, duracao, nivel } = req.body;  // adiciona nivel aqui
  const id = uuidv4();

  try {
    await client.execute(
      'INSERT INTO cursos (id, nome, descricao, duracao, nivel) VALUES (?, ?, ?, ?, ?)',
      [id, nome, descricao, duracao, nivel],  // passa nivel no array
      { prepare: true }
    );
    res.status(201).send({ id, nome, descricao, duracao, nivel });  // retorna nivel
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao inserir curso');
  }
});


// Start servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});

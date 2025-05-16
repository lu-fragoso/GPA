// createKeyspace.js
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1'
  // Sem keyspace aqui, pois ainda vamos criar
});

const setup = async () => {
  try {
    await client.connect();

    const createKeyspaceQuery = `
      CREATE KEYSPACE IF NOT EXISTS escola
      WITH replication = {
        'class': 'SimpleStrategy',
        'replication_factor': 1
      };
    `;

    const createAlunosTableQuery = `
      CREATE TABLE IF NOT EXISTS escola.alunos (
        id UUID PRIMARY KEY,
        nome TEXT,
        email TEXT,
        curso TEXT,
        idade INT
      );
    `;

     const createCursosTableQuery = `
      CREATE TABLE IF NOT EXISTS escola.cursos (
        id UUID PRIMARY KEY,
        nome TEXT,
        descricao TEXT,
        duracao INT,
        nivel TEXT
      );
    `;

     await client.execute(createKeyspaceQuery);
    console.log('✅ Keyspace "escola" criada.');

    await client.execute(createAlunosTableQuery);
    console.log('✅ Tabela "alunos" criada.');

    await client.execute(createCursosTableQuery);
    console.log('✅ Tabela "cursos" criada.');

  } catch (err) {
    console.error('❌ Erro ao criar keyspace ou tabelas:', err);
  } finally {
    await client.shutdown();
  }
};

setup();

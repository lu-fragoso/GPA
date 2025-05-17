// createKeyspace.js
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
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
        curso UUID,
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

    const createModulosTableQuery = `
      CREATE TABLE IF NOT EXISTS escola.modulos (
        curso_id UUID,
        id UUID,
        nome TEXT,
        descricao TEXT,
        PRIMARY KEY (curso_id, id)
      );
    `;

    const createProgressoTableQuery = `
  CREATE TABLE IF NOT EXISTS escola.progresso (
    aluno_id UUID,
    curso_id UUID,
    progresso INT,
    PRIMARY KEY (aluno_id, curso_id)
  );
`;

const createProgressoModulosTableQuery = `
      CREATE TABLE IF NOT EXISTS escola.progresso_modulos (
        aluno_id UUID,
        curso_id UUID,
        modulo_id UUID,
        concluido BOOLEAN,
        PRIMARY KEY (aluno_id, curso_id, modulo_id)
      );
    `;


     await client.execute(createKeyspaceQuery);
    console.log('✅ Keyspace "escola" criada.');

    await client.execute(createAlunosTableQuery);
    console.log('✅ Tabela "alunos" criada.');

    await client.execute(createCursosTableQuery);
    console.log('✅ Tabela "cursos" criada.');

    await client.execute(createModulosTableQuery);
    console.log('✅ Tabela "modulos" criada.');

    await client.execute(createProgressoTableQuery);
    console.log('✅ Tabela "progresso" criada.');

    await client.execute(createProgressoModulosTableQuery);
    console.log('✅ Tabela "progresso_modulos" criada.');    

  } catch (err) {
    console.error('❌ Erro ao criar keyspace ou tabelas:', err);
  } finally {
    await client.shutdown();    
  }

    
};

setup();

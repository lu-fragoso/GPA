// cassandraClient.js
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({
  contactPoints: ['127.0.0.1'],
  localDataCenter: 'datacenter1',
  keyspace: 'escola' // ← já aponta para o keyspace que foi criado
});

module.exports = client;

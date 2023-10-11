import knex from 'knex';
import knexFile from '../knexfile.js';

const db = knex(knexFile);

export default db;


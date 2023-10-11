// Update with your config settings.
import 'dotenv/config';
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default  {

  client: 'mysql2',
  connection: {
    database: process.env.DB_DATABASE,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
    }
}



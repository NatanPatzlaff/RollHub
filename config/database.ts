// filepath: c:\Users\User\OneDrive\RollHub-main\config\database.ts
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
  connection: 'sqlite',
  connections: {
    sqlite: {
      client: 'sqlite3',
      connection: {
        filename: './database.sqlite',
      },
      useNullAsDefault: true,
      pool: {
        afterCreate: (conn: any, done: Function) => {
          conn.run('PRAGMA journal_mode=WAL;', () => {
            conn.run('PRAGMA foreign_keys = ON;', done)
          })
        },
      },
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Local dev: file:./dev.db  |  Turso: libsql://your-db.turso.io
    url: env('DATABASE_URL'),
  },
});

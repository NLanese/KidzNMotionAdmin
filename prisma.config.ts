import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    provider: 'mysql',
    url: process.env.DATABASE_URL,
  },
});

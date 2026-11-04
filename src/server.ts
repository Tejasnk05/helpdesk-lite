import { app } from './app';
import { env } from './config/env';
import { db } from './db/knex';

const server = app.listen(env.PORT, () => {
  console.log(`Helpdesk Lite API listening on http://localhost:${env.PORT}`);
});

function shutdown() {
  server.close(async () => {
    await db.destroy();
    process.exit(0);
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
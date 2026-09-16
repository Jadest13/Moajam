import 'reflect-metadata';
import { createApplication } from './app.js';

async function bootstrap() {
  const app = await createApplication();
  const port = Number(process.env.PORT ?? 3000);

  await app.listen(port, '0.0.0.0');
}

void bootstrap();

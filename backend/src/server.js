import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectToDatabase } from './infrastructure/database/mongoose.js';

await connectToDatabase();
const app = createApp();
app.listen(env.PORT, () => {
  console.log(`API listening on http://localhost:${env.PORT}`);
});

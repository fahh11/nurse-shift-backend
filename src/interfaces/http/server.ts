import { buildApp } from '@service/app';

const start = async () => {
  const app = buildApp();

  try {
    await app.listen({
      port: 4000,
      host: "0.0.0.0",
    });

    console.log("🚀 Server running at http://localhost:3000");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

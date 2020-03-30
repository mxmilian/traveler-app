const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

console.clear();
dotenv.config({ path: './config.env' });
const dbConnectUrl = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(dbConnectUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('Connected to the DB 😎');
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`I'am listening on port ${port}🦻`);
});

//Handle all unhandled rejections
process.on('unhandledRejection', error => {
  console.log(`UNHANDLED REJECTION!💥☠️ ️${(error.name, error.message)}`);

  server.close(() => {
    process.exit(1);
  });
});

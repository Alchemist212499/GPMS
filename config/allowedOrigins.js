const allowedOrigins = [
  //"https://www.google.com",
  `http://127.0.0.1:${process.env.PORT}`,
  `http://localhost:${process.env.PORT}`,
  "http://10.249.53.196:8080",
];

module.exports = allowedOrigins;

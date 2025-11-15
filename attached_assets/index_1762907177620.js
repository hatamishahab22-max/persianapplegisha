// Vercel Serverless Function Entry Point
import('../dist/index.js').then(({ default: app }) => {
  module.exports = app;
});

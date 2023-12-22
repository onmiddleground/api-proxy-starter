// esbuild.config.js
require('ts-node').register();

const { build } = require('esbuild');
const { join } = require('path');

build({
  entryPoints: [join(__dirname, 'src', 'lambda.ts')],
  outfile: join(__dirname, 'aws_dist', 'lambda.js'),
  bundle: true,
  platform: 'node',
  target: 'node18',
  external: [
    "@fastify/static",
    "@fastify/view",
    "@nestjs/websockets/socket-module",
    "@nestjs/microservices/microservices-module",
    "@nestjs/microservices",
    "@nestjs/platform-express"
  ],
}).catch(() => process.exit(1));

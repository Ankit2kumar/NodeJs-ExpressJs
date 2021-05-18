import express from 'express';
import authorRouter from './authors/index.js';

const server = express();

const port = 3001;
server.use(express.json());

server.use('/authors', authorRouter);

server.listen(port, () => {
	console.log('Server Started', port);
});

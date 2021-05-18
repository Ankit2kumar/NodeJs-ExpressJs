/*
READ   =>GET https://localhost:3001/authors => returns the list of authors
READ   =>GET https://localhost:3001/authors/123 => returns a single author
CREATE =>POST https://localhost:3001/authors => create a new author
UPDATE =>PUT https://localhost:3001/authors/123 => edit the author with the given id
DELETE =>DELETE https://localhost:3001/authors/123 => delete the author with the given id
*/

import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import uniqid from 'uniqid';

const filePath = fileURLToPath(import.meta.url);
const authorFolderPath = dirname(filePath);
const authorJSONPath = join(authorFolderPath + 'authors.json');

const authorRouter = express.Router();

authorRouter.post('/', (req, res) => {
	const newAuthor = { ...req.body, createdAt: new Date(), _id: uniqid };
	const authors = JSON.parse(fs.readFileSync(authorJSONPath).toString());
	authors.push(newAuthor);
	fs.writeFileSync(authorJSONPath, JSON.stringify(authors));
	res.status(201).send();
});
authorRouter.get('/', (req, res) => {
	const content = fs.readFileSync(authorJSONPath);
	console.log(content.toString());
	const authors = JSON.parse(content.toString());
	res.send(authors);
});
authorRouter.get('/:id', (req, res) => {
	const authors = JSON.parse(fs.readFileSync(authorJSONPath).toString());
	const author = authors.find((a) => a._id === req.params.id);

	res.send(author);
});
authorRouter.put('/:id', (req, res) => {
	const authors = JSON.parse(fs.readFileSync(authorJSONPath).toString());
	const remainingAuthors = authors.filter(
		(author) => author.id !== req.params.id
	);
	const updatedAuthor = { ...req.body, _id: req.params.id };
	remainingAuthors.push(updatedAuthor);
	res.send();
});
authorRouter.delete('/:id', (req, res) => {
	const authors = JSON.parse(fs.readFileSync(authorJSONPath).toString());
	const remainingAuthors = authors.filter(
		(author) => author.id !== req.params.id
	);
	fs.writeFileSync(authorJSONPath, JSON.stringify(remainingAuthors));
	res.status(204).send();
});

export default authorRouter;

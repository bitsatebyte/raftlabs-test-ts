import { Request, Response } from "express";
import express from 'express';
import cors from 'cors';
import { books, findByAuthorEmail, findItemByIsbn, magazines, sortByTitle, authors } from "./services";

const app = express();
app.use(cors());
const port = 3000;

app.get('/authors', async (req: Request, res: Response) => {
  res.send(authors);
});

app.get('/magazines', async (req: Request, res: Response) => {
  res.send(magazines);
});

app.get('/magazines/:authorEmail', async (req: Request, res: Response) => {
  res.send(findByAuthorEmail(req.params.authorEmail, magazines));
});

app.get('/books', async (req: Request, res: Response) => {
  res.send(books);
});

app.get('/books/:isbn', async (req: Request, res: Response) => {
  res.send(findItemByIsbn(req.params.isbn, books));
});

app.get('/books/author/:authorEmail', async (req: Request, res: Response) => {
  res.send(findByAuthorEmail(req.params.authorEmail, books));
});

app.get('/sort', async (req: Request, res: Response) => {
  res.send(sortByTitle(books, magazines));
});

app.listen(port, () => {
  console.log(`Raftlabs app listening at http://localhost:${port}`);
});

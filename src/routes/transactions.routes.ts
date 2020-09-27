import multer from 'multer';
import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import uploadConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(uploadConfig);

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const transactionRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionRepository.find({relations: ["category"]});
  const balance = await transactionRepository.getBalance();

  return response.json({
    transactions,
    balance
  });

});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const { title, value, type, category } = request.body;

  const transactionService = new CreateTransactionService();

  const transaction = await transactionService.execute({
    title,
    value,
    type,
    category
  });

  return response.json(transaction);

});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
  const {id} = request.params;

  const transactionService = new DeleteTransactionService();

  const transaction = await transactionService.execute({id});

  return response.status(204).json(transaction);
});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  // TODO
  // const importTransactionService = new ImportTransactionsService();

  // await importTransactionService.execute({
  //   filename: request.file.filename
  // });
});

export default transactionsRouter;

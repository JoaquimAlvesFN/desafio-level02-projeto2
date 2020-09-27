import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: "income" | "outcome";
  category: string;
}

class CreateTransactionService {
  public async execute({ title, value, type, category }: Request): Promise<Transaction> {
    // TODO
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    let verifyCategoryExists = await categoryRepository.findOne({
      where: {title: category}
    });

    if (!verifyCategoryExists) {
      verifyCategoryExists = await categoryRepository.save({
        title: category
      });
    }

    const totalTransactionIncome = await transactionRepository.find({
      where: {type: 'income'}
    });

    const totalTransaction = totalTransactionIncome.reduce((sum, total) => {
      return sum + total.value;
    }, 0);

    if (type == 'outcome' && value > totalTransaction) {
      throw new AppError('Total of Transaction max limit', 400);
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id: verifyCategoryExists?.id
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { getRepository } from 'typeorm';

import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  filename: string;
}

class ImportTransactionsService {
  async execute({filename}: Request): Promise<Transaction[]> {
    // TODO
    const transactionRepository = getRepository(Transaction);
    const categoryRepository = getRepository(Category);

    const csvFilePath = path.join(uploadConfig.directory, filename);

    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
      delimiter: ';'
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    let transactions: any[] = [];

    parseCSV.on('data', line => {
      transactions.push(line);
      // const csvTransactionFile = transactionRepository.create({
      //   title: line[0],
      //   type: line[1],
      //   value: line[2],
      //   category_id: line[3]
      // });

      // const transaction = await transactionRepository.save(csvTransactionFile);

    });

    console.log(transactions);

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    // return transactions;
  }
}

export default ImportTransactionsService;

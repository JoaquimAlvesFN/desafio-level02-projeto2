import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {

  public async getBalance(): Promise<Balance> {
    // TODO
    const incomeBalance = await this.find({
      where: {type: 'income'}
    });

    const income = incomeBalance.reduce((sum, balance) => {
      return sum + balance.value;
    }, 0);

    const outcomeBalance = await this.find({
      where: {type: 'outcome'}
    });

    const outcome = outcomeBalance.reduce((sum, balance) => {
      return sum + balance.value;
    }, 0);


    const total = income - outcome;

    return {
      income,
      outcome,
      total
    };

  }

}

export default TransactionsRepository;

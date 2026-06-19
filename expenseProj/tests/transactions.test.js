import { calculateTotal, filterTransactions } from '../src/utils/transactions';

describe('calculateTotal', () => {
  const transactions = [
    { amount: 100, type: 'income' },
    { amount: 50, type: 'expense' },
    { amount: 200, type: 'income' },
    { amount: 30, type: 'expense' },
  ];

  it('calculates total income', () => {
    expect(calculateTotal(transactions, 'income')).toBe(300);
  });

  it('calculates total expense', () => {
    expect(calculateTotal(transactions, 'expense')).toBe(80);
  });
});

describe('filterTransactions', () => {
  const transactions = [
    { description: 'Pizza', category: 'food', type: 'expense', amount: 20, date: '2026-04-10', account: 1 },
    { description: 'Bus', category: 'transport', type: 'expense', amount: 5, date: '2026-04-11', account: 2 },
    { description: 'Salary', category: 'salary', type: 'income', amount: 1000, date: '2026-04-01', account: 1 },
  ];

  it('filters by category', () => {
    const filters = { category: 'food', search: '', dateRange: 'all', amountRange: 'all', account: 'all' };
    const result = filterTransactions(transactions, filters);
    expect(result.length).toBe(1);
    expect(result[0].description).toBe('Pizza');
  });

  it('filters by search', () => {
    const filters = { category: 'all', search: 'bus', dateRange: 'all', amountRange: 'all', account: 'all' };
    const result = filterTransactions(transactions, filters);
    expect(result.length).toBe(1);
    expect(result[0].description).toBe('Bus');
  });

  it('filters by account', () => {
    const filters = { category: 'all', search: '', dateRange: 'all', amountRange: 'all', account: '2' };
    const result = filterTransactions(transactions, filters);
    expect(result.length).toBe(1);
    expect(result[0].description).toBe('Bus');
  });
});

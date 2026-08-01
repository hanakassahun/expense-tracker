// Utility functions for calculations and filtering

export function calculateTotal(transactions, type) {
  return transactions
    .filter(t => t.type === type)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);
}

export function filterTransactions(transactions, filters) {
  return transactions.filter(transaction => {
    const matchesCategory = filters.category === 'all' || transaction.category === filters.category;
    const matchesSearch = transaction.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesAccount = filters.account === 'all' || transaction.account === parseInt(filters.account);
    let matchesDateRange = true;
    if (filters.dateRange !== 'all') {
      const transactionDate = new Date(transaction.date);
      const now = new Date();
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      switch (filters.dateRange) {
        case 'week':
          matchesDateRange = transactionDate >= startOfWeek;
          break;
        case 'month':
          matchesDateRange = transactionDate >= startOfMonth;
          break;
        default:
          matchesDateRange = true;
      }
    }
    let matchesAmountRange = true;
    if (filters.amountRange !== 'all') {
      const amount = parseFloat(transaction.amount);
      switch (filters.amountRange) {
        case 'small':
          matchesAmountRange = amount < 50;
          break;
        case 'medium':
          matchesAmountRange = amount >= 50 && amount < 200;
          break;
        case 'large':
          matchesAmountRange = amount >= 200;
          break;
        default:
          matchesAmountRange = true;
      }
    }
    return matchesCategory && matchesSearch && matchesDateRange && matchesAmountRange && matchesAccount;
  });
}

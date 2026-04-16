 
# Expense Tracker Dashboard

A modern finance dashboard for tracking expenses, analyzing spending, and managing budgets. Built with React, Vite, Tailwind CSS, and Recharts.

## Features

- **Add, edit, and delete transactions** with categories, accounts, and recurring options
- **Multi-account system:** Track balances for Cash, Bank, and Mobile Money by default (add/edit/remove accounts in Settings)
- **Filter transactions** by category, search, date range, amount, and account
- **Visual analytics**: Pie and line charts for expense breakdown and trends
- **Budget progress**: Track your spending against a set budget
- **Export/Import data**: Download your transactions as CSV or JSON for backup/analysis
- **Dark mode**: Toggle between light and dark themes
- **Notifications**: Get alerts for budget limits and actions

## Getting Started

1. **Install dependencies**
	```bash
	cd expenseProj
	npm install
	```
2. **Run the app**
	```bash
	npm run dev
	```
3. **Open** [http://localhost:3000](http://localhost:3000) in your browser

## Running Tests

Unit tests for utility functions are in `tests/transactions.test.js`:
```bash
npm install --save-dev jest
npx jest tests/transactions.test.js
```

## Project Structure

- `src/` - Main source code
  - `components/` - React UI components
  - `utils/` - Utility functions (calculations, filtering)
- `tests/` - Unit tests
- `index.html` - App entry point
- `tailwind.config.js` - Tailwind CSS config
- `postcss.config.js` - PostCSS config

## Customization
- Add/edit categories in `FilterPanel.jsx` and `AnalyticsDashboard.jsx`
- Adjust theme in `tailwind.config.js`

## License
MIT


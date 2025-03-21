# Split-Wise App

A mobile app for splitting expenses with friends, built with React Native, Expo, and Supabase.

## Features

- 🔐 Google Sign-In
- 💰 View and manage expenses
- 👥 Split expenses with friends
- ✅ Track split status

### Bonus Features
- 👆 Right swipe to split expenses
- 🔍 Filter by split status, date, and amount
- 📱 Offline support with local caching

## Quick Start

```bash
# Install dependencies
npm install

# Set environment variables
EXPO_PUBLIC_API_URL=your_api_url
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key

# Start the app
npm run dev
```

## Tech Stack

- **Frontend**: React Native, Expo
- **Backend**: Supabase
- **Auth**: Google OAuth
- **Data**: Axios, AsyncStorage

## Screens

- **Sign In**: Google authentication
- **Home**: User profile and navigation
- **Transactions**: List with swipe actions and filters


App views

![app1](https://github.com/user-attachments/assets/628ad340-71f4-4ae3-8aac-17361c8038c9)
  ![app2](https://github.com/user-attachments/assets/374fdd14-aa9f-439d-9a7d-4761b5aff7dd)

## Development

```javascript
// Fetch transactions
const transactions = await fetchTransactions(userId);

// Apply filters
const filtered = transactions.filter(t => 
  t.amount >= minAmount && 
  t.date >= startDate
);

// Store offline data
await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
```



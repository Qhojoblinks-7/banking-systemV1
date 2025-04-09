import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import './AccountSummary.css'; // Import the CSS for consistent styling

function TransactionHistory({ customerId }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    console.log('Fetching transactions for customer ID:', customerId); // Check the ID

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('customer_id', customerId) // Assuming 'customer_id' is the correct column
        .order('date', { ascending: false });

      console.log('Supabase response data:', data); // Check the data
      console.log('Supabase response error:', error); // Check for errors

      if (error) {
        setError(error.message);
      } else {
        setTransactions(data);
      }
    } catch (err) {
      console.error('Error during fetch:', err);
      setError(`An unexpected error occurred: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchTransactions();
    }
  }, [customerId]);

  if (!customerId) {
    return <p>Please select a customer to view transaction history.</p>;
  }

  if (loading) {
    return <p>Loading transaction history...</p>;
  }

  if (error) {
    return <p>Error loading transaction history: {error}</p>;
  }

  if (!transactions || transactions.length === 0) {
    return <p>No transaction history available for this customer.</p>;
  }

  return (
    <div className="transactions-section">
      <div className="transactions-header">
        <h2>Transactions</h2>
        {/* You might add a "See All" button here if needed */}
      </div>
      <ul className="transactions-list">
        {transactions.map((transaction) => (
          <li key={transaction.id} className="transaction-item">
            <div className={`icon ${transaction.amount > 0 ? 'fund' : 'withdraw'}-arrow`}>
              {transaction.amount > 0 ? '↓' : '↑'}
            </div>
            <div className="transaction-details">
              <p className="type">{transaction.description}</p>
              <p className="date-ref">{new Date(transaction.date).toLocaleDateString()}</p>
            </div>
            <div className="transaction-amount">
              <p className={`amount ${transaction.amount > 0 ? 'credit' : 'debit'}`}>
                {transaction.amount > 0 ? '+' : '-'} GH₵{Math.abs(transaction.amount).toFixed(2)}
              </p>
              <button className="status-button">{transaction.amount > 0 ? 'Deposit' : 'Send'}</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TransactionHistory;
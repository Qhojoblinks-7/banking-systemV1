import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient'; // Adjust path if needed
import './TransactionsPage.css';

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: user } = await supabase.auth.getUser();
        if (user?.data?.user?.id) {
          // First, get the user's account IDs
          const { data: accountsData, error: accountsError } = await supabase
            .from('accounts') // Replace 'accounts'
            .select('id')
            .eq('customer_id', user.data.user.id);

          if (accountsError) {
            setError('Error fetching account IDs.');
            console.error('Error fetching account IDs:', accountsError);
            return;
          }

          if (accountsData && accountsData.length > 0) {
            const accountIds = accountsData.map((account) => account.id);

            const { data: transactionsData, error: transactionsError } = await supabase
              .from('transactions') // Replace 'transactions'
              .select('id, transaction_date, transaction_type, amount, description')
              .in('account_id', accountIds) // Fetch transactions for these accounts
              .order('transaction_date', { ascending: false });

            if (transactionsError) {
              setError('Error fetching transactions.');
              console.error('Error fetching transactions:', transactionsError);
            } else if (transactionsData) {
              setTransactions(transactionsData);
            }
          } else {
            setTransactions([]); // No accounts, no transactions
          }
        }
      } catch (err) {
        setError('Unexpected error fetching transactions.');
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="transactions-page">Loading transactions...</div>;
  }

  if (error) {
    return <div className="transactions-page">Error: {error}</div>;
  }

  return (
    <div className="transactions-page">
      <h1>Transaction History</h1>
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            Date: {new Date(transaction.transaction_date).toLocaleDateString()} -
            Description: {transaction.description || transaction.transaction_type} -
            Amount: ${transaction.amount?.toFixed(2)} ({transaction.transaction_type})
          </li>
        ))}
        {transactions.length === 0 && !loading && <p>No transactions found.</p>}
      </ul>
    </div>
  );
}

export default TransactionsPage;
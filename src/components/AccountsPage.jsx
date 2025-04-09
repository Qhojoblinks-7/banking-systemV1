import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient'; // Adjust path if needed
import './AccountsPage.css';

function AccountsPage() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: user } = await supabase.auth.getUser();
        if (user?.data?.user?.id) {
          const { data: accountsData, error: accountsError } = await supabase
            .from('accounts') // Replace 'accounts' with your accounts table
            .select('id, account_number, balance') // Select relevant fields
            .eq('customer_id', user.data.user.id); // Assuming a 'customer_id' link

          if (accountsError) {
            setError('Error fetching accounts.');
            console.error('Error fetching accounts:', accountsError);
          } else if (accountsData) {
            setAccounts(accountsData);
          }
        }
      } catch (err) {
        setError('Unexpected error fetching accounts.');
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return <div className="accounts-page">Loading accounts...</div>;
  }

  if (error) {
    return <div className="accounts-page">Error: {error}</div>;
  }

  return (
    <div className="accounts-page">
      <h1>Your Accounts</h1>
      <ul>
        {accounts.map((account) => (
          <li key={account.id}>
            Account Number: {account.account_number} - Balance: ${account.balance?.toFixed(2)}
          </li>
        ))}
        {accounts.length === 0 && !loading && <p>No accounts found.</p>}
      </ul>
    </div>
  );
}

export default AccountsPage;
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
      console.log('Auth User on Accounts Page:', await supabase.auth.getUser()); // Debugging

      try {
        const { data: user } = await supabase.auth.getUser();
        if (user?.data?.user?.id) {
          const { data: accountsData, error: accountsError } = await supabase
            .from('accounts') // Replace 'accounts' with your table name
            .select('id, account_number, balance, account_type') // Select necessary columns
            .eq('customer_id', user.data.user.id) // Filter by user ID
            .order('created_at', { ascending: false }); // Optional: Order by creation date

          console.log('Raw accountsData:', accountsData); // Debugging
          if (accountsError) {
            setError('Error fetching accounts.');
            console.error('Error fetching accounts:', accountsError);
          } else if (accountsData) {
            setAccounts(accountsData);
          } else {
            setAccounts([]); // No accounts found for the user
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
      {accounts.length > 0 ? (
        <ul className="accounts-list">
          {accounts.map((account) => (
            <li key={account.id} className="account-item">
              <div className="account-info">
                <strong className="account-label">Account Number:</strong>
                <span className="account-value">{account.account_number}</span>
              </div>
              <div className="account-info">
                <strong className="account-label">Type:</strong>
                <span className="account-value">{account.account_type}</span>
              </div>
              <div className="account-info balance">
                <strong className="account-label">Balance:</strong>
                <span className="account-value">${account.balance?.toFixed(2)}</span>
              </div>
              {/* Add more account details or actions here */}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-accounts">No accounts found for this user.</p>
      )}
    </div>
  );
}

export default AccountsPage;
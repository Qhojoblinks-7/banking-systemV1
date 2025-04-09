import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import './AccountSummary.css'; // Import the CSS file
import { Link } from 'react-router-dom'; // Import Link for navigation

function AccountSummary({ customerId }) {
  const [accountDetails, setAccountDetails] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState(''); // State for user's name

  useEffect(() => {
    const fetchAccountData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch customer details to get the user's name
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('first_name')
          .eq('id', customerId)
          .single();

        if (customerError) {
          setError(`Error fetching customer details: ${customerError.message}`);
          console.error('Customer Fetch Error:', customerError);
        } else if (customerData) {
          setUserName(customerData.first_name || 'User'); // Set username or default
        }

        // Fetch account details
        const { data: accountData, error: accountError } = await supabase
          .from('accounts')
          .select('*')
          .eq('customer_id', customerId)
          .single(); // Assuming one primary account per customer

        if (accountError) {
          setError(`Error fetching account details: ${accountError.message}`);
          console.error('Account Fetch Error:', accountError);
        } else if (accountData) {
          setAccountDetails(accountData);

          // Fetch recent transactions (e.g., last 5)
          const { data: transactionsData, error: transactionsError } = await supabase
            .from('transactions')
            .select('*')
            .eq('account_id', accountData.id)
            .order('transaction_date', { ascending: false })
            .limit(5);

          if (transactionsError) {
            setError(`Error fetching transactions: ${transactionsError.message}`);
            console.error('Transaction Fetch Error:', transactionsError);
          } else if (transactionsData) {
            setRecentTransactions(transactionsData);
          }
        } else {
          setError('No account details found for this customer.');
        }

      } catch (err) {
        setError(`An unexpected error occurred: ${err.message}`);
        console.error('Unexpected Error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchAccountData();
    }
  }, [customerId]);

  if (loading) {
    return <div className="account-summary-container">Loading account summary...</div>;
  }

  if (error) {
    return <div className="account-summary-container">Error loading account summary: {error}</div>;
  }

  if (!accountDetails) {
    return <div className="account-summary-container">No account information available.</div>;
  }

  const lastMonthGrowth = '+3.50%'; // Placeholder - you'd likely calculate this based on data

  // Function to format card number (basic masking)
  const formatCardNumber = (number) => {
    if (number && number.length === 16) {
      return `${number.substring(0, 4)} **** **** ${number.substring(12)}`;
    }
    return '**** **** **** ****';
  };

  const cardNumber = accountDetails.account_number ? formatCardNumber(accountDetails.account_number) : '**** **** **** ****';
  const currentDate = new Date().toLocaleDateString('en-GH'); // Get current date in Ghana format
  const cediBalance = accountDetails.balance ? accountDetails.balance.toFixed(2) : '0.00';
  const accountType = accountDetails.account_type || 'Savings'; // Default to 'Savings' if not available

  return (
    <div style={mobileOnlyStyles.container} className="account-summary-container">
      <div style={mobileOnlyStyles.mobileContent}>
        {/* Header */}
        <div className="header">
          <div className="greeting">
            <h1>Hi, {userName}!</h1>
            <p className="growth">{lastMonthGrowth} from last month</p>
          </div>
          <button className="notification-button">
            {/* You might use an icon here */}🔔
          </button>
        </div>

        {/* Bank Card */}
        <div className="bank-card">
          <div className="balance">
            <p className="label">Cedi Balance</p>
            <h2 className="amount">₵{cediBalance}</h2>
          </div>
          <div className="card-details">
            <p className="expiry">{currentDate}</p>
            <p className="card-number">{cardNumber}</p>
            <p className="account-type">{accountType}</p>
          </div>
          <button className="add-money-button">Add Money</button>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          {/* ... (same as before) */}
        </div>

        {/* Loan Application Button */}
        <div className="loan-application-button">
          <Link to="/apply-loan"> {/* Assuming you'll create a route for /apply-loan */}
            <button style={mobileOnlyStyles.loanButton}>Apply for a Loan</button>
          </Link>
        </div>

        {/* Transactions */}
        <div className="transactions-section">
          <div className="transactions-header">
            <h2>Transactions</h2>
            <button className="see-all-button">See All</button>
          </div>
          <ul className="transactions-list">
            {recentTransactions.map((transaction) => (
              <li key={transaction.id} className="transaction-item">
                <div className={`icon ${transaction.transaction_type ? transaction.transaction_type.toLowerCase() : 'generic'}-arrow`}>
                  {transaction.transaction_type === 'Withdrawal' ? '↑' : transaction.transaction_type === 'Deposit' ? '↓' : '₵'}
                </div>
                <div className="transaction-details">
                  <p className="type">{transaction.description || transaction.transaction_type}</p>
                  <p className="date-ref">{new Date(transaction.transaction_date).toLocaleDateString('en-GH')} - {transaction.id}</p>
                </div>
                <div className="transaction-amount">
                  <p className={`amount ${transaction.amount > 0 ? 'credit' : 'debit'}`}>
                    {transaction.amount > 0 ? '+' : '-'} ₵{Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <button className="status-button">{transaction.amount > 0 ? 'Deposit' : 'Send'}</button>
                </div>
              </li>
            ))}
            {recentTransactions.length === 0 && !loading && <li className="transaction-item">No recent transactions.</li>}
          </ul>
        </div>
      </div>
      <div style={mobileOnlyStyles.desktopBlocker}>
        <p>This application is designed for mobile devices only.</p>
        <p>Please access it on a smartphone or tablet.</p>
      </div>
    </div>
  );
}

const mobileOnlyStyles = {
  container: {
    // Base styles for mobile
    padding: '16px',
    margin: '0 auto',
    maxWidth: '600px',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  mobileContent: {
    // Content visible on mobile
  },
  desktopBlocker: {
    display: 'none', // Initially hidden
    padding: '20px',
    backgroundColor: '#f8f8f8',
    border: '1px solid #eee',
    borderRadius: '8px',
    marginTop: '20px',
    color: '#777',
  },
  loanButton: {
    backgroundColor: '#28a745', // Green color for apply button
    color: 'white',
    padding: '10px 15px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1em',
    marginTop: '20px',
  },
};

// Media query to hide mobile content and show blocker on larger screens
const mediaQuery = `@media (min-width: 768px) {
  .account-summary-container > div:first-child { /* Target mobileContent */
    display: none !important;
  }
  .account-summary-container > div:last-child { /* Target desktopBlocker */
    display: flex !important;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh; /* Make it take up the whole viewport */
  }
  .account-summary-container {
    padding: 0; /* Remove container padding on desktop */
    max-width: none; /* Remove max width on desktop */
    margin: 0; /* Remove container margin on desktop */
    background-color: #f8f8f8; /* Set background color for the blocker */
  }
}`;

// Inject the media query into the document head
const styleElement = document.createElement('style');
styleElement.textContent = mediaQuery;
document.head.appendChild(styleElement);

export default AccountSummary;
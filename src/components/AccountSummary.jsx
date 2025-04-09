import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import './AccountSummary.css'; // Assuming you've kept the CSS filename
import { Link } from 'react-router-dom';
import { FaSearch, FaBell, FaArrowDown, FaArrowUp, FaEye, FaEllipsisH, FaTimes } from 'react-icons/fa';
import { FaMoneyBillWave as FaMoneyBillWaveSolid } from 'react-icons/fa';
import BottomNavigationBar from './BottomNavigationBar';

function AccountSummary({ customerId }) {
  const [accountDetails, setAccountDetails] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('User');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the user agent indicates a mobile device
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    setIsMobile(mobileRegex.test(navigator.userAgent));

    // Function to set viewport height for mobile
    function setViewportHeight() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Set initial viewport height
    if (isMobile) {
      setViewportHeight();
      window.addEventListener('resize', setViewportHeight);
      return () => {
        window.removeEventListener('resize', setViewportHeight);
      };
    }
  }, [isMobile]); // Re-run if isMobile changes (though unlikely during a session)

  useEffect(() => {
    if (!isMobile) {
      return; // Don't fetch data if not on a mobile device
    }

    const fetchAccountData = async () => {
      if (!customerId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch customer details for name
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('first_name')
          .eq('id', customerId)
          .single();

        if (customerError) {
          console.error('Error fetching customer:', customerError);
        } else if (customerData?.first_name) {
          setUserName(customerData.first_name);
        }

        // Fetch account details
        const { data: accountData, error: accountError } = await supabase
          .from('accounts')
          .select('id, balance')
          .eq('customer_id', customerId)
          .single();

        if (accountError) {
          console.error('Error fetching account:', accountError);
        } else if (accountData) {
          setAccountDetails(accountData);

          // Fetch recent transactions ONLY if accountDetails.id is available
          if (accountData.id) {
            const { data: transactionsData, error: transactionsError } = await supabase
              .from('transactions')
              .select('id, transaction_type, amount, transaction_date, description')
              .eq('account_id', accountData.id)
              .order('transaction_date', { ascending: false })
              .limit(5);

            if (transactionsError) {
              console.error('Error fetching transactions:', transactionsError);
            } else if (transactionsData) {
              setRecentTransactions(transactionsData);
            }
          }
        } else {
          setError('Failed to load account data.');
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Failed to load account data.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [customerId, isMobile]); // Re-run data fetch if customerId or isMobile changes

  if (!isMobile) {
    return (
      <div className="mobile-only-message">
        This application is designed for mobile devices only. Please access it on a smartphone.
      </div>
    );
  }

  if (loading) {
    return <div className="account-summary-new-container">Loading...</div>;
  }

  if (error) {
    return <div className="account-summary-new-container error">{error}</div>;
  }

  return (
    <div className="account-summary-new-container">
      {/* Top Navigation Bar */}
      <nav className="top-nav">
        <div className="user-info">
          <div className="profile-pic-placeholder"></div> {/* Replace with actual image */}
          <span className="greeting">Hi, {userName}.</span>
        </div>
        <div className="nav-icons">
          <div className="icon-circle">
            <FaSearch />
          </div>
          <div className="icon-circle">
            <FaBell />
          </div>
        </div>
      </nav>

      {/* Balance Display */}
      <div className="balance-display">
        <p className="balance-label">Your Balance</p>
        <h1 className="balance-amount">${accountDetails?.balance ? accountDetails.balance.toFixed(2) : '0.00'}</h1>
      </div>

      {/* Quick Actions (Bank Related) */}
      <div className="quick-actions-new">
        <button className="quick-action-button fund">
          <FaArrowDown className="quick-action-icon" />
          <span className="quick-action-text">Fund</span>
        </button>
        <button className="quick-action-button withdraw">
          <FaArrowUp className="quick-action-icon" />
          <span className="quick-action-text">Withdraw</span>
        </button>
        <button className="quick-action-button details">
          <FaEye className="quick-action-icon" />
          <span className="quick-action-text">Details</span>
        </button>
        <button className="quick-action-button more">
          <FaEllipsisH className="quick-action-icon" />
          <span className="quick-action-text">More</span>
        </button>
      </div>

      {/* Bank Promotion Banner (Adapt as needed) */}
      <div className="smart-investing-banner">
        <div className="sparkles">✨</div>
        <h2 className="banner-title">Your Bank at Your Fingertips!</h2>
        <p className="banner-subtitle">Manage your finances with ease and security.</p>
        <button className="close-banner">
          <FaTimes />
        </button>
        <div className="sparkles right">✨</div>
      </div>

      {/* Recent Transactions (Styled like Market Data) */}
      <section className="market-section">
        <div className="market-header">
          <h2 className="market-title">Recent Transactions</h2>
          <Link to="/transactions" className="view-all-link">View all</Link>
        </div>
        <ul className="market-list">
          {recentTransactions.map((transaction) => (
            <li key={transaction.id} className="market-item">
              <div className="market-item-left">
                <div className={`crypto-icon-bg transaction-icon`}>
                  {transaction.transaction_type === 'deposit' ? <FaArrowDown color="#4caf50" /> : transaction.transaction_type === 'withdrawal' ? <FaArrowUp color="#f44336" /> : <FaMoneyBillWaveSolid color="#1e88e5" />}
                </div>
                <div className="crypto-info">
                  <p className="crypto-name">{transaction.description || transaction.transaction_type}</p>
                  <p className="crypto-symbol">{new Date(transaction.transaction_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="market-item-right">
                <p className={`crypto-price ${transaction.amount > 0 ? 'credit' : 'debit'}`}>
                  ${transaction.amount?.toFixed(2) || '0.00'}
                </p>
                <p className={`crypto-change ${transaction.amount > 0 ? 'green' : 'red'}`}>
                  {transaction.amount > 0 ? '+' : '-'}{Math.abs(transaction.amount)?.toFixed(2) || '0.00'}
                </p>
              </div>
            </li>
          ))}
          {recentTransactions.length === 0 && !loading && (
            <li className="market-item">No recent transactions.</li>
          )}
        </ul>
        <BottomNavigationBar />
      </section>

      
    </div>
  );
}

export default AccountSummary;
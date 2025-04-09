import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaListAlt, FaUser, FaMoneyBillWave } from 'react-icons/fa';
import './BottomNavigationBar.css';

function BottomNavigationBar() {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <Link
        to="/account"
        className={`nav-item ${location.pathname === '/account' ? 'active' : ''}`}
      >
        <div className="nav-icon-wrapper">
          <FaHome className="nav-icon" />
        </div>
        <span className="nav-label">Home</span>
      </Link>
      <Link
        to="/accounts"
        className={`nav-item ${location.pathname === '/accounts' ? 'active' : ''}`}
      >
        <div className="nav-icon-wrapper">
          <FaListAlt className="nav-icon" />
        </div>
        <span className="nav-label">Accounts</span>
      </Link>
      <Link
        to="/transactions"
        className={`nav-item ${location.pathname === '/transactions' ? 'active' : ''}`}
      >
        <div className="nav-icon-wrapper">
          <FaMoneyBillWave className="nav-icon" />
        </div>
        <span className="nav-label">Transactions</span>
      </Link>
      <Link
        to="/profile"
        className={`nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
      >
        <div className="nav-icon-wrapper">
          <FaUser className="nav-icon" />
        </div>
        <span className="nav-label">Profile</span>
      </Link>
    </nav>
  );
}

export default BottomNavigationBar;
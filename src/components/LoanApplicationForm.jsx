import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';
import LoanTypeSelector from './LoanTypeSelector'; // Import the new component

function LoanApplicationForm({ customerId }) {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loanTypes, setLoanTypes] = useState([]);
  const [selectedLoanType, setSelectedLoanType] = useState('');
  const [showLoanForm, setShowLoanForm] = useState(false);

  useEffect(() => {
    const fetchLoanTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('loan_types')
          .select('id, name, description, min_interest_rate, max_interest_rate, default_term_months');

        if (error) {
          console.error('Error fetching loan types:', error);
          setErrorMessage('Failed to load loan options.');
        } else if (data) {
          setLoanTypes(data);
        }
      } catch (err) {
        console.error('Unexpected error fetching loan types:', err);
        setErrorMessage('An unexpected error occurred while loading loan options.');
      }
    };

    fetchLoanTypes();
  }, []);

  const handleLoanTypeSelect = (loanTypeId) => {
    setSelectedLoanType(loanTypeId);
    setShowLoanForm(true); // Show the form after a loan type is selected
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmissionStatus(null);
    setErrorMessage('');

    if (!customerId) {
      setErrorMessage('Error: Customer ID is not available. Please log in.');
      setSubmissionStatus('error');
      return;
    }

    if (!selectedLoanType) {
      setErrorMessage('Please select a loan type.');
      setSubmissionStatus('error');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .insert([
          {
            customer_id: customerId,
            account_id: null, // You might need to fetch the user's account ID
            loan_type_id: selectedLoanType,
            amount: parseFloat(loanAmount),
            purpose: loanPurpose,
            term_months: parseInt(loanTerm, 10),
            application_date: new Date().toISOString(),
            status: 'pending',
          },
        ])
        .single();

      if (error) {
        setErrorMessage(`Error submitting application: ${error.message}`);
        setSubmissionStatus('error');
      } else {
        console.log('Loan Application Submitted to Database:', data);
        setSubmissionStatus('success');
        setLoanAmount('');
        setLoanPurpose('');
        setLoanTerm('');
        setSelectedLoanType('');
        setShowLoanForm(false); // Reset to loan type selection after submission
      }
    } catch (err) {
      setErrorMessage(`An unexpected error occurred: ${err.message}`);
      setSubmissionStatus('error');
    }
  };

  return (
    <div style={mobileOnlyStyles.container} className="loan-application-form">
      <div style={mobileOnlyStyles.mobileContent}>
        <h2 style={mobileOnlyStyles.heading}>Loan Application</h2>
        {submissionStatus === 'success' && (
          <p style={mobileOnlyStyles.success}>Loan application submitted successfully!</p>
        )}
        {submissionStatus === 'error' && (
          <p style={mobileOnlyStyles.error}>{errorMessage}</p>
        )}

        {!showLoanForm ? (
          <LoanTypeSelector
            loanTypes={loanTypes}
            onSelectLoanType={handleLoanTypeSelect}
            selectedLoanType={selectedLoanType}
          />
        ) : (
          <form onSubmit={handleSubmit} style={mobileOnlyStyles.form}>
            <h3 style={mobileOnlyStyles.sectionHeading}>Apply for: {loanTypes.find((type) => type.id === selectedLoanType)?.name}</h3>
            <div style={mobileOnlyStyles.formGroup}>
              <label htmlFor="loanAmount" style={mobileOnlyStyles.label}>
                Loan Amount (GH₵):
              </label>
              <input
                type="number"
                id="loanAmount"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                style={mobileOnlyStyles.input}
                required
              />
            </div>
            <div style={mobileOnlyStyles.formGroup}>
              <label htmlFor="loanPurpose" style={mobileOnlyStyles.label}>
                Purpose of Loan:
              </label>
              <textarea
                id="loanPurpose"
                value={loanPurpose}
                onChange={(e) => setLoanPurpose(e.target.value)}
                style={mobileOnlyStyles.textarea}
                required
              />
            </div>
            <div style={mobileOnlyStyles.formGroup}>
              <label htmlFor="loanTerm" style={mobileOnlyStyles.label}>
                Loan Term (in months):
              </label>
              <input
                type="number"
                id="loanTerm"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                style={mobileOnlyStyles.input}
                required
              />
            </div>
            <button type="submit" style={mobileOnlyStyles.button}>
              Apply Now
            </button>
          </form>
        )}
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
    padding: '20px', // Increased padding for better mobile spacing
    margin: '0 auto',
    maxWidth: '100%', // Take full width
    backgroundColor: '#fff',
    textAlign: 'center',
    boxSizing: 'border-box', // Ensure padding doesn't add to width
  },
  heading: {
    fontSize: '2em', // Larger heading for mobile
    marginBottom: '25px',
    color: '#333',
    textAlign: 'center',
  },
  sectionHeading: {
    fontSize: '1.4em',
    marginTop: '30px',
    marginBottom: '15px',
    color: '#555',
    textAlign: 'center',
  },
  form: {
    marginTop: '25px',
    paddingTop: '25px',
    borderTop: '1px solid #eee',
    width: '100%', // Full width for form
    boxSizing: 'border-box',
  },
  formGroup: {
    marginBottom: '20px',
    width: '100%', // Full width for form groups
    boxSizing: 'border-box',
  },
  label: {
    display: 'block',
    marginBottom: '10px',
    fontWeight: 'bold',
    color: '#555',
    fontSize: '1.1em',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    fontSize: '1.1em',
  },
  textarea: {
    width: '100%',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    minHeight: '120px',
    fontSize: '1.1em',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '18px 25px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2em',
    width: '100%',
    marginTop: '30px',
    boxSizing: 'border-box',
  },
  success: {
    color: 'green',
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '1.1em',
  },
  error: {
    color: 'red',
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '1.1em',
  },
  mobileContent: {
    padding: '20px', // Add padding to the mobile content as well
    boxSizing: 'border-box',
  },
  desktopBlocker: {
    display: 'none',
    padding: '20px',
    backgroundColor: '#f8f8f8',
    border: '1px solid #eee',
    borderRadius: '8px',
    marginTop: '20px',
    color: '#777',
    textAlign: 'center',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

// Media query to hide mobile content and show blocker on larger screens
const mediaQuery = `@media (min-width: 768px) {
  .loan-application-form > div:first-child { /* Target mobileContent */
    display: none !important;
  }
  .loan-application-form > div:last-child { /* Target desktopBlocker */
    display: flex !important;
  }
  .loan-application-form > div {
    padding: 0;
    max-width: none;
    margin: 0;
    background-color: #f8f8f8;
  }
}`;

// Inject the media query into the document head
const styleElement = document.createElement('style');
styleElement.textContent = mediaQuery;
document.head.appendChild(styleElement);

export default LoanApplicationForm;
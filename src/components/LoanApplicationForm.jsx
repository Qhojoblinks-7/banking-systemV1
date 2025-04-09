import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';

function LoanApplicationForm({ customerId }) {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loanTypes, setLoanTypes] = useState([]);
  const [selectedLoanType, setSelectedLoanType] = useState('');

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

        <h3 style={mobileOnlyStyles.sectionHeading}>Available Loan Types</h3>
        <div style={mobileOnlyStyles.loanTypesContainer}>
          {loanTypes.map((type) => (
            <button
              key={type.id}
              style={{
                ...mobileOnlyStyles.loanTypeButton,
                backgroundColor: selectedLoanType === type.id ? '#007bff' : '#f0f0f0',
                color: selectedLoanType === type.id ? 'white' : '#333',
              }}
              onClick={() => setSelectedLoanType(type.id)}
            >
              <span style={mobileOnlyStyles.loanTypeName}>{type.name}</span>
              <p style={mobileOnlyStyles.loanTypeDescription}>{type.description}</p>
              <p style={mobileOnlyStyles.loanTypeDetails}>
                Interest: {type.min_interest_rate * 100}% - {type.max_interest_rate * 100}%, Term: {type.default_term_months} months
              </p>
            </button>
          ))}
          {loanTypes.length === 0 && !errorMessage && <p style={mobileOnlyStyles.loading}>Loading loan options...</p>}
          {errorMessage && <p style={mobileOnlyStyles.error}>{errorMessage}</p>}
        </div>

        {selectedLoanType && (
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
    padding: '16px',
    margin: '0 auto',
    maxWidth: '600px',
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  heading: {
    fontSize: '1.8em',
    marginBottom: '20px',
    color: '#333',
    textAlign: 'center',
  },
  sectionHeading: {
    fontSize: '1.2em',
    marginTop: '25px',
    marginBottom: '10px',
    color: '#555',
  },
  loanTypesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  loanTypeButton: {
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
  },
  loanTypeName: {
    fontWeight: 'bold',
    fontSize: '1em',
    color: '#333',
  },
  loanTypeDescription: {
    fontSize: '0.9em',
    color: '#777',
    marginTop: '5px',
    marginBottom: '5px',
  },
  loanTypeDetails: {
    fontSize: '0.8em',
    color: '#555',
  },
  form: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #eee',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#555',
    fontSize: '1em',
  },
  input: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    fontSize: '1em',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    boxSizing: 'border-box',
    minHeight: '100px',
    fontSize: '1em',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '15px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1em',
    width: '100%',
    marginTop: '20px',
  },
  success: {
    color: 'green',
    marginTop: '15px',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: '15px',
    textAlign: 'center',
  },
  loading: {
    textAlign: 'center',
    marginTop: '15px',
    color: '#777',
  },
  mobileContent: {},
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
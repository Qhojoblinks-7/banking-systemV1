import React from 'react';

const LoanTypeSelector = ({ loanTypes, onSelectLoanType, selectedLoanType }) => {
  return (
    <div style={loanTypeSelectorStyles.container}>
      <h3 style={loanTypeSelectorStyles.heading}>Available Loan Types</h3>
      <div style={loanTypeSelectorStyles.loanTypesContainer}>
        {loanTypes.map((type) => (
          <button
            key={type.id}
            style={{
              ...loanTypeSelectorStyles.loanTypeButton,
              backgroundColor: selectedLoanType === type.id ? '#007bff' : '#f0f0f0',
              color: selectedLoanType === type.id ? 'white' : '#333',
            }}
            onClick={() => onSelectLoanType(type.id)}
          >
            <span style={loanTypeSelectorStyles.loanTypeName}>{type.name}</span>
            <p style={loanTypeSelectorStyles.loanTypeDescription}>{type.description}</p>
            <p style={loanTypeSelectorStyles.loanTypeDetails}>
              Interest: {type.min_interest_rate * 100}% - {type.max_interest_rate * 100}%, Term: {type.default_term_months} months
            </p>
          </button>
        ))}
        {loanTypes.length === 0 && <p style={loanTypeSelectorStyles.loading}>Loading loan options...</p>}
      </div>
    </div>
  );
};

const loanTypeSelectorStyles = {
  container: {
    width: '100%', // Ensure it takes full width
    boxSizing: 'border-box',
  },
  heading: {
    fontSize: '1.2em',
    marginBottom: '15px',
    color: '#555',
    textAlign: 'center',
  },
  loanTypesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  loanTypeButton: {
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%', // Ensure buttons take full width
    boxSizing: 'border-box',
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
  loading: {
    textAlign: 'center',
    marginTop: '15px',
    color: '#777',
  },
};

export default LoanTypeSelector;
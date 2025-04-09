import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import supabase from '../supabaseClient';
import './AuthForm.css';

const SignUpSchema = Yup.object().shape({
  firstName: Yup.string().required('First Name is required'),
  lastName: Yup.string().required('Last Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  phoneNumber: Yup.string(),
});

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setRegistrationSuccess(false);
    setLoginSuccess(false);
    formik.resetForm(); // Reset form when toggling
  };

  const handleSignUpSubmit = async (values) => {
    setError(null);
    setRegistrationSuccess(false);

    console.log('Attempting signup with:', values); // Debugger

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (authError) {
        setError(authError.message);
        console.error('Supabase Auth Signup Error:', authError); // Debugger
        return;
      }

      if (authData?.user?.id) {
        console.log('Supabase Auth User ID:', authData.user.id); // Debugger
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .insert([
            {
              id: authData.user.id,
              first_name: values.firstName,
              last_name: values.lastName,
              email: values.email,
              phone_number: values.phoneNumber,
            },
          ])
          .select('id')
          .single();

        if (customerError) {
          console.error('Supabase Customers Insert Error:', customerError); // Debugger
          setError(`Registration failed: ${customerError.message}`);
          return;
        }

        if (customerData && customerData.id) {
          console.log('New Customer ID:', customerData.id); // Debugger
          const accountNumber = uuidv4().substring(0, 16).toUpperCase();

          const { error: accountError } = await supabase
            .from('accounts')
            .insert([
              {
                customer_id: customerData.id,
                account_number: accountNumber,
                account_type: 'Savings',
                balance: 0,
              },
            ]);

          if (accountError) {
            console.error('Supabase Accounts Insert Error:', accountError); // Debugger
            setError(`Account creation failed: ${accountError.message}`);
            return;
          }

          setRegistrationSuccess(true);
          formik.resetForm();
          // The automatic redirection will be handled by onAuthStateChange in App.jsx
        } else {
          setError('Failed to retrieve new customer ID.');
        }
      } else {
        setError('Failed to create user account.');
      }
    } catch (err) {
      setError(`An unexpected error occurred during signup: ${err.message}`);
      console.error('Signup Catch Error:', err); // Debugger
    }
  };

  const handleLoginSubmit = async (values) => {
    setError(null);
    setLoginSuccess(false);

    console.log('Attempting login with:', values); // Debugger

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (loginError) {
        setError(loginError.message);
        console.error('Supabase Auth Login Error:', loginError); // Debugger
      } else {
        setLoginSuccess(true);
        formik.resetForm();
        // The automatic redirection will be handled by onAuthStateChange in App.jsx
      }
    } catch (err) {
      setError(`An unexpected error occurred during login: ${err.message}`);
      console.error('Login Catch Error:', err); // Debugger
    }
  };

  const formik = useFormik({
    initialValues: isSignUp
      ? { firstName: '', lastName: '', email: '', password: '', phoneNumber: '' }
      : { email: '', password: '' },
    validationSchema: isSignUp ? SignUpSchema : LoginSchema,
    onSubmit: isSignUp ? handleSignUpSubmit : handleLoginSubmit,
    enableReinitialize: true, // Important for resetting form on toggle
  });

  return (
    <div className="auth-container" style={mobileOnlyStyles.container}>
      <div style={mobileOnlyStyles.mobileContent}>
        <div className="auth-toggle">
          <button
            className={isSignUp ? 'active' : ''}
            onClick={toggleAuthMode}
          >
            Sign Up
          </button>
          <button
            className={!isSignUp ? 'active' : ''}
            onClick={toggleAuthMode}
          >
            Login
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="auth-form">
          <h2>{isSignUp ? 'Sign Up' : 'Login'}</h2>
          {registrationSuccess && isSignUp && (
            <p className="success">Registration successful! An initial savings account has been created.</p>
          )}
          {loginSuccess && !isSignUp && (
            <p className="success">Login successful!</p>
          )}
          {error && <p className="error">{error}</p>}

          {isSignUp && (
            <>
              <div className="form-group">
                <label htmlFor="firstName">First Name:</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                  required
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <div className="error-message">{formik.errors.firstName}</div>
                ) : null}
              </div>
              <div className="form-group">
                <label htmlFor="lastName">Last Name:</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                  required
                />
                {formik.touched.lastName && formik.errors.lastName ? (
                  <div className="error-message">{formik.errors.lastName}</div>
                ) : null}
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  required
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="error-message">{formik.errors.email}</div>
                ) : null}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  required
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="error-message">{formik.errors.password}</div>
                ) : null}
              </div>
              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number:</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phoneNumber}
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                  <div className="error-message">{formik.errors.phoneNumber}</div>
                ) : null}
              </div>
            </>
          )}

          {!isSignUp && (
            <>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  required
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="error-message">{formik.errors.email}</div>
                ) : null}
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  required
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="error-message">{formik.errors.password}</div>
                ) : null}
              </div>
            </>
          )}

          <button type="submit" className="submit-button">
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
        </form>
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
    padding: '20px',
    margin: '0 auto',
    maxWidth: '400px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  mobileContent: {
    // Content visible on mobile
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

const mediaQuery = `@media (min-width: 768px) {
  .auth-container > div:first-child { /* Target mobileContent */
    display: none !important;
  }
  .auth-container > div:last-child { /* Target desktopBlocker */
    display: flex !important;
  }
  .auth-container {
    padding: 0;
    max-width: none;
    margin: 0;
    background-color: #f8f8f8;
  }
}`;

const styleElement = document.createElement('style');
styleElement.textContent = mediaQuery;
document.head.appendChild(styleElement);

export default AuthForm;
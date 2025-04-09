import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient'; // Adjust path if needed
import './HomePage.css';

function HomePage() {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: user, error } = await supabase.auth.getUser();
        if (error) {
          setError('Error fetching user data.');
          console.error('Error fetching user:', error);
        } else if (user?.data?.user?.id) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles') // Replace 'profiles' with your user profile table
            .select('full_name') // Replace 'full_name' with the name field
            .eq('id', user.data.user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
          } else if (profile?.full_name) {
            setUserName(profile.full_name);
          } else {
            setUserName('User'); // Default name if not found
          }
        }
      } catch (err) {
        setError('Unexpected error fetching user data.');
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="home-page">Loading user data...</div>;
  }

  if (error) {
    return <div className="home-page">Error: {error}</div>;
  }

  return (
    <div className="home-page">
      <h1>Welcome, {userName}!</h1>
      <p>This is your personalized home page.</p>
      {/* Add more relevant content here */}
    </div>
  );
}

export default HomePage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient'; // Adjust path if needed
import './ProfilePage.css';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: user } = await supabase.auth.getUser();
        if (user?.data?.user?.id) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles') // Replace 'profiles' with your user profile table
            .select('*') // Select all profile fields
            .eq('id', user.data.user.id)
            .single();

          if (profileError) {
            setError('Error fetching profile.');
            console.error('Error fetching profile:', profileError);
          } else if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (err) {
        setError('Unexpected error fetching profile.');
        console.error('Unexpected error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      alert('Error signing out. Please try again.');
    } else {
      console.log('User signed out successfully.');
      navigate('/app'); // Redirect to your login/signup page
    }
  };

  if (loading) {
    return <div className="profile-page">Loading profile data...</div>;
  }

  if (error) {
    return <div className="profile-page">Error: {error}</div>;
  }

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <div className="profile-container">
        {profile && (
          <div className="profile-info-card">
            <h2>Personal Information</h2>
            <div className="profile-info-item">
              <strong>Name:</strong> {profile.full_name || 'N/A'}
            </div>
            <div className="profile-info-item">
              <strong>Email:</strong> {profile.email || 'N/A'}
            </div>
            {profile.phone_number && (
              <div className="profile-info-item">
                <strong>Phone:</strong> {profile.phone_number}
              </div>
            )}
            {profile.date_of_birth && (
              <div className="profile-info-item">
                <strong>Date of Birth:</strong> {new Date(profile.date_of_birth).toLocaleDateString()}
              </div>
            )}
            {/* Add more profile fields as needed based on your 'profiles' table */}
          </div>
        )}
        {!profile && !loading && <p>No profile information found.</p>}

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>

        {/* You can add other profile actions here, like "Edit Profile" */}
      </div>
    </div>
  );
}

export default ProfilePage;
import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient'; // Adjust path if needed
import './ProfilePage.css';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div className="profile-page">Loading profile data...</div>;
  }

  if (error) {
    return <div className="profile-page">Error: {error}</div>;
  }

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      {profile && (
        <>
          <p>Name: {profile.full_name || 'N/A'}</p> {/* Replace 'full_name' */}
          <p>Email: {profile.email || 'N/A'}</p> {/* Replace 'email' */}
          {/* Add more profile fields as needed */}
        </>
      )}
      {!profile && !loading && <p>No profile information found.</p>}
      {/* Add options to edit profile, etc. */}
    </div>
  );
}

export default ProfilePage;
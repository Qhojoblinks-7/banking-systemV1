import React from 'react';

function EnvTest() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  return (
    <div>
      <p>Supabase URL: {supabaseUrl}</p>
      <p>Supabase Anon Key: {supabaseKey}</p>
    </div>
  );
}

export default EnvTest;
import React from 'react';

const FacebookSignInButton = ({ text = "Continue with Facebook", disabled = false }) => {
  const handleFacebookSignIn = () => {
    if (disabled) return;
    window.location.href = 'http://localhost:5000/api/auth/facebook';
  };

  return (
    <button
      onClick={handleFacebookSignIn}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '12px 16px',
        backgroundColor: '#1877f2',
        color: 'white',
        border: '2px solid #1877f2',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '16px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        transition: 'all 0.3s ease',
        marginBottom: '12px',
        opacity: disabled ? 0.6 : 1
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.backgroundColor = '#166fe5';
          e.target.style.borderColor = '#166fe5';
          e.target.style.boxShadow = '0 2px 8px rgba(24, 119, 242, 0.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.backgroundColor = '#1877f2';
          e.target.style.borderColor = '#1877f2';
          e.target.style.boxShadow = 'none';
        }
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      {text}
    </button>
  );
};

export default FacebookSignInButton;
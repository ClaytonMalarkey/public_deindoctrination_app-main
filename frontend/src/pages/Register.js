import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/api";
import GoogleSignInButton from "../components/GoogleSignInButton";
import FacebookSignInButton from "../components/FacebookSignInButton";

function Register() {
  const [step, setStep] = useState(1); // 1: Register, 2: Verify OTP
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    console.log('Registration attempt with:', { username, email, password: '***' });

    try {
      const response = await authAPI.register({
        username,
        email,
        password,
      });
      
      console.log('Registration response:', response.data);
      
      if (response.data.requiresVerification) {
        setMessage("Registration successful! Please check your email for the verification OTP.");
        setStep(2);
      } else {
        setMessage("Registration successful!");
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
      
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await authAPI.verifyEmail({
        email,
        otp,
      });
      
      console.log('Verification response:', response.data);
      
      // Store tokens
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      // Store user info
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      setMessage("Email verified successfully! Redirecting to dashboard...");
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Verification error:', error);
      const errorMessage = error.response?.data?.message || 'Verification failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await authAPI.resendVerification({ email });
      setMessage("Verification OTP resent to your email.");
    } catch (error) {
      console.error('Resend OTP error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f7fa',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '450px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
        border: '2px solid #4a7c59',
        padding: '40px',
        position: 'relative',
        overflow: 'hidden',
        animation: 'fadeInUp 0.6s ease-out'
      }}>
        {/* Decorative header */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '6px',
          background: 'linear-gradient(90deg, #4a7c59, #2d5016, #4a7c59)',
        }}></div>
        
        {/* App title */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            color: '#2d5016',
            fontSize: '1.8rem',
            fontWeight: 'bold',
            margin: '0 0 8px 0'
          }}>
            🌟 Deindoctrination App
          </h1>
          <p style={{
            color: '#666',
            fontSize: '0.9rem',
            margin: 0
          }}>
            Join the community and start your journey
          </p>
        </div>
      {step === 1 ? (
        <form onSubmit={handleRegister}>
          <h2 style={{
            color: '#2d5016',
            textAlign: 'center',
            marginBottom: '25px',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            🚀 Create Account
          </h2>
          
          {message && (
            <div style={{ 
              padding: '10px', 
              marginBottom: '10px', 
              backgroundColor: '#d4edda', 
              color: '#155724', 
              border: '1px solid #c3e6cb',
              borderRadius: '4px'
            }}>
              {message}
            </div>
          )}
          
          {error && (
            <div style={{ 
              padding: '10px', 
              marginBottom: '10px', 
              backgroundColor: '#f8d7da', 
              color: '#721c24', 
              border: '1px solid #f5c6cb',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}
          
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              marginBottom: '15px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4a7c59'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              marginBottom: '15px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4a7c59'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength="6"
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              marginBottom: '15px',
              border: '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px',
              transition: 'border-color 0.3s ease',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#4a7c59'}
            onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '14px', 
              backgroundColor: loading ? '#ccc' : '#4a7c59',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '20px',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'background-color 0.3s ease',
              boxShadow: loading ? 'none' : '0 4px 12px rgba(74, 124, 89, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#3d6b4a';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#4a7c59';
              }
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          {/* OAuth Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '20px 0',
            color: '#666',
            fontSize: '14px'
          }}>
            <div style={{
              flex: 1,
              height: '1px',
              backgroundColor: '#e1e5e9'
            }}></div>
            <span style={{
              padding: '0 16px',
              backgroundColor: 'white'
            }}>
              or
            </span>
            <div style={{
              flex: 1,
              height: '1px',
              backgroundColor: '#e1e5e9'
            }}></div>
          </div>
          
          {/* OAuth Buttons */}
          <GoogleSignInButton text="Sign up with Google" disabled={loading} />
          <FacebookSignInButton text="Sign up with Facebook" disabled={loading} />
          
          <p style={{ textAlign: 'center', marginTop: '10px' }}>
            Already have an account? <a href="/login">Login here</a>
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP}>
          <h2 style={{
            color: '#2d5016',
            textAlign: 'center',
            marginBottom: '15px',
            fontSize: '1.5rem',
            fontWeight: '600'
          }}>
            📧 Verify Email
          </h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            We've sent a 6-digit verification code to <strong>{email}</strong>
          </p>
          
          {message && (
            <div style={{ 
              padding: '10px', 
              marginBottom: '10px', 
              backgroundColor: '#d4edda', 
              color: '#155724', 
              border: '1px solid #c3e6cb',
              borderRadius: '4px'
            }}>
              {message}
            </div>
          )}
          
          {error && (
            <div style={{ 
              padding: '10px', 
              marginBottom: '10px', 
              backgroundColor: '#f8d7da', 
              color: '#721c24', 
              border: '1px solid #f5c6cb',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}
          
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            required
            maxLength="6"
            style={{ 
              width: '100%', 
              padding: '15px', 
              marginBottom: '15px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '18px',
              textAlign: 'center',
              letterSpacing: '2px'
            }}
          />
          
          <button 
            type="submit" 
            disabled={loading || otp.length !== 6}
            style={{ 
              width: '100%', 
              padding: '10px', 
              backgroundColor: (loading || otp.length !== 6) ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (loading || otp.length !== 6) ? 'not-allowed' : 'pointer',
              marginBottom: '10px'
            }}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
          
          <button 
            type="button"
            onClick={handleResendOTP}
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '10px', 
              backgroundColor: 'transparent',
              color: '#4a7c59',
              border: '1px solid #4a7c59',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Sending...' : 'Resend OTP'}
          </button>
          
          <p style={{ textAlign: 'center', marginTop: '15px' }}>
            <button 
              type="button"
              onClick={() => setStep(1)}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#4a7c59', 
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              ← Back to Registration
            </button>
          </p>
        </form>
      )}
      
      {/* Decorative footer */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '6px',
        background: 'linear-gradient(90deg, #4a7c59, #2d5016, #4a7c59)',
      }}></div>
    </div>
    </div>
  );
}

export default Register;

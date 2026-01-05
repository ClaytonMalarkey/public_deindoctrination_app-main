import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/api";
import GoogleSignInButton from "../components/GoogleSignInButton";
import FacebookSignInButton from "../components/FacebookSignInButton";

function Login() {
  const [step, setStep] = useState(1); // 1: Login, 2: OTP, 3: Forgot Password, 4: Reset Password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const navigate = useNavigate();

  // Check for OAuth errors on component mount
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthError = urlParams.get('error');
    
    if (oauthError) {
      switch (oauthError) {
        case 'oauth_failed':
          setError('OAuth authentication failed. Please try again.');
          break;
        case 'processing_failed':
          setError('Failed to process authentication. Please try again.');
          break;
        case 'missing_data':
          setError('Authentication data missing. Please try again.');
          break;
        default:
          setError('Authentication error occurred. Please try again.');
      }
      
      // Clear the error from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await authAPI.login({
        email,
        password,
        rememberMe,
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.requiresOTP) {
        setMessage("Login OTP sent to your email. Please check your inbox.");
        setStep(2);
      } else if (response.data.requiresVerification) {
        setError("Please verify your email first.");
        // Could redirect to verification page
      } else {
        // Direct login (shouldn't happen with OTP enabled)
        localStorage.setItem('token', response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', response.data.refreshToken);
        }
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        navigate('/dashboard');
      }
      
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLoginOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await authAPI.verifyLogin({
        email,
        otp,
        rememberMe,
      });
      
      // Store tokens
      localStorage.setItem('token', response.data.accessToken);
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      
      // Store user info
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      setMessage("Login successful! Redirecting...");
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
      
    } catch (error) {
      console.error('Login OTP verification error:', error);
      const errorMessage = error.response?.data?.message || 'Invalid OTP. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await authAPI.forgotPassword({ email });
      setMessage("Password reset OTP sent to your email.");
      setStep(4);
    } catch (error) {
      console.error('Forgot password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send reset email.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await authAPI.resetPassword({
        email,
        otp,
        newPassword,
      });
      
      setMessage("Password reset successfully! You can now login with your new password.");
      
      setTimeout(() => {
        setStep(1);
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
      }, 2000);
      
    } catch (error) {
      console.error('Reset password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to reset password.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = () => (
    <form onSubmit={handleLogin}>
      <h2 style={{
        color: '#2d5016',
        textAlign: 'center',
        marginBottom: '25px',
        fontSize: '1.5rem',
        fontWeight: '600'
      }}>
        🔐 Welcome Back
      </h2>
      
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
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
        <input
          type="checkbox"
          id="rememberMe"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          style={{ marginRight: '8px' }}
        />
        <label htmlFor="rememberMe" style={{ fontSize: '14px', color: '#666' }}>
          Remember me for 30 days
        </label>
      </div>
      
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
        {loading ? 'Logging in...' : 'Login'}
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
      <GoogleSignInButton disabled={loading} />
      <FacebookSignInButton disabled={loading} />
      
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <button 
          type="button"
          onClick={() => setStep(3)}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: '#4a7c59', 
            textDecoration: 'underline',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          Forgot Password?
        </button>
      </div>
      
      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </form>
  );

  const renderOTPForm = () => (
    <form onSubmit={handleVerifyLoginOTP}>
      <h2 style={{
        color: '#2d5016',
        textAlign: 'center',
        marginBottom: '15px',
        fontSize: '1.5rem',
        fontWeight: '600'
      }}>
        📱 Verify Login
      </h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        We've sent a 6-digit code to <strong>{email}</strong>
      </p>
      
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
        {loading ? 'Verifying...' : 'Verify & Login'}
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
          ← Back to Login
        </button>
      </p>
    </form>
  );

  const renderForgotPasswordForm = () => (
    <form onSubmit={handleForgotPassword}>
      <h2 style={{
        color: '#2d5016',
        textAlign: 'center',
        marginBottom: '15px',
        fontSize: '1.5rem',
        fontWeight: '600'
      }}>
        🔑 Reset Password
      </h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Enter your email address and we'll send you a reset code.
      </p>
      
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
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        style={{ 
          width: '100%', 
          padding: '10px', 
          marginBottom: '15px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
      
      <button 
        type="submit" 
        disabled={loading}
        style={{ 
          width: '100%', 
          padding: '10px', 
          backgroundColor: loading ? '#ccc' : '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '10px'
        }}
      >
        {loading ? 'Sending...' : 'Send Reset Code'}
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
          ← Back to Login
        </button>
      </p>
    </form>
  );

  const renderResetPasswordForm = () => (
    <form onSubmit={handleResetPassword}>
      <h2 style={{
        color: '#2d5016',
        textAlign: 'center',
        marginBottom: '15px',
        fontSize: '1.5rem',
        fontWeight: '600'
      }}>
        🔒 New Password
      </h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Enter the OTP sent to <strong>{email}</strong> and your new password.
      </p>
      
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
      
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter 6-digit OTP"
        required
        maxLength="6"
        style={{ 
          width: '100%', 
          padding: '10px', 
          marginBottom: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          textAlign: 'center',
          letterSpacing: '2px'
        }}
      />
      
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New Password"
        required
        minLength="6"
        style={{ 
          width: '100%', 
          padding: '10px', 
          marginBottom: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
      
      <input
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirm New Password"
        required
        minLength="6"
        style={{ 
          width: '100%', 
          padding: '10px', 
          marginBottom: '15px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
      
      <button 
        type="submit" 
        disabled={loading}
        style={{ 
          width: '100%', 
          padding: '10px', 
          backgroundColor: loading ? '#ccc' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '10px'
        }}
      >
        {loading ? 'Resetting...' : 'Reset Password'}
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
          ← Back to Login
        </button>
      </p>
    </form>
  );

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
            Complete tasks, earn points, climb the leaderboard
          </p>
        </div>

        {step === 1 && renderLoginForm()}
        {step === 2 && renderOTPForm()}
        {step === 3 && renderForgotPasswordForm()}
        {step === 4 && renderResetPasswordForm()}
        
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

export default Login;

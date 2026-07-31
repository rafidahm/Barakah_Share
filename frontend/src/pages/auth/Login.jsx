import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Leaf, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';

// Image 2: Box exchange illustration (login side image)
import loginSideImg from '../../assets/login-side.png';

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const toast    = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [googleLoad, setGoogleLoad] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate async
    const result = await login(data.email, data.password);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome Back!', `Hello, ${result.user.name.split(' ')[0]}!`);
      navigate(redirectTo);
    } else {
      toast.error('Login Failed', result.error);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoad(true);
    await new Promise(r => setTimeout(r, 800));
    const result = await loginWithGoogle();
    setGoogleLoad(false);
    if (result.success) {
      toast.success('Logged in with Google!', `Welcome to BarakahShare!`);
      navigate(redirectTo);
    } else {
      toast.error('Google Sign-In Failed', result.error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#fff' }}>

      {/* ─── LEFT: Illustration panel (Image 2) ─────────────────── */}
      <div style={{
        flex: '0 0 48%',
        background: 'linear-gradient(160deg, #ccdfd9 0%, #90b4b0 60%, #74ab8b 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem 2.5rem',
        position: 'relative', overflow: 'hidden',
      }}
        className="login-side-panel"
      >
        {/* Blobs */}
        <div style={{
          position: 'absolute', top: '-15%', left: '-10%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', right: '-8%',
          width: 250, height: 250, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.3rem',
          color: '#fff', textDecoration: 'none', marginBottom: '2.5rem',
        }}>
          <span style={{
            width: 36, height: 36, borderRadius: '10px',
            background: 'rgba(255,255,255,0.3)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Leaf size={18} color="#fff" />
          </span>
          BarakahShare
        </Link>

        {/* Image 2 */}
        <div style={{
          width: '100%', maxWidth: 360,
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: '0 16px 48px rgba(26,46,41,0.2)',
          border: '3px solid rgba(255,255,255,0.3)',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(4px)',
          animation: 'float 4s ease-in-out infinite',
        }}>
          <img
            src={loginSideImg}
            alt="Hands exchanging a box — representing sharing and giving in the BarakahShare community"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Caption */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>
            Share. Give. Receive.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: 280 }}>
            Join hundreds of IIUC students already spreading barakah through resource sharing.
          </p>
        </div>

        {/* Hint for demo */}
        <div style={{
          marginTop: '1.75rem',
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(8px)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1.25rem',
          border: '1px solid rgba(255,255,255,0.3)',
          textAlign: 'center', maxWidth: 300,
        }}>
          <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem' }}>
            🔑 Demo credentials:
          </p>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem', lineHeight: 1.5 }}>
            <strong>Admin:</strong> admin@iiuc.ac.bd<br/>
            <strong>User:</strong> farhan@iiuc.ac.bd<br/>
            <strong>Password:</strong> password123
          </p>
        </div>
      </div>

      {/* ─── RIGHT: Login Form (Image 4 layout reference) ────────── */}
      <div style={{
        flex: 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '2rem',
        background: '#fff',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Heading */}
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '2rem', color: 'var(--color-text-dark)', marginBottom: '0.4rem' }}>
              Nice to see you again
            </h1>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
              Welcome back! Sign in to continue sharing.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Login</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--color-text-light)', pointerEvents: 'none',
                }} />
                <input
                  id="login-email"
                  type="email"
                  placeholder="Email or phone number"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  style={{ paddingLeft: '2.75rem' }}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' },
                  })}
                />
              </div>
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--color-text-light)', pointerEvents: 'none',
                }} />
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  style={{ paddingLeft: '2.75rem', paddingRight: '3rem' }}
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
                />
                <button
                  type="button"
                  id="toggle-password-btn"
                  onClick={() => setShowPass(p => !p)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--color-text-light)',
                    cursor: 'pointer', padding: 0,
                  }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            {/* Remember me + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.875rem', color: 'var(--color-text-mid)' }}>
                <input
                  id="remember-me"
                  type="checkbox"
                  style={{ accentColor: 'var(--color-green-main)', width: 15, height: 15 }}
                />
                Remember me
              </label>
              <Link to="/contact" style={{ fontSize: '0.875rem', color: 'var(--color-green-main)', fontWeight: 600 }}>
                Forgot password?
              </Link>
            </div>

            {/* Sign In button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginBottom: '1.25rem', borderRadius: 'var(--radius-md)' }}
            >
              {loading ? <><span className="spinner" /> Signing in...</> : 'Sign in'}
            </button>

            {/* Divider */}
            <div className="divider" style={{ marginBottom: '1.25rem' }}>Or sign in with</div>

            {/* Google button */}
            <button
              id="google-login-btn"
              type="button"
              onClick={handleGoogle}
              disabled={googleLoad}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                padding: '0.85rem', borderRadius: 'var(--radius-md)',
                background: 'var(--color-text-dark)', color: '#fff',
                border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600,
                transition: 'all 0.2s', fontFamily: 'Inter',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#2d4a42'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--color-text-dark)'}
            >
              {googleLoad ? <span className="spinner" /> : (
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Or sign in with Google
            </button>
          </form>

          {/* Sign up link */}
          <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
            Don't have an account?{' '}
            <Link id="goto-register-link" to="/register" style={{ color: 'var(--color-green-main)', fontWeight: 700 }}>
              Sign up now
            </Link>
          </p>
        </div>
      </div>

      {/* Mobile responsive */}
      <style>{`
        .login-side-panel { display: flex !important; }
        @media (max-width: 768px) {
          .login-side-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}

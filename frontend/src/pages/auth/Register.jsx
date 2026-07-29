import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Leaf, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import loginSideImg from '../../assets/login-side.png';

export default function Register() {
  const { register: registerUser, loginWithGoogle } = useAuth();
  const toast    = useToast();
  const navigate = useNavigate();

  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [googleLoad, setGoogleLoad] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const result = registerUser(data.name, data.email, data.password);
    setLoading(false);
    if (result.success) {
      toast.success('Account Created!', `Welcome to BarakahShare, ${result.user.name.split(' ')[0]}!`);
      navigate('/dashboard');
    } else {
      toast.error('Registration Failed', result.error);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoad(true);
    await new Promise(r => setTimeout(r, 800));
    const { loginWithGoogle: gLogin } = useAuth();
    setGoogleLoad(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#fff' }}>

      {/* ─── LEFT: Illustration panel ──────────────────────────── */}
      <div style={{
        flex: '0 0 48%',
        background: 'linear-gradient(160deg, #ccdfd9 0%, #90b4b0 60%, #74ab8b 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '3rem 2.5rem',
        position: 'relative', overflow: 'hidden',
      }}
        className="register-side-panel"
      >
        <div style={{ position: 'absolute', top: '-15%', left: '-10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-8%', width: 250, height: 250, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', pointerEvents: 'none' }} />

        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.3rem', color: '#fff', textDecoration: 'none', marginBottom: '2.5rem' }}>
          <span style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={18} color="#fff" />
          </span>
          BarakahShare
        </Link>

        <div style={{ width: '100%', maxWidth: 360, borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: '0 16px 48px rgba(26,46,41,0.2)', border: '3px solid rgba(255,255,255,0.3)', animation: 'float 4s ease-in-out infinite' }}>
          <img src={loginSideImg} alt="Hands exchanging a box — BarakahShare community sharing" style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>
            Join the Community
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: 280 }}>
            Create your account and start sharing resources with your fellow students today.
          </p>
        </div>
      </div>

      {/* ─── RIGHT: Register Form ───────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#fff' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: '2rem', color: 'var(--color-text-dark)', marginBottom: '0.4rem' }}>
              Create your account
            </h1>
            <p style={{ color: 'var(--color-text-light)', fontSize: '0.9rem' }}>
              Join BarakahShare and start spreading barakah!
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)', pointerEvents: 'none' }} />
                <input
                  id="reg-name"
                  type="text"
                  placeholder="Your full name"
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  style={{ paddingLeft: '2.75rem' }}
                  {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
                />
              </div>
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)', pointerEvents: 'none' }} />
                <input
                  id="reg-email"
                  type="email"
                  placeholder="your@iiuc.ac.bd"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  style={{ paddingLeft: '2.75rem' }}
                  {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Enter a valid email' } })}
                />
              </div>
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)', pointerEvents: 'none' }} />
                <input
                  id="reg-password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  style={{ paddingLeft: '2.75rem', paddingRight: '3rem' }}
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'At least 6 characters' } })}
                />
                <button type="button" id="toggle-reg-pass-btn" onClick={() => setShowPass(p => !p)} aria-label="Toggle password" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-light)', cursor: 'pointer', padding: 0 }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-light)', pointerEvents: 'none' }} />
                <input
                  id="reg-confirm"
                  type="password"
                  placeholder="Repeat your password"
                  className={`form-input ${errors.confirm ? 'error' : ''}`}
                  style={{ paddingLeft: '2.75rem' }}
                  {...register('confirm', {
                    required: 'Please confirm your password',
                    validate: v => v === password || 'Passwords do not match',
                  })}
                />
              </div>
              {errors.confirm && <p className="form-error">{errors.confirm.message}</p>}
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem', marginBottom: '1.25rem', borderRadius: 'var(--radius-md)' }}
            >
              {loading ? <><span className="spinner" /> Creating account...</> : 'Create Account'}
            </button>

            <div className="divider" style={{ marginBottom: '1.25rem' }}>Or continue with</div>

            <button
              id="google-register-btn"
              type="button"
              onClick={handleGoogle}
              disabled={googleLoad}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--color-text-dark)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, transition: 'all 0.2s', fontFamily: 'Inter' }}
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
              Continue with Google
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--color-text-light)' }}>
            Already have an account?{' '}
            <Link id="goto-login-link" to="/login" style={{ color: 'var(--color-green-main)', fontWeight: 700 }}>
              Sign in now
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .register-side-panel { display: none !important; } }
      `}</style>
    </div>
  );
}

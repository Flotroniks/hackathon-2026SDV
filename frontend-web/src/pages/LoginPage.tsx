import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertBanner } from '../components/common/AlertBanner';

export function LoginPage() {
  const { login, changeFirstLoginPassword, bootstrapStatus, bootstrapRegister } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bootstrapPassword, setBootstrapPassword] = useState('');
  const [bootstrapPasswordConfirm, setBootstrapPasswordConfirm] = useState('');
  const [isBootstrapChecking, setIsBootstrapChecking] = useState(true);
  const [isBootstrapFlow, setIsBootstrapFlow] = useState(false);
  const [isFirstLoginFlow, setIsFirstLoginFlow] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    bootstrapStatus()
      .then((required) => {
        setIsBootstrapFlow(required);
      })
      .catch(() => {
        setError('Unable to load authentication state');
      })
      .finally(() => setIsBootstrapChecking(false));
  }, [bootstrapStatus]);

  async function submitLogin(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await login(email, password);
      if (response.passwordChangeRequired) {
        setCurrentPassword(password);
        setPassword('');
        setIsFirstLoginFlow(true);
        return;
      }
      navigate('/dashboard');
    } catch {
      setError('Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitPasswordChange(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must contain at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await changeFirstLoginPassword(email, currentPassword, newPassword);
      navigate('/dashboard');
    } catch {
      setError('Unable to change password');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitBootstrap(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    if (bootstrapPassword.length < 8) {
      setError('Password must contain at least 8 characters');
      return;
    }
    if (bootstrapPassword !== bootstrapPasswordConfirm) {
      setError('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await bootstrapRegister(email, bootstrapPassword, fullName);
      navigate('/dashboard');
    } catch {
      setError('Unable to create first admin account');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isBootstrapChecking) {
    return (
      <div className="hero min-h-screen">
        <div className="hero-content w-full max-w-md rounded-3xl bg-base-100 p-8 text-center shadow-panel">
          <p className="text-base-content/70">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hero min-h-screen">
      <div className="hero-content w-full max-w-md rounded-3xl bg-base-100 p-8 shadow-panel">
        <div className="w-full space-y-4">
          <h1 className="text-center text-3xl font-bold">Carbon Platform</h1>
          <p className="text-center text-sm text-base-content/70">
            {isBootstrapFlow
              ? 'First connection: create the first admin account'
              : isFirstLoginFlow
                ? 'First connection: choose your admin password'
                : 'Hackathon MVP login'}
          </p>
          {error ? <AlertBanner type="error" message={error} /> : null}
          {isBootstrapFlow ? (
            <form className="space-y-3" onSubmit={submitBootstrap}>
              <input
                className="input input-bordered w-full"
                type="text"
                placeholder="Full name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
              />
              <input
                className="input input-bordered w-full"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <input
                className="input input-bordered w-full"
                type="password"
                placeholder="Password"
                value={bootstrapPassword}
                onChange={(event) => setBootstrapPassword(event.target.value)}
                minLength={8}
                required
              />
              <input
                className="input input-bordered w-full"
                type="password"
                placeholder="Confirm password"
                value={bootstrapPasswordConfirm}
                onChange={(event) => setBootstrapPasswordConfirm(event.target.value)}
                minLength={8}
                required
              />
              <button className={`btn btn-primary w-full ${isSubmitting ? 'btn-disabled' : ''}`} type="submit">
                Create Admin Account
              </button>
            </form>
          ) : isFirstLoginFlow ? (
            <form className="space-y-3" onSubmit={submitPasswordChange}>
              <input className="input input-bordered w-full" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              <input
                className="input input-bordered w-full"
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                minLength={8}
                required
              />
              <input
                className="input input-bordered w-full"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                minLength={8}
                required
              />
              <button className={`btn btn-primary w-full ${isSubmitting ? 'btn-disabled' : ''}`} type="submit">
                Save Password
              </button>
            </form>
          ) : (
            <form className="space-y-3" onSubmit={submitLogin}>
              <input className="input input-bordered w-full" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              <input className="input input-bordered w-full" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              <button className={`btn btn-primary w-full ${isSubmitting ? 'btn-disabled' : ''}`} type="submit">
                Login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

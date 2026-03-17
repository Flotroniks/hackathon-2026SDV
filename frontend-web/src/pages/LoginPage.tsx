import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { AlertBanner } from '../components/common/AlertBanner';
import { changeAppLanguage } from '../i18n';

export function LoginPage() {
  const { t, i18n } = useTranslation();
  const { login, changeFirstLoginPassword, bootstrapStatus, bootstrapRegister } = useAuth();
  const navigate = useNavigate();
  const currentLanguage = i18n.language.startsWith('fr') ? 'fr' : 'en';
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
        setError(t('login.errors.loadState'));
      })
      .finally(() => setIsBootstrapChecking(false));
  }, [bootstrapStatus, t]);

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
      setError(t('login.errors.invalidCredentials'));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitPasswordChange(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError(t('login.errors.passwordMinLength'));
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(t('login.errors.passwordMismatch'));
      return;
    }

    setIsSubmitting(true);
    try {
      await changeFirstLoginPassword(email, currentPassword, newPassword);
      navigate('/dashboard');
    } catch {
      setError(t('login.errors.changePassword'));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitBootstrap(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    if (bootstrapPassword.length < 8) {
      setError(t('login.errors.passwordMinLength'));
      return;
    }
    if (bootstrapPassword !== bootstrapPasswordConfirm) {
      setError(t('login.errors.passwordMismatch'));
      return;
    }

    setIsSubmitting(true);
    try {
      await bootstrapRegister(email, bootstrapPassword, fullName);
      navigate('/dashboard');
    } catch {
      setError(t('login.errors.createFirstAdmin'));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isBootstrapChecking) {
    return (
      <div className="hero min-h-screen">
        <div className="hero-content w-full max-w-md rounded-3xl bg-base-100 p-8 text-center shadow-panel">
          <p className="text-base-content/70">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="hero min-h-screen">
      <div className="hero-content w-full max-w-md rounded-3xl bg-base-100 p-8 shadow-panel">
        <div className="w-full space-y-4">
          <div className="flex justify-end">
            <label className="form-control w-28">
              <span className="sr-only">{t('common.language')}</span>
              <select
                className="select select-bordered select-sm"
                value={currentLanguage}
                onChange={(event) => changeAppLanguage(event.target.value as 'fr' | 'en')}
              >
                <option value="fr">{t('common.french')}</option>
                <option value="en">{t('common.english')}</option>
              </select>
            </label>
          </div>
          <h1 className="text-center text-3xl font-bold">{t('navbar.brand')}</h1>
          <p className="text-center text-sm text-base-content/70">
            {isBootstrapFlow
              ? t('login.subtitle.bootstrap')
              : isFirstLoginFlow
                ? t('login.subtitle.firstPassword')
                : t('login.subtitle.default')}
          </p>
          {error ? <AlertBanner type="error" message={error} /> : null}
          {isBootstrapFlow ? (
            <form className="space-y-3" onSubmit={submitBootstrap}>
                <input
                  className="input input-bordered w-full"
                  type="text"
                  placeholder={t('login.fields.fullName')}
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
              />
                <input
                  className="input input-bordered w-full"
                  type="email"
                  placeholder={t('login.fields.email')}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
              />
                <input
                  className="input input-bordered w-full"
                  type="password"
                  placeholder={t('login.fields.password')}
                  value={bootstrapPassword}
                  onChange={(event) => setBootstrapPassword(event.target.value)}
                  minLength={8}
                required
              />
                <input
                  className="input input-bordered w-full"
                  type="password"
                  placeholder={t('login.fields.confirmPassword')}
                  value={bootstrapPasswordConfirm}
                  onChange={(event) => setBootstrapPasswordConfirm(event.target.value)}
                  minLength={8}
                required
              />
              <button className={`btn btn-primary w-full ${isSubmitting ? 'btn-disabled' : ''}`} type="submit">
                {t('login.actions.createAdmin')}
              </button>
            </form>
          ) : isFirstLoginFlow ? (
            <form className="space-y-3" onSubmit={submitPasswordChange}>
              <input className="input input-bordered w-full" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                <input
                  className="input input-bordered w-full"
                  type="password"
                  placeholder={t('login.fields.newPassword')}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  minLength={8}
                required
              />
                <input
                  className="input input-bordered w-full"
                  type="password"
                  placeholder={t('login.fields.confirmNewPassword')}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  minLength={8}
                required
              />
              <button className={`btn btn-primary w-full ${isSubmitting ? 'btn-disabled' : ''}`} type="submit">
                {t('login.actions.savePassword')}
              </button>
            </form>
          ) : (
            <form className="space-y-3" onSubmit={submitLogin}>
              <input className="input input-bordered w-full" type="email" placeholder={t('login.fields.email')} value={email} onChange={(event) => setEmail(event.target.value)} required />
              <input className="input input-bordered w-full" type="password" placeholder={t('login.fields.password')} value={password} onChange={(event) => setPassword(event.target.value)} required />
              <button className={`btn btn-primary w-full ${isSubmitting ? 'btn-disabled' : ''}`} type="submit">
                {t('login.actions.login')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

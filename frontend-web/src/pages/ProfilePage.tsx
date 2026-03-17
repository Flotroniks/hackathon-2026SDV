import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createUser, fetchUsers } from '../api/userApi';
import { AlertBanner } from '../components/common/AlertBanner';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import type { AuthUser, UserRole } from '../types/auth';

interface NewUserFormState {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

const initialFormState: NewUserFormState = {
  fullName: '',
  email: '',
  password: '',
  role: 'USER',
};

export function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<NewUserFormState>(initialFormState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingAdminConfirm, setPendingAdminConfirm] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  function getRoleLabel(role: UserRole) {
    return role === 'ADMIN' ? t('profile.roles.admin') : t('profile.roles.user');
  }

  async function loadUsers() {
    if (!isAdmin) {
      return;
    }
    setIsLoadingUsers(true);
    try {
      const response = await fetchUsers();
      setUsers(response);
    } catch {
      setError(t('profile.errors.loadUsers'));
    } finally {
      setIsLoadingUsers(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, [isAdmin]);

  async function submitCreateUser() {
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    try {
      await createUser({
        email: form.email.trim(),
        password: form.password,
        fullName: form.fullName.trim(),
        role: form.role,
      });
      setForm(initialFormState);
      setSuccess(t('profile.success.userCreated', { role: getRoleLabel(form.role) }));
      await loadUsers();
    } catch {
      setError(t('profile.errors.createUser'));
    } finally {
      setIsSubmitting(false);
      setPendingAdminConfirm(false);
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (form.password.length < 8) {
      setError(t('profile.errors.passwordMinLength'));
      return;
    }

    if (form.role === 'ADMIN') {
      setPendingAdminConfirm(true);
      const modal = document.getElementById('confirm-create-admin-modal') as HTMLDialogElement | null;
      modal?.showModal();
      return;
    }

    void submitCreateUser();
  }

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="card bg-base-200 shadow-sm">
        <div className="card-body">
          <h1 className="card-title">{t('profile.title')}</h1>
          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <p><span className="font-semibold">{t('profile.labels.name')}:</span> {user.fullName}</p>
            <p><span className="font-semibold">{t('profile.labels.email')}:</span> {user.email}</p>
            <p><span className="font-semibold">{t('profile.labels.role')}:</span> {getRoleLabel(user.role)}</p>
            <p><span className="font-semibold">{t('profile.labels.status')}:</span> {user.active ? t('common.status.active') : t('common.status.inactive')}</p>
          </div>
        </div>
      </div>

      {!isAdmin ? (
        <AlertBanner type="info" message={t('profile.adminOnly')} />
      ) : (
        <>
          {error ? <AlertBanner type="error" message={error} /> : null}
          {success ? <AlertBanner type="success" message={success} /> : null}

          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">{t('profile.createUser.title')}</h2>
              <p className="text-sm text-base-content/70">
                {t('profile.createUser.subtitle')}
              </p>
              <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={onSubmit}>
                <input
                  className="input input-bordered"
                  placeholder={t('profile.createUser.fields.fullName')}
                  value={form.fullName}
                  onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                  required
                />
                <input
                  className="input input-bordered"
                  type="email"
                  placeholder={t('profile.createUser.fields.email')}
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
                <input
                  className="input input-bordered"
                  type="password"
                  placeholder={t('profile.createUser.fields.password')}
                  minLength={8}
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  required
                />
                <select
                  className="select select-bordered"
                  value={form.role}
                  onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as UserRole }))}
                >
                  <option value="USER">{t('profile.roles.user')}</option>
                  <option value="ADMIN">{t('profile.roles.admin')}</option>
                </select>
                <div className="md:col-span-2">
                  <button className={`btn btn-primary ${isSubmitting ? 'btn-disabled' : ''}`} type="submit">
                    {t('profile.createUser.actions.create', { role: getRoleLabel(form.role) })}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <h2 className="card-title">{t('profile.users.title')}</h2>
                <button className="btn btn-sm btn-outline" onClick={() => void loadUsers()}>
                  {t('common.actions.refresh')}
                </button>
              </div>
              {isLoadingUsers ? (
                <LoadingSpinner />
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>{t('profile.users.table.name')}</th>
                        <th>{t('profile.users.table.email')}</th>
                        <th>{t('profile.users.table.role')}</th>
                        <th>{t('profile.users.table.status')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((item) => (
                        <tr key={item.id}>
                          <td>{item.fullName}</td>
                          <td>{item.email}</td>
                          <td>{getRoleLabel(item.role)}</td>
                          <td>{item.active ? t('common.status.active') : t('common.status.inactive')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <dialog id="confirm-create-admin-modal" className="modal">
            <div className="modal-box">
              <h3 className="text-lg font-bold">{t('profile.confirmAdmin.title')}</h3>
              <p className="py-3 text-sm">
                {t('profile.confirmAdmin.messageStart')} <span className="font-semibold">{getRoleLabel('ADMIN')}</span> {t('profile.confirmAdmin.messageFor')}
                {' '}
                <span className="font-semibold">{form.email || t('profile.confirmAdmin.thisUser')}</span>.
              </p>
              <p className="text-sm text-base-content/70">
                {t('profile.confirmAdmin.warning')}
              </p>
              <div className="modal-action">
                <form method="dialog">
                  <button
                    className="btn"
                    onClick={() => {
                      setPendingAdminConfirm(false);
                    }}
                  >
                    {t('common.cancel')}
                  </button>
                </form>
                <button
                  className={`btn btn-error text-white ${isSubmitting ? 'btn-disabled' : ''}`}
                  onClick={() => {
                    if (!pendingAdminConfirm) {
                      return;
                    }
                    void submitCreateUser();
                    const modal = document.getElementById('confirm-create-admin-modal') as HTMLDialogElement | null;
                    modal?.close();
                  }}
                >
                  {t('profile.confirmAdmin.confirm')}
                </button>
              </div>
            </div>
          </dialog>
        </>
      )}
    </div>
  );
}

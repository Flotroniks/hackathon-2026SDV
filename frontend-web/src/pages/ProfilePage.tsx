import { useEffect, useState } from 'react';
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
  const { user } = useAuth();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<NewUserFormState>(initialFormState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingAdminConfirm, setPendingAdminConfirm] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  async function loadUsers() {
    if (!isAdmin) {
      return;
    }
    setIsLoadingUsers(true);
    try {
      const response = await fetchUsers();
      setUsers(response);
    } catch {
      setError('Unable to load users');
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
      setSuccess(`User created (${form.role})`);
      await loadUsers();
    } catch {
      setError('Unable to create user');
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
      setError('Password must contain at least 8 characters');
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
          <h1 className="card-title">Profile</h1>
          <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
            <p><span className="font-semibold">Name:</span> {user.fullName}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Role:</span> {user.role}</p>
            <p><span className="font-semibold">Status:</span> {user.active ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
      </div>

      {!isAdmin ? (
        <AlertBanner type="info" message="User management is available only for admins." />
      ) : (
        <>
          {error ? <AlertBanner type="error" message={error} /> : null}
          {success ? <AlertBanner type="success" message={success} /> : null}

          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <h2 className="card-title">Create user</h2>
              <p className="text-sm text-base-content/70">
                You can create normal users or admins. Creating an admin requires explicit confirmation.
              </p>
              <form className="grid grid-cols-1 gap-3 md:grid-cols-2" onSubmit={onSubmit}>
                <input
                  className="input input-bordered"
                  placeholder="Full name"
                  value={form.fullName}
                  onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
                  required
                />
                <input
                  className="input input-bordered"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                />
                <input
                  className="input input-bordered"
                  type="password"
                  placeholder="Temporary password"
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
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <div className="md:col-span-2">
                  <button className={`btn btn-primary ${isSubmitting ? 'btn-disabled' : ''}`} type="submit">
                    Create {form.role}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card bg-base-200 shadow-sm">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <h2 className="card-title">Users</h2>
                <button className="btn btn-sm btn-outline" onClick={() => void loadUsers()}>
                  Refresh
                </button>
              </div>
              {isLoadingUsers ? (
                <LoadingSpinner />
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((item) => (
                        <tr key={item.id}>
                          <td>{item.fullName}</td>
                          <td>{item.email}</td>
                          <td>{item.role}</td>
                          <td>{item.active ? 'Active' : 'Inactive'}</td>
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
              <h3 className="text-lg font-bold">Confirm admin creation</h3>
              <p className="py-3 text-sm">
                You are about to create an <span className="font-semibold">ADMIN</span> account for
                {' '}
                <span className="font-semibold">{form.email || 'this user'}</span>.
              </p>
              <p className="text-sm text-base-content/70">
                This user will have full access to user management and platform settings.
              </p>
              <div className="modal-action">
                <form method="dialog">
                  <button
                    className="btn"
                    onClick={() => {
                      setPendingAdminConfirm(false);
                    }}
                  >
                    Cancel
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
                  Confirm ADMIN creation
                </button>
              </div>
            </div>
          </dialog>
        </>
      )}
    </div>
  );
}

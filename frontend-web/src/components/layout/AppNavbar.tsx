import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/sites', label: 'Sites' },
  { to: '/comparison', label: 'Comparison' },
  { to: '/profile', label: 'Profile' },
];

export function AppNavbar() {
  const { user, logout } = useAuth();

  return (
    <div className="navbar rounded-2xl bg-neutral text-neutral-content shadow-panel">
      <div className="navbar-start px-2">
        <span className="text-lg font-semibold tracking-wide">Carbon Platform</span>
      </div>
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal gap-1 px-1">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end gap-3 px-2">
        <div className="text-right text-xs opacity-80">
          <div>{user?.fullName}</div>
          <div>{user?.role}</div>
        </div>
        <button className="btn btn-sm btn-outline text-neutral-content" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

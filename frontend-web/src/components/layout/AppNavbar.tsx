import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { changeAppLanguage } from '../../i18n';

const links = [
  { to: '/dashboard', labelKey: 'navbar.links.dashboard' },
  { to: '/sites', labelKey: 'navbar.links.sites' },
  { to: '/comparison', labelKey: 'navbar.links.comparison' },
  { to: '/profile', labelKey: 'navbar.links.profile' },
];

export function AppNavbar() {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const currentLanguage = i18n.language.startsWith('fr') ? 'fr' : 'en';

  return (
    <div className="navbar rounded-2xl bg-neutral text-neutral-content shadow-panel">
      <div className="navbar-start px-2">
        <span className="text-lg font-semibold tracking-wide">{t('navbar.brand')}</span>
      </div>
      <div className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal gap-1 px-1">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {t(link.labelKey)}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end gap-3 px-2">
        <div className="text-right text-xs opacity-80">
          <div>{user?.fullName}</div>
          <div>
            {user?.role === 'ADMIN' ? t('profile.roles.admin') : user?.role === 'USER' ? t('profile.roles.user') : user?.role}
          </div>
        </div>
        <label className="form-control w-28">
          <span className="sr-only">{t('common.language')}</span>
          <select
            className="select select-bordered select-sm bg-neutral text-neutral-content"
            value={currentLanguage}
            onChange={(event) => changeAppLanguage(event.target.value as 'fr' | 'en')}
          >
            <option value="fr">{t('common.french')}</option>
            <option value="en">{t('common.english')}</option>
          </select>
        </label>
        <button className="btn btn-sm btn-outline text-neutral-content" onClick={logout}>
          {t('navbar.logout')}
        </button>
      </div>
    </div>
  );
}

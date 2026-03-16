import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/common/ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';
import { ComparisonPage } from '../pages/ComparisonPage';
import { Dashboard } from '../pages/Dashboard';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SiteFormPage } from '../pages/SiteFormPage';
import { SiteResultPage } from '../pages/SiteResultPage';
import { SitesPage } from '../pages/SitesPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sites" element={<SitesPage />} />
          <Route path="/sites/new" element={<SiteFormPage />} />
          <Route path="/sites/:siteId/edit" element={<SiteFormPage />} />
          <Route path="/sites/:siteId" element={<SiteResultPage />} />
          <Route path="/comparison" element={<ComparisonPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

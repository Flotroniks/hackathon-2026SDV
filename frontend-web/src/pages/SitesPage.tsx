import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { archiveSite, fetchSites } from '../api/siteApi';
import type { SiteListItemResponse } from '../types/site';
import { formatDateTime, formatKg, formatNumber } from '../utils/formatters';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ConfirmModal } from '../components/common/ConfirmModal';

export function SitesPage() {
  const [sites, setSites] = useState<SiteListItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const navigate = useNavigate();

  function loadSites() {
    setIsLoading(true);
    fetchSites()
      .then((response) => setSites(response.content))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    loadSites();
  }, []);

  async function onArchive() {
    if (!selectedSiteId) {
      return;
    }
    await archiveSite(selectedSiteId);
    loadSites();
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sites</h1>
        <Link to="/sites/new" className="btn btn-primary">
          + New site
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl bg-base-200">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>City</th>
              <th>Area</th>
              <th>Employees</th>
              <th>Latest CO2</th>
              <th>Updated</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr key={site.id}>
                <td>{site.code}</td>
                <td>{site.name}</td>
                <td>{site.city}</td>
                <td>{formatNumber(site.totalAreaM2)} m2</td>
                <td>{formatNumber(site.employeeCount)}</td>
                <td>{formatKg(site.latestTotalEmissionsKgCo2e)}</td>
                <td>{formatDateTime(site.latestCalculatedAt)}</td>
                <td className="space-x-2">
                  <button className="btn btn-xs" onClick={() => navigate(`/sites/${site.id}`)}>
                    View
                  </button>
                  <button className="btn btn-xs btn-outline" onClick={() => navigate(`/sites/${site.id}/edit`)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-xs btn-error text-white"
                    onClick={() => {
                      setSelectedSiteId(site.id);
                      const modal = document.getElementById('archive-site-modal') as HTMLDialogElement | null;
                      modal?.showModal();
                    }}
                  >
                    Archive
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ConfirmModal
        id="archive-site-modal"
        title="Archive site"
        message="This action hides the site from active lists but preserves calculation history."
        actionLabel="Archive"
        onConfirm={onArchive}
      />
    </div>
  );
}

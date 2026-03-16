import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createSite, fetchSite, updateSite } from '../api/siteApi';
import { SiteForm } from '../components/forms/SiteForm';
import { AlertBanner } from '../components/common/AlertBanner';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { emptySiteRequest, type SiteRequest } from '../types/site';

export function SiteFormPage() {
  const params = useParams<{ siteId: string }>();
  const isEdit = Boolean(params.siteId);
  const navigate = useNavigate();
  const [initialValue, setInitialValue] = useState<SiteRequest>(emptySiteRequest);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit || !params.siteId) {
      return;
    }
    fetchSite(params.siteId)
      .then((site) => {
        setInitialValue({
          name: site.name,
          code: site.code,
          address: site.address,
          city: site.city,
          country: site.country,
          totalAreaM2: site.totalAreaM2,
          parkingSpaces: site.parkingSpaces,
          annualEnergyConsumptionKwh: site.annualEnergyConsumptionKwh,
          energySource: site.energySource,
          employeeCount: site.employeeCount,
          materials: site.materials.map((material) => ({
            materialType: material.materialType,
            materialLabel: material.materialLabel,
            quantity: material.quantity,
            unit: material.unit,
          })),
        });
      })
      .finally(() => setIsLoading(false));
  }, [isEdit, params.siteId]);

  async function handleSubmit(payload: SiteRequest) {
    setError('');
    try {
      if (isEdit && params.siteId) {
        await updateSite(params.siteId, payload);
        navigate(`/sites/${params.siteId}`);
        return;
      }
      const created = await createSite(payload);
      navigate(`/sites/${created.id}`);
    } catch {
      setError('Unable to save site');
    }
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{isEdit ? 'Edit site' : 'Create site'}</h1>
      {error ? <AlertBanner type="error" message={error} /> : null}
      <SiteForm initialValue={initialValue} onSubmit={handleSubmit} submitLabel={isEdit ? 'Update site' : 'Create site'} />
    </div>
  );
}

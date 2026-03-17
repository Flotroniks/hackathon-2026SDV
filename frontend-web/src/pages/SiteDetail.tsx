import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import client from '../api/client';
import {
  ExploitationForm,
  type ExploitationFormValues,
  type ExploitationPayload,
} from '../components/forms/ExploitationForm';

interface SiteDetailModel {
  id: number;
  name: string;
  code: string;
  city: string;
  country: string;
  totalAreaM2: number;
}

const MOCK_SITE: SiteDetailModel = {
  id: 1,
  name: 'Rennes Nord',
  code: 'RNS-NORD',
  city: 'Rennes',
  country: 'France',
  totalAreaM2: 5400,
};

const MOCK_EXISTING_EXPLOITATION_DATA: Partial<ExploitationFormValues> = {
  annualEnergyConsumptionKwh: 120000,
  energyType: 'electricity',
  employeeCount: 85,
  occupancyRate: 90,
  parkingSpaces: 40,
  commutingDistanceKmPerDayPerEmployee: 18,
  itEquipmentCount: 95,
  estimatedItConsumptionKwh: 12000,
  comment: 'Site principal avec forte occupation en semaine',
};

export async function saveSiteExploitationData(payload: ExploitationPayload) {
  // Exemple d'appel API backend pour enregistrer les donnees d'exploitation d'un site
  const { data } = await client.post(`/sites/${payload.siteId}/operations`, payload);
  return data;
}

export function SiteDetail() {
  const { t } = useTranslation();
  const [site] = useState<SiteDetailModel>(MOCK_SITE);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const initialValues = useMemo(() => {
    if (!isEditMode) {
      return undefined;
    }
    return MOCK_EXISTING_EXPLOITATION_DATA;
  }, [isEditMode]);

  async function handleSubmit(formData: ExploitationPayload) {
    setErrorMessage('');
    setSuccessMessage('');
    setIsSaving(true);

    try {
      const payloadToSend: ExploitationPayload = {
        siteId: formData.siteId,
        annualEnergyConsumptionKwh: formData.annualEnergyConsumptionKwh,
        energyType: formData.energyType,
        employeeCount: formData.employeeCount,
        occupancyRate: formData.occupancyRate,
        parkingSpaces: formData.parkingSpaces,
        commutingDistanceKmPerDayPerEmployee: formData.commutingDistanceKmPerDayPerEmployee,
        itEquipmentCount: formData.itEquipmentCount,
        estimatedItConsumptionKwh: formData.estimatedItConsumptionKwh,
        comment: formData.comment,
      };

      await saveSiteExploitationData(payloadToSend);
      setSuccessMessage(t('exploitationForm.messages.saveSuccess'));

      if (!isEditMode) {
        setIsEditMode(true);
      }
    } catch {
      setErrorMessage(t('exploitationForm.messages.saveError'));
      throw new Error('save_failed');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6">
      <div className="card border border-base-300 bg-base-100 shadow-sm">
        <div className="card-body">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{site.name}</h1>
              <p className="text-sm text-base-content/70">
                {t('siteDetailExample.meta.code')}: {site.code} | {site.city}, {site.country}
              </p>
              <p className="text-sm text-base-content/70">{t('siteDetailExample.meta.area')}: {site.totalAreaM2} {t('common.units.m2')}</p>
            </div>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setIsEditMode((prev) => !prev)}
            >
              {isEditMode ? t('common.creation') : t('common.edition')}
            </button>
          </div>
        </div>
      </div>

      {successMessage ? (
        <div className="alert alert-success">
          <span>{successMessage}</span>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="alert alert-error">
          <span>{errorMessage}</span>
        </div>
      ) : null}

      {isSaving ? (
        <div className="alert">
          <span>{t('common.saving')}</span>
        </div>
      ) : null}

      <ExploitationForm site={site} initialValues={initialValues} onSubmit={handleSubmit} />
    </div>
  );
}

export default SiteDetail;

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { energySourceOptions, type SiteRequest } from '../../types/site';
import { MaterialFields } from './MaterialFields';

interface SiteFormProps {
  initialValue: SiteRequest;
  onSubmit: (payload: SiteRequest) => Promise<void>;
  submitLabel: string;
}

export function SiteForm({ initialValue, onSubmit, submitLabel }: SiteFormProps) {
  const { t } = useTranslation();
  const [form, setForm] = useState<SiteRequest>(initialValue);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <input className="input input-bordered" placeholder={t('siteForm.fields.name')} value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <input className="input input-bordered" placeholder={t('siteForm.fields.code')} value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })} required />
        <input className="input input-bordered" placeholder={t('siteForm.fields.address')} value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
        <input className="input input-bordered" placeholder={t('siteForm.fields.city')} value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
        <input className="input input-bordered" placeholder={t('siteForm.fields.country')} value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} required />
        <select className="select select-bordered" value={form.energySource} onChange={(event) => setForm({ ...form, energySource: event.target.value as SiteRequest['energySource'] })}>
          {energySourceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {t(`siteForm.energySource.${option.value}`)}
            </option>
          ))}
        </select>
        <input className="input input-bordered" type="number" min={1} step="0.01" placeholder={t('siteForm.fields.area')} value={form.totalAreaM2} onChange={(event) => setForm({ ...form, totalAreaM2: Number(event.target.value) })} required />
        <input className="input input-bordered" type="number" min={0} placeholder={t('siteForm.fields.parkingSpaces')} value={form.parkingSpaces} onChange={(event) => setForm({ ...form, parkingSpaces: Number(event.target.value) })} />
        <input className="input input-bordered" type="number" min={0} step="0.01" placeholder={t('siteForm.fields.annualEnergy')} value={form.annualEnergyConsumptionKwh} onChange={(event) => setForm({ ...form, annualEnergyConsumptionKwh: Number(event.target.value) })} required />
        <input className="input input-bordered" type="number" min={0} placeholder={t('siteForm.fields.employeeCount')} value={form.employeeCount} onChange={(event) => setForm({ ...form, employeeCount: Number(event.target.value) })} />
      </div>
      <MaterialFields materials={form.materials} onChange={(materials) => setForm({ ...form, materials })} />
      <button className={`btn btn-primary ${isSubmitting ? 'btn-disabled' : ''}`} type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

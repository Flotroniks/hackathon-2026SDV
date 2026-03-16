import { useState } from 'react';
import { energySourceOptions, type SiteRequest } from '../../types/site';
import { MaterialFields } from './MaterialFields';

interface SiteFormProps {
  initialValue: SiteRequest;
  onSubmit: (payload: SiteRequest) => Promise<void>;
  submitLabel: string;
}

export function SiteForm({ initialValue, onSubmit, submitLabel }: SiteFormProps) {
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
        <input className="input input-bordered" placeholder="Site name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        <input className="input input-bordered" placeholder="Code" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value.toUpperCase() })} required />
        <input className="input input-bordered" placeholder="Address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
        <input className="input input-bordered" placeholder="City" value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} />
        <input className="input input-bordered" placeholder="Country" value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} required />
        <select className="select select-bordered" value={form.energySource} onChange={(event) => setForm({ ...form, energySource: event.target.value as SiteRequest['energySource'] })}>
          {energySourceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <input className="input input-bordered" type="number" min={1} step="0.01" placeholder="Area (m2)" value={form.totalAreaM2} onChange={(event) => setForm({ ...form, totalAreaM2: Number(event.target.value) })} required />
        <input className="input input-bordered" type="number" min={0} placeholder="Parking spaces" value={form.parkingSpaces} onChange={(event) => setForm({ ...form, parkingSpaces: Number(event.target.value) })} />
        <input className="input input-bordered" type="number" min={0} step="0.01" placeholder="Annual energy (kWh)" value={form.annualEnergyConsumptionKwh} onChange={(event) => setForm({ ...form, annualEnergyConsumptionKwh: Number(event.target.value) })} required />
        <input className="input input-bordered" type="number" min={0} placeholder="Employees" value={form.employeeCount} onChange={(event) => setForm({ ...form, employeeCount: Number(event.target.value) })} />
      </div>
      <MaterialFields materials={form.materials} onChange={(materials) => setForm({ ...form, materials })} />
      <button className={`btn btn-primary ${isSubmitting ? 'btn-disabled' : ''}`} type="submit">
        {submitLabel}
      </button>
    </form>
  );
}

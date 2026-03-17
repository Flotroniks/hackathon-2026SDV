import { materialTypeOptions, type MaterialInput } from '../../types/site';
import { useTranslation } from 'react-i18next';

interface MaterialFieldsProps {
  materials: MaterialInput[];
  onChange: (materials: MaterialInput[]) => void;
}

export function MaterialFields({ materials, onChange }: MaterialFieldsProps) {
  const { t } = useTranslation();

  function updateMaterial(index: number, patch: Partial<MaterialInput>) {
    const next = materials.map((material, materialIndex) => {
      if (materialIndex !== index) {
        return material;
      }
      return { ...material, ...patch };
    });
    onChange(next);
  }

  function addMaterial() {
    onChange([
      ...materials,
      {
        materialType: 'CONCRETE',
        materialLabel: t('materialFields.newMaterialLabel'),
        quantity: 1,
        unit: 'kg',
      },
    ]);
  }

  function removeMaterial(index: number) {
    onChange(materials.filter((_, materialIndex) => materialIndex !== index));
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-base-content/70">{t('materialFields.title')}</h3>
        <button type="button" className="btn btn-sm btn-outline" onClick={addMaterial}>
          {t('materialFields.add')}
        </button>
      </div>
      {materials.map((material, index) => (
        <div key={`${material.materialType}-${index}`} className="grid grid-cols-1 gap-2 rounded-xl bg-base-200 p-3 md:grid-cols-12">
          <select
            className="select select-bordered md:col-span-3"
            value={material.materialType}
            onChange={(event) => {
              const selected = materialTypeOptions.find((item) => item.value === event.target.value);
              updateMaterial(index, {
                materialType: event.target.value as MaterialInput['materialType'],
                unit: selected?.unit ?? 'kg',
              });
            }}
          >
            {materialTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {t(`materialFields.types.${option.value}`)}
              </option>
            ))}
          </select>
          <input
            className="input input-bordered md:col-span-4"
            placeholder={t('materialFields.labelPlaceholder')}
            value={material.materialLabel}
            onChange={(event) => updateMaterial(index, { materialLabel: event.target.value })}
          />
          <input
            className="input input-bordered md:col-span-2"
            type="number"
            min={0}
            step="0.001"
            value={material.quantity}
            onChange={(event) => updateMaterial(index, { quantity: Number(event.target.value) })}
          />
          <input
            className="input input-bordered md:col-span-2"
            value={material.unit}
            onChange={(event) => updateMaterial(index, { unit: event.target.value })}
          />
          <button type="button" className="btn btn-error md:col-span-1" onClick={() => removeMaterial(index)}>
            {t('materialFields.remove')}
          </button>
        </div>
      ))}
    </div>
  );
}

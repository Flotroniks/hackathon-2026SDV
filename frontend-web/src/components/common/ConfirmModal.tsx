import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  id: string;
  title: string;
  message: string;
  actionLabel: string;
  onConfirm: () => void;
}

export function ConfirmModal({ id, title, message, actionLabel, onConfirm }: ConfirmModalProps) {
  const { t } = useTranslation();

  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">{t('common.cancel')}</button>
          </form>
          <button
            className="btn btn-error text-white"
            onClick={() => {
              onConfirm();
              const modal = document.getElementById(id) as HTMLDialogElement | null;
              modal?.close();
            }}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}

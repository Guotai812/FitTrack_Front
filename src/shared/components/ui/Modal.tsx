type ModalProps = {
  children: React.ReactNode;
  onCancel: () => void;
};

export function Modal({ children, onCancel }: ModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded p-6 w-[400px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

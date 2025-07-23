type ModalProps = {
  children: React.ReactNode;
  pad?: number;
  size?: string;
  onCancel: () => void;
};

export function Modal({
  children,
  onCancel,
  pad = 6,
  size = "w-[400px]",
}: ModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 "
      onClick={onCancel}
    >
      <div
        className={`bg-white rounded p-${pad} ${size} shadow-xl min-w-[600px]`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

type ModalProps = {
  children: React.ReactNode;
  pad?: number;
  size?: string;
  min?: string;
  onCancel: () => void;
};

export function Modal({
  children,
  onCancel,
  pad = 6,
  size = "w-[20%]",
  min = "400px",
}: ModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 "
      onClick={onCancel}
    >
      <div
        className={`bg-white rounded p-${pad} ${size} shadow-xl min-w-[${min}]`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

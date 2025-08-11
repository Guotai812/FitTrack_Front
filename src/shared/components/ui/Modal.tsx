type ModalProps = {
  children: React.ReactNode;
  pad?: number;
  size?: string;
  min?: string;
  onCancel: () => void;
  isRefresh?: boolean;
};

export function Modal({
  children,
  onCancel,
  pad = 6,
  size = "w-[20%]",
  min = "400px",
  isRefresh = false,
}: ModalProps) {
  let clickHandler;
  if (isRefresh) {
    clickHandler = () => {
      onCancel();
      window.location.reload();
    };
  } else {
    clickHandler = onCancel;
  }
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 "
      onClick={clickHandler}
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

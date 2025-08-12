import type { Dispatch, SetStateAction } from "react";

type ModalProps = {
  children: React.ReactNode;
  pad?: number;
  size?: string;
  min?: string;
  onCancel: () => void;
  isRefresh?: boolean;
  setState?: Dispatch<SetStateAction<"ex" | "food" | undefined>>;
  state?: "food" | "ex" | undefined;
};

export function Modal({
  children,
  onCancel,
  pad = 6,
  size = "w-[20%]",
  min = "400px",
  isRefresh = false,
  setState,
  state,
}: ModalProps) {
  let clickHandler;
  if (isRefresh) {
    clickHandler = () => {
      onCancel();
      window.location.reload();
      if (setState) setState(state);
    };
  } else {
    clickHandler = () => {
      onCancel();
      if (setState) setState(state);
    };
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

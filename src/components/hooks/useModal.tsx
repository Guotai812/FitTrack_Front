import { useState } from "react";

export function useModal() {
  const [show, setShow] = useState(false);

  function modalCancelHandler(): void {
    setShow(false);
  }

  function modalDisplayHandler(): void {
    setShow(true);
  }

  return { show, modalCancelHandler, modalDisplayHandler };
}

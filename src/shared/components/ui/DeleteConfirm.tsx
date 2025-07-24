import { useDelete } from "../../context/DeleteContext";

import Button from "./Button";

export default function DeleteConfirm() {
  const { setIsDelete } = useDelete();
  return (
    <div>
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-xl">Warning</h2>
        <p>Are you sure you want to delete this item, it is unwithrawable!</p>
      </div>

      <div className="flex justify-between gap-4">
        <Button kind="gray" onClick={() => setIsDelete(false)}>
          Cancel
        </Button>
        <Button kind="cancel">Delete</Button>
      </div>
    </div>
  );
}

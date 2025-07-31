import type { Exercise } from "../../../context/PoolConetext";
import type { AnaerobicItem } from "../../../context/UserContext/UserContextType";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
type AnaerobicEditFormProps = {
  userExercise: AnaerobicItem;
  selectedExercise: Exercise;
  onCancel: () => void;
};

export default function AnaerobicEditForm({
  selectedExercise,
  onCancel,
}: AnaerobicEditFormProps) {
  return (
    <Form>
      <div>
        <div className="flex w-full h-full items-center justify-center">
          <div className="text-center">
            <img
              src={selectedExercise.image}
              alt={selectedExercise.name}
              className="rounded-full w-1/5 mx-auto"
            />
            <p className="mt-2">{selectedExercise.name}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={onCancel} kind="gray" type="button">
          Cancel
        </Button>
        <div className="flex gap-4">
          <Button kind="cancel" type="button">
            Delete
          </Button>
          <Button kind="confirm">Edit</Button>
        </div>
      </div>
    </Form>
  );
}

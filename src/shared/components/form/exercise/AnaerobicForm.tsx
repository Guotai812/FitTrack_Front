import { useExercise } from "../../../context/exercise/ExerciseContext";
import { usePool } from "../../../context/PoolConetext";

import Form from "../../ui/Form";
import Button from "../../ui/Button";
import Input from "../../ui/Input";

export default function AnaerobicForm() {
  const { id, setId } = useExercise();
  const { ePool } = usePool();
  const selectedExercise = ePool[id];

  return (
    <Form className="w-5/6">
      <div className="p-6 flex flex-col justify-between gap-10 h-full">
        <div className="">
          <div className="flex flex-col gap-5 jutify-center items-center h-full">
            <img
              src={selectedExercise.image}
              alt={selectedExercise.name}
              className="w-[20%]"
            />
            <p>{selectedExercise.name}</p>
          </div>
          <div className="text-center">
            <Input
              type="number"
              label="Duration"
              name={selectedExercise.name}
              width="w-[30%]"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button onClick={() => setId("")} type="button" kind="cancel">
            Cancel
          </Button>
          <Button kind="confirm">Confirm</Button>
        </div>
      </div>
    </Form>
  );
}

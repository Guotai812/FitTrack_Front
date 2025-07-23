import { usePool } from "../../context/PoolConetext";
import { useUser } from "../../context/UserContext";
import { useEdit } from "../../context/EditContext";

import Form from "../ui/Form";
import Button from "../ui/Button";
import Input from "../ui/Input";

type FoodEditFormProps = {
  onCancel: () => void;
};

export default function FoodEditForm({ onCancel }: FoodEditFormProps) {
  const { info } = useUser();
  const { edit } = useEdit();
  const { pool } = usePool();
  const image = pool[edit?.foodId ?? ""]?.image;
  const name = pool[edit?.foodId ?? ""]?.name;
  const weight = info.diets[edit?.meal ?? "breakfast"][
    edit?.isMain ? "main" : "extra"
  ].find((item) => item.food === edit?.foodId)?.weight;

  return (
    <Form>
      <div>
        <div className="flex w-full h-full items-center justify-center">
          <div className="text-center">
            <img
              src={image}
              alt={name}
              className="rounded-full w-1/5 mx-auto"
            />
            <p className="mt-2">{name}</p>
          </div>
        </div>
        <Input
          type="number"
          name="weight"
          label="Weight"
          defaultValue={weight}
        />
      </div>
      <div className="flex justify-between">
        <Button onClick={onCancel} kind="cancel" type="button">
          Cancel
        </Button>
        <div className="flex gap-4">
          <Button kind="gray" type="button">
            Delete
          </Button>
          <Button kind="confirm">Edit</Button>
        </div>
      </div>
    </Form>
  );
}

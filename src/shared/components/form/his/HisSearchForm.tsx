import Form from "../../ui/Form";
import Input from "../../ui/Input";
import { Modal } from "../../ui/Modal";
import Button from "../../ui/Button";
import { useDate } from "../../../context/DateContext";
import { useForm } from "../../../hooks/useForm/useForm";
import validator from "../../../util/validator";
import useInput from "../../../hooks/useInput";
import type React from "react";

type HisSearchFormProps = {
  onCancel: () => void;
};

export default function HisSearchForm({ onCancel }: HisSearchFormProps) {
  const { touched, blurHandler } = useInput();
  const { date, searchDate } = useDate();
  const { formState, inputHandler } = useForm(
    {
      year: { value: date.selected.year, isValid: true },
      month: { value: date.selected.month, isValid: true },
    },
    true
  );
  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    searchDate(
      Number(formState.inputs.year.value),
      Number(formState.inputs.month.value)
    );
    onCancel();
  }

  return (
    <Modal onCancel={onCancel}>
      <Form title="Date Form" onSubmit={submitHandler}>
        <Input
          type="number"
          name="year"
          label="Year"
          value={Number(formState.inputs.year.value)}
          onChange={(e) =>
            inputHandler(
              "year",
              Number(e.target.value),
              validator("year", e.target.value)
            )
          }
          isTouched={touched["year"]}
          onBlur={() => blurHandler("year")}
          isValid={formState.inputs.year.isValid}
          errMsg="Invalid Value"
        />
        <Input
          type="number"
          name="month"
          label="Month"
          value={Number(formState.inputs.month.value)}
          onChange={(e) =>
            inputHandler(
              "month",
              Number(e.target.value),
              validator("month", e.target.value)
            )
          }
          isTouched={touched["month"]}
          onBlur={() => blurHandler("month")}
          isValid={formState.inputs.month.isValid}
          errMsg="Invalid Value"
        />
        <div className="flex justify-end gap-4">
          <Button kind="cancel" onClick={onCancel}>
            Cancel
          </Button>
          <Button kind="confirm">Search</Button>
        </div>
      </Form>
    </Modal>
  );
}

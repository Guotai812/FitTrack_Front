import { useState } from "react";
import validator from "../util/validator";

import Button from "../ui/Button";
import Form from "../ui/Form";
import Input from "../ui/Input";
import { useForm } from "../hooks/useForm/useForm";
import useInput from "../hooks/useInput";

type loginProps = {
  onCancelModal: () => void;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Login({ onCancelModal, setIsLogin }: loginProps) {
  const { formState, inputHandler } = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const { touched, blurHandler } = useInput();

  return (
    <Form title="Login">
      <Input
        label="Email"
        name="email"
        type="email"
        placeHolder="eg.Example@example.com"
        errMsg="Please enter valid email"
        required
        value={formState.inputs.email.value}
        isValid={formState.inputs.email.isValid}
        isTouched={touched["email"]}
        onBlur={() => {
          blurHandler("email");
        }}
        onChange={(e) =>
          inputHandler(
            "email",
            e.target.value,
            validator("email", e.target.value)
          )
        }
      />
      <Input
        label="Password"
        name="password"
        type="password"
        errMsg="At leat 6 characters"
        isValid={formState.inputs.password.isValid}
        isTouched={touched["password"]}
        value={formState.inputs.password.value}
        onBlur={() => {
          blurHandler("password");
        }}
        onChange={(e) => {
          inputHandler(
            "password",
            e.target.value,
            validator("password", e.target.value)
          );
        }}
        required
      />
      <div className="flex justify-between items-center px-4 py-2">
        <Button
          type="button"
          className="text-blue-600 hover:underline"
          onClick={() => setIsLogin(false)}
        >
          Signup
        </Button>
        <div className="flex gap-4">
          <Button type="button" kind="cancel" onClick={onCancelModal}>
            Cancel
          </Button>
          <Button kind="confirm" disabled={!formState.isValid}>
            Login
          </Button>
        </div>
      </div>
    </Form>
  );
}

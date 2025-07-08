import { useState } from "react";
import { useForm } from "../hooks/useForm/useForm";

import Button from "../ui/Button";
import Form from "../ui/Form";
import Input from "../ui/Input";
import validator from "../util/validator";

type signupProps = {
  onCancelModal: () => void;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Auth({ onCancelModal, setIsLogin }: signupProps) {
  const { formState, inputHandler } = useForm(
    {
      userName: {
        value: "",
        isValid: false,
      },
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
      confirmPassword: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const [touched, setTouched] = useState<{ [id: string]: boolean }>({});

  const handleBlur = (id: string) => () => {
    setTouched((prev) => ({ ...prev, [id]: true }));
  };
  return (
    <Form title="Signup">
      <Input
        label="Username"
        name="username"
        type="text"
        errMsg="Could not be empty"
        isValid={formState.inputs.userName.isValid}
        isTouched={touched["userName"]}
        onBlur={handleBlur("userName")}
        onChange={(e) => {
          inputHandler(
            "userName",
            e.target.value,
            validator("userName", e.target.value)
          );
        }}
        required
      />
      <Input
        label="Email"
        name="email"
        type="email"
        placeHolder="eg.Example@example.com"
        errMsg="Could not be empty"
        isValid={formState.inputs.email.isValid}
        isTouched={touched["email"]}
        onBlur={handleBlur("email")}
        onChange={(e) => {
          inputHandler(
            "email",
            e.target.value,
            validator("email", e.target.value)
          );
        }}
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        errMsg="At leat 6 characters"
        isValid={formState.inputs.password.isValid}
        isTouched={touched["password"]}
        onBlur={handleBlur("password")}
        onChange={(e) => {
          inputHandler(
            "password",
            e.target.value,
            validator("password", e.target.value)
          );
        }}
        required
      />
      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        errMsg="Please enter correct password"
        isValid={formState.inputs.confirmPassword.isValid}
        isTouched={touched["confirmPassword"]}
        onBlur={handleBlur("confirmPassword")}
        onChange={(e) => {
          inputHandler(
            "confirmPassword",
            e.target.value,
            validator(
              "confirmPassword",
              formState.inputs.password.value,
              e.target.value
            )
          );
        }}
        required
      />
      <div className="flex justify-between items-center px-4 py-2">
        <Button
          type="button"
          className="text-blue-600 hover:underline"
          onClick={() => setIsLogin(true)}
        >
          Login
        </Button>
        <div className="flex gap-4">
          <Button type="button" kind="cancel" onClick={onCancelModal}>
            Cancel
          </Button>
          <Button kind="confirm">Login</Button>
        </div>
      </div>
    </Form>
  );
}

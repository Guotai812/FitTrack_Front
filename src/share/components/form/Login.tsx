const baseUrl = import.meta.env.VITE_BACKEND_URL;
import validator from "../../util/validator";
import { useForm } from "../../hooks/useForm/useForm";
import useInput from "../../hooks/useInput";
import useHttp from "../../hooks/useHttp";
import { useNavigate } from "react-router-dom";

import Button from "../ui/Button";
import Form from "../ui/Form";
import Input from "../ui/Input";
import type React from "react";
import { jwtDecode } from "jwt-decode";
import { useModal } from "../../hooks/useModal";
import ErrorModal from "../ui/ErrorModal";

type loginProps = {
  onCancelModal: () => void;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Login({ onCancelModal, setIsLogin }: loginProps) {
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  const navigate = useNavigate();
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

  const { error, isLoading, sendRequest } = useHttp<{
    userId: string;
    userName: string;
    email: string;
    token: string;
  }>();

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = formState.inputs.email.value;
    const password = formState.inputs.password.value;
    try {
      const responseData = await sendRequest({
        url: `${baseUrl}/users/login`,
        method: "POST",
        body: { email, password },
      });
      localStorage.setItem("token", responseData.token);
      const decoded: any = jwtDecode(responseData.token);
      navigate(`/${decoded.userId}`);
    } catch (err) {
      modalDisplayHandler();
    }
  }

  if (error && show) {
    return (
      <ErrorModal
        onCancel={modalCancelHandler}
        title="Invalid Authentication"
        msg={error}
      />
    );
  }

  return (
    <Form title="Login" onSubmit={submitHandler}>
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
          <Button
            type="submit"
            kind="confirm"
            isLoading={isLoading}
            disabled={!formState.isValid || isLoading}
          >
            {isLoading && "Login..."}
            {!isLoading && "Login"}
          </Button>
        </div>
      </div>
    </Form>
  );
}

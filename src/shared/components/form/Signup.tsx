const baseUrl = import.meta.env.VITE_BACKEND_URL;
import { useForm } from "../../hooks/useForm/useForm";
import validator from "../../util/validator";
import useInput from "../../hooks/useInput";
import useHttp from "../../hooks/useHttp";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

import Button from "../ui/Button";
import Form from "../ui/Form";
import Input from "../ui/Input";
import { useModal } from "../../hooks/useModal";
import ErrorModal from "../ui/ErrorModal";

type signupProps = {
  onCancelModal: () => void;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Auth({ onCancelModal, setIsLogin }: signupProps) {
  const auth = useAuth();
  const navigate = useNavigate();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
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
  const { touched, blurHandler } = useInput();
  const { error, isLoading, sendRequest } = useHttp();

  async function signupHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const userName = formState.inputs.userName.value;
    const email = formState.inputs.email.value;
    const password = formState.inputs.password.value;
    try {
      const responseData = await sendRequest({
        url: `${baseUrl}/users/signup`,
        method: "POST",
        body: { userName, email, password },
      });
      auth.login(responseData.token, {
        userId: responseData.userId,
        name: responseData.userName,
      });

      navigate(`/${responseData.userId}`);
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
    <Form title="Signup" onSubmit={signupHandler}>
      <Input
        label="Username"
        name="username"
        type="text"
        errMsg="At least 2 charactes"
        isValid={formState.inputs.userName.isValid}
        isTouched={touched["userName"]}
        onBlur={() => blurHandler("userName")}
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
        errMsg="Please enter valid email"
        isValid={formState.inputs.email.isValid}
        isTouched={touched["email"]}
        onBlur={() => blurHandler("email")}
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
        onBlur={() => blurHandler("password")}
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
        onBlur={() => blurHandler("confirmPassword")}
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
          <Button
            kind="confirm"
            disabled={!formState.isValid || isLoading}
            isLoading={isLoading}
          >
            Signup
          </Button>
        </div>
      </div>
    </Form>
  );
}

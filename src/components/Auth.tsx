const backendUrl = import.meta.env.VITE_BACKEND_URL;
import { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

type AuthModalProps = {
  onCancelModal: () => void;
  isLogin: boolean;
  onShowLogin: () => void;
  onShowSignup: () => void;
};

type InputName = "userName" | "email" | "password" | "confirmPassword";

export default function AuthModal({
  onCancelModal,
  isLogin,
  onShowLogin,
  onShowSignup,
}: AuthModalProps) {
  const target = document.getElementById("auth");
  if (!target) return null;

  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    inputs: {
      userName: {
        value: "",
        isValid: false,
        isBlur: false,
      },
      email: {
        value: "",
        isValid: false,
        isBlur: false,
      },
      password: {
        value: "",
        isValid: false,
        isBlur: false,
      },
      confirmPassword: {
        value: "",
        isValid: false,
        isBlur: false,
      },
    },
    isSignup: false,
    isLogin: false,
  });
  function inputHandler(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        [name as InputName]: {
          ...prev.inputs[name as InputName],
          value: value,
        },
      },
    }));
    validateField(name as InputName, value);
  }
  function validateField(name: InputName, value: string) {
    let isValid = true;
    if (name === "email" && value.trim() === "") isValid = false;
    if (name === "password" && value.length < 6) isValid = false;
    if (name === "userName" && value.trim() === "") isValid = false;
    if (name === "confirmPassword" && value !== form.inputs.password.value)
      isValid = false;

    setForm((prev) => {
      const updatedInputs = {
        ...prev.inputs,
        [name]: {
          ...prev.inputs[name],
          isValid: isValid,
          isBlur: true,
        },
      };

      if (name === "password") {
        const confirmValue = updatedInputs.confirmPassword.value;
        updatedInputs.confirmPassword = {
          ...updatedInputs.confirmPassword,
          isValid: confirmValue === value,
        };
      }
      const isSignup = Object.values(updatedInputs).every(
        (input) => input.isValid
      );

      const isLogin =
        updatedInputs.email.isValid && updatedInputs.password.isValid;

      return {
        ...prev,
        inputs: updatedInputs,
        isSignup: isSignup,
        isLogin: isLogin,
      };
    });
  }

  function focusHandler(name: InputName) {
    setForm((pre) => ({
      ...pre,
      inputs: {
        ...pre.inputs,
        [name]: { ...pre.inputs[name], isBlur: false },
      },
    }));
  }

  async function loginHandler(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    const email = form.inputs.email.value;
    const password = form.inputs.password.value;

    try {
      setIsLoading(true);
      const response = await fetch(`${backendUrl}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      setIsLoading(false);
      console.log("Login successful");
      localStorage.setItem("token", data.token);
      navigate(`/${data.userId}`);
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "An unexpected error occurred";
      setError(msg);
      setIsLoading(false);
      console.error("Login error:", error);
      alert(error);
    }
  }

  async function signupHanlder(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    const userName = form.inputs.userName.value;
    const email = form.inputs.email.value;
    const password = form.inputs.password.value;

    try {
      setIsLoading(true);
      const response = await fetch(`${backendUrl}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Signup Failed");
      }
      localStorage.setItem("token", data.token);
      setIsLoading(false);
      navigate(`/${data.userId}`);
      console.log("sign up successful");
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "An unexpected error occurred";
      setError(msg);
      setIsLoading(false);
      console.error("Login error:", error);
      alert(error);
    }
  }
  let content;
  if (isLogin) {
    content = (
      <div
        className="bg-white rounded p-6 w-[400px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl mb-4">Login</h2>
        <form className="flex flex-col gap-7" onSubmit={loginHandler}>
          <div className="h-10">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="border px-2 py-1 rounded w-full"
              required
              value={form.inputs.email.value}
              onChange={inputHandler}
              onBlur={(e) => validateField("email", e.target.value)}
              onFocus={() => focusHandler("email")}
            />
            {!form.inputs.email.isValid && form.inputs.email.isBlur && (
              <p className="text-red-500 text-sm">Email is empty</p>
            )}
          </div>

          <div className="h-10">
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="border px-2 py-1 rounded w-full"
              required
              value={form.inputs.password.value}
              onChange={inputHandler}
              onBlur={(e) => validateField("password", e.target.value)}
              onFocus={() => focusHandler("password")}
            />
            {!form.inputs.password.isValid && form.inputs.password.isBlur && (
              <p className="text-red-500 text-sm">
                Length must be equal or greater than 6
              </p>
            )}
          </div>
          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              className="text-blue-500 hover:underline"
              disabled={isLoading}
              onClick={onShowSignup}
            >
              Sign up
            </button>
            <div className="flex gap-2">
              {!isLoading && (
                <button
                  type="submit"
                  disabled={!form.isLogin}
                  className={`px-4 py-1 rounded transition duration-300 ${
                    form.isLogin
                      ? "bg-green-300 text-black hover:text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Login
                </button>
              )}
              {isLoading && (
                <button
                  type="submit"
                  disabled
                  className="px-4 py-1 rounded bg-gray-300 text-gray-500 cursor-not-allowed"
                >
                  Login...
                </button>
              )}

              <button
                type="button"
                onClick={onCancelModal}
                disabled={isLoading}
                className="bg-gray-300 px-4 py-1 rounded hover:bg-red-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  } else {
    content = (
      <div
        className="bg-white rounded p-6 w-[400px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl mb-4">Signup</h2>
        <form className="flex flex-col gap-7" onSubmit={signupHanlder}>
          <div className="h-10">
            <input
              name="userName"
              type="text"
              placeholder="Username"
              className="border px-2 py-1 rounded w-full"
              required
              value={form.inputs.userName.value}
              onChange={inputHandler}
              onBlur={(e) => validateField("userName", e.target.value)}
              onFocus={() => focusHandler("userName")}
            />
            {!form.inputs.userName.isValid && form.inputs.userName.isBlur && (
              <p className="text-red-500 text-sm">username is empty</p>
            )}
          </div>

          <div className="h-10">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="border px-2 py-1 rounded w-full"
              required
              value={form.inputs.email.value}
              onChange={inputHandler}
              onBlur={(e) => validateField("email", e.target.value)}
              onFocus={() => focusHandler("email")}
            />
            {!form.inputs.email.isValid && form.inputs.email.isBlur && (
              <p className="text-red-500 text-sm">Email is empty</p>
            )}
          </div>

          <div className="h-10">
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="border px-2 py-1 rounded w-full"
              required
              value={form.inputs.password.value}
              onChange={inputHandler}
              onBlur={(e) => validateField("password", e.target.value)}
              onFocus={() => focusHandler("password")}
            />
            {!form.inputs.password.isValid && form.inputs.password.isBlur && (
              <p className="text-red-500 text-sm">
                length must be equal or greated than 6
              </p>
            )}
          </div>
          <div className="h-10">
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="border px-2 py-1 rounded w-full"
              required
              onChange={inputHandler}
              onBlur={(e) => validateField("confirmPassword", e.target.value)}
              onFocus={() => focusHandler("confirmPassword")}
            />
            {!form.inputs.confirmPassword.isValid &&
              form.inputs.confirmPassword.isBlur && (
                <p className="text-red-500 text-sm">not the same</p>
              )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={onShowLogin}
              disabled={isLoading}
            >
              Login
            </button>
            <div className="flex gap-2">
              {!isLoading && (
                <button
                  type="submit"
                  disabled={!form.isSignup}
                  className={`px-4 py-1 rounded transition duration-300 ${
                    form.isSignup
                      ? "bg-green-300 text-black hover:text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Signup
                </button>
              )}

              {isLoading && (
                <button
                  type="submit"
                  disabled
                  className="px-4 py-1 rounded bg-gray-300 text-gray-500 cursor-not-allowed "
                >
                  Signup...
                </button>
              )}
              <button
                type="button"
                onClick={onCancelModal}
                disabled={isLoading}
                className="bg-gray-300 px-4 py-1 rounded hover:bg-red-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onCancelModal}
    >
      {content}
    </div>,
    target
  );
}

import { createPortal } from "react-dom";

type AuthModalProps = {
  onCancelModal: () => void;
  isLogin: boolean;
  onShowLogin: () => void;
  onShowSignup: () => void;
};

export default function AuthModal({
  onCancelModal,
  isLogin,
  onShowLogin,
  onShowSignup,
}: AuthModalProps) {
  const target = document.getElementById("auth");
  if (!target) return null;

  let content;
  if (isLogin) {
    content = (
      <div
        className="bg-white rounded p-6 w-[400px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl mb-4">Login</h2>
        <form className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            className="border px-2 py-1 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="border px-2 py-1 rounded"
          />
          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={onShowSignup}
            >
              Sign up
            </button>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-300 text-black px-4 py-1 rounded hover:text-white transition duration-300"
              >
                Login
              </button>
              <button
                type="button"
                onClick={onCancelModal}
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
        <form className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            className="border px-2 py-1 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="border px-2 py-1 rounded"
          />
          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={onShowLogin}
            >
              Login
            </button>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-300 text-black px-4 py-1 rounded hover:text-white transition duration-300"
              >
                Signup
              </button>
              <button
                type="button"
                onClick={onCancelModal}
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

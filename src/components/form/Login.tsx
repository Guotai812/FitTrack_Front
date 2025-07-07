import Button from "../ui/Button";
import Form from "../ui/Form";
import Input from "../ui/Input";

type loginProps = {
  onCancelModal: () => void;
  setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Login({ onCancelModal, setIsLogin }: loginProps) {
  return (
    <Form title="Login">
      <Input
        label="Email"
        name="email"
        type="email"
        placeHolder="eg.Example@example.com"
        errMsg="Could not be empty"
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        errMsg="At leat 6 characters"
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
          <Button kind="confirm">Login</Button>
        </div>
      </div>
    </Form>
  );
}

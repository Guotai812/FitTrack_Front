import { Link, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import { useModal } from "../../hooks/useModal";
import { useState } from "react";
import DietModal from "../ui/cFood/DietModal";

import UpLoadExForm from "../form/UploadExForm";
import UpLoadFoodForm from "../form/UploadFoodForm";
import { DietProvider } from "../../context/diet/DietManageContext";

export default function SideNavigation() {
  const [state, setState] = useState<"ex" | "food" | undefined>(undefined);
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  const navigate = useNavigate();
  const auth = useAuth();
  function logoutHandler() {
    auth.logout();
    navigate("/");
  }
  function clickHandler(value: "food" | "ex" | undefined) {
    modalDisplayHandler();
    setState(value);
  }

  return (
    <>
      {show &&
        (state === "ex" ? (
          <UpLoadExForm onCancel={modalCancelHandler} setState={setState} />
        ) : (
          <DietProvider>
            <DietModal onCancel={modalCancelHandler} setState={setState} />
          </DietProvider>
        ))}
      <aside className="h-screen w-1/7 bg-green-300 text-black flex flex-col justify-between p-4 shadow-lg">
        <div>
          <nav className="text-center flex flex-col gap-4 text-xl">
            <Link
              to={`/${auth.user?.userId}`}
              className="text-2xl font-bold text-center my-6"
            >
              {`Hello, ${auth.user?.name}`}
            </Link>

            <NavLink
              to={`/${auth.user?.userId}`}
              end
              className={({ isActive }) =>
                `hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              Home
            </NavLink>

            <NavLink
              to={`/${auth.user?.userId}/history`}
              className={({ isActive }) =>
                `hover:text-white ${isActive ? "text-white" : ""}`
              }
            >
              History
            </NavLink>
            <Button
              onClick={() => clickHandler("ex")}
              className={`hover:text-white ${
                state === "ex" ? "text-white" : ""
              }`}
            >
              Customized Exercise
            </Button>
            <Button
              onClick={() => clickHandler("food")}
              className={`hover:text-white ${
                state === "food" ? "text-white" : ""
              }`}
            >
              Customized Food
            </Button>
          </nav>
        </div>

        <div className="text-center">
          <Button className="hover:underline" onClick={logoutHandler}>
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}

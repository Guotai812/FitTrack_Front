import { useUser } from "../../../context/UserContext/UserContext";
import { useModal } from "../../../hooks/useModal";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

import WeightForm from "../../form/WeightForm";

export default function BodyWeight() {
  const { user } = useAuth();
  const { info } = useUser();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  const bmi = (info.weight / (info.height * info.height)) * 10000;
  const BMI = Number(bmi.toFixed(1));
  const indicator =
    BMI < 18.5
      ? "Underweight"
      : bmi < 25
      ? "Normal weight"
      : bmi < 30
      ? "Overweight"
      : bmi < 35
      ? "Obesity Class I"
      : bmi < 40
      ? "Obesity Class II"
      : "Obesity Class III";

  // TODO: add a fied in basic record named isWeightUpdated to record if user updated weight
  return (
    <>
      {show && <WeightForm onCancel={modalCancelHandler} />}
      <div className="border border-gray-400 p-5">
        <div className="flex justify-between">
          <p className="text-xl">Your current weight:</p>
          <Link
            to={`/${user?.userId}/weightHistory`}
            className="hover:underline text-m"
          >
            History
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center gap-8 mt-8">
          <div
            onClick={modalDisplayHandler}
            className="bg-green-300 w-[30%] aspect-square rounded-full flex items-center justify-center text-center hover:shadow-2xl"
          >
            <p className="text-5xl">{info.weight}kg</p>
          </div>
          <div className="flex flex-col items-center">
            <p>BMI: {BMI}</p>
            <p>{indicator}</p>
          </div>
        </div>
      </div>
    </>
  );
}

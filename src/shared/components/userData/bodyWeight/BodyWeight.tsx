import { Link } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { useAuth } from "../../../context/AuthContext";

export default function BodyWeight() {
  const auth = useAuth();
  const user = useUser();
  const bmi =
    (user.info.weight / (user.info.height * user.info.height)) * 10000;
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
  return (
    <div className="border border-gray-400 p-5">
      <div className="flex justify-between">
        <p className="text-xl">Your current weight:</p>
        <Link to={`/${auth.user?.userId}`} className="hover:underline text-m">
          History
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center gap-8 mt-8">
        {/* TODO: add a modal to update weight */}
        <button className="bg-green-300 w-[30%] aspect-square rounded-full flex items-center justify-center text-center hover:shadow-2xl">
          <p className="text-5xl">{user.info.weight}kg</p>
        </button>
        <div className="flex flex-col items-center">
          <p>BMI: {BMI}</p>
          <p>{indicator}</p>
        </div>
      </div>
    </div>
  );
}

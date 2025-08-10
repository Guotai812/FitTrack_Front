import WeightForm from "../../../form/his/WeightForm";
import { useModal } from "../../../../hooks/useModal";
import { useHisInfo } from "../../../../context/useHisInfo";

export default function BodyWeight() {
  const { info } = useHisInfo();
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

  return (
    <>
      {show && <WeightForm onCancel={modalCancelHandler} />}
      <div className="border border-gray-400 p-5">
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

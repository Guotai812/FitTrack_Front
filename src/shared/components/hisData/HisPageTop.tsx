import { useDate } from "../../../shared/context/DateContext";
import { useModal } from "../../hooks/useModal";
import HisSearchForm from "../form/his/HisSearchForm";
import Button from "../ui/Button";

const MONTH_TABLE = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export default function HisPageTop() {
  const { date, recover } = useDate();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  return (
    <>
      {show && <HisSearchForm onCancel={modalCancelHandler} />}
      <div className="mb-10">
        <div className="flex justify-between">
          <div>
            <p className="text-9xl mb-4">{date.selected.year}</p>
            <p className="text-8xl">{MONTH_TABLE[date.selected.month - 1]}</p>
          </div>
          <Button onClick={modalDisplayHandler} kind="confirm">
            Search
          </Button>
        </div>

        {!date.isCurrent && (
          <Button onClick={recover} kind="confirm">
            Current
          </Button>
        )}
      </div>
    </>
  );
}

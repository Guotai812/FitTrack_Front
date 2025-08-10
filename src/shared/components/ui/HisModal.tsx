import { useDate } from "../../context/DateContext";
import { HisInfoProvider } from "../../context/useHisInfo";
import { Modal } from "./Modal";

type HisModalProps = {
  onCancel: () => void;
  day: string;
};

export default function HisModal({ onCancel, day }: HisModalProps) {
  const { date } = useDate();
  const formattedDate = `${date.year}-${String(date.month).padStart(
    2,
    "0"
  )}-${String(day).padStart(2, "0")}`;
  //   TODO: add side content here
  return (
    <HisInfoProvider date={formattedDate}>
      <Modal onCancel={onCancel}>
        <div></div>
      </Modal>
    </HisInfoProvider>
  );
}

import { useState } from "react";
import { useModal } from "../../shared/hooks/useModal";
import HisModal from "../../shared/components/hisData/HisModal";
import HisList from "../../shared/components/hisData/HisList";
import HisPageTop from "../../shared/components/hisData/HisPageTop";
import Button from "../../shared/components/ui/Button";
import { useDate } from "../../shared/context/DateContext";

export default function HistoryPage() {
  const [day, setDay] = useState<string>("");
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  const { forward, backward } = useDate();
  return (
    <>
      {show && <HisModal onCancel={modalCancelHandler} day={day} />}
      <div className="p-6 h-full flex flex-col justify-between">
        <div className="h-[95%]">
          <HisPageTop />
          <HisList modalDisplay={modalDisplayHandler} setDay={setDay} />
        </div>

        <div className="flex justify-center items-center gap-4">
          <Button onClick={backward} kind="confirm">
            &lt;
          </Button>
          <Button onClick={forward} kind="confirm">
            &gt;
          </Button>
        </div>
      </div>
    </>
  );
}

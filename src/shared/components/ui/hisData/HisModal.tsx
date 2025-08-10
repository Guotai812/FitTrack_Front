import { useDate } from "../../../context/DateContext";
import { DietProvider } from "../../../context/diet/DietManageContext";
import { EditContextProvider } from "../../../context/diet/EditContext";
import { ItemContextProvider } from "../../../context/exercise/ItemContext";
import { HisInfoProvider } from "../../../context/useHisInfo";
import KcalSection from "../../../components/ui/hisData/kcal/KcalIndicator";
import { Modal } from "../Modal";
import SideContent from "../SideContent";
import BodyWeight from "./bodyWeight/BodyWeight";
import DietSection from "./diet/Diet";

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
  return (
    <HisInfoProvider date={formattedDate}>
      <Modal onCancel={onCancel} size="w-[50%]" pad={0}>
        <SideContent>
          <KcalSection />
          <BodyWeight />
          <ItemContextProvider>
            <DietProvider>
              <EditContextProvider>
                <DietSection />
              </EditContextProvider>
            </DietProvider>
          </ItemContextProvider>
        </SideContent>
      </Modal>
    </HisInfoProvider>
  );
}

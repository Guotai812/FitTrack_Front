import SideContent from "../../shared/components/ui/SideContent";
import BodyWeight from "../../shared/components/userData/bodyWeight/BodyWeight";
import CaloriesSection from "../../shared/components/userData/kcalBar/KcalIndicator";
import ExerciseSection from "../../shared/components/userData/exercise/ExerciseSection";
import DietSection from "../../shared/components/userData/dietManager/Diet";
import { DietProvider } from "../../shared/context/diet/DietManageContext";
import { ItemContextProvider } from "../../shared/context/exercise/ItemContext";
import { EditContextProvider } from "../../shared/context/diet/EditContext";

export default function UserHomePage() {
  return (
    <SideContent>
      <CaloriesSection />
      <BodyWeight />
      <EditContextProvider>
        <ItemContextProvider>
          <DietProvider>
            <DietSection />
          </DietProvider>
          <ExerciseSection />
        </ItemContextProvider>
      </EditContextProvider>
    </SideContent>
  );
}

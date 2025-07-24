import SideContent from "../../shared/components/ui/SideContent";
import BodyWeight from "../../shared/components/userData/diet/bodyWeight/BodyWeight";
import CaloriesSection from "../../shared/components/userData/diet/kcalBar/KcalIndicator";

import DietSection from "../../shared/components/userData/diet/dietManager/Diet";
import { DietProvider } from "../../shared/context/DietManageContext";

export default function UserHomePage() {
  return (
    <SideContent>
      <CaloriesSection />
      <BodyWeight />
      <DietProvider>
        <DietSection />
      </DietProvider>
      <div className="bg-yellow-100 border border-gray-400"></div>
    </SideContent>
  );
}

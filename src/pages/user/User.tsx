import SideContent from "../../shared/components/ui/SideContent";
import BodyWeight from "../../shared/components/userData/BodyWeight";
import CaloriesSection from "../../shared/components/userData/KcalIndicator";

import DietSection from "../../shared/components/userData/Diet";

export default function UserHomePage() {
  return (
    <SideContent>
      <CaloriesSection />
      <BodyWeight />
      <DietSection />
      <div className="bg-yellow-100 border border-gray-400"></div>
    </SideContent>
  );
}

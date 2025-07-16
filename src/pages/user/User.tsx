import SideContent from "../../shared/components/ui/SideContent";
import BodyWeight from "../../shared/components/userData/BodyWeight";
import CaloriesSection from "../../shared/components/userData/KcalIndicator";

import Button from "../../shared/components/ui/Button";
import { MealList } from "../../shared/components/userData/MealList";

export default function UserHomePage() {
  return (
    <SideContent>
      <CaloriesSection />
      <BodyWeight />
      <div className="border p-4 flex flex-col overflow-y-auto h-full">
        <div className="flex justify-between mb-2">
          <h2 className="text-lg font-semibold">Diet:</h2>
          <Button kind="confirm">Manage</Button>
        </div>
        <MealList />
      </div>

      <div className="bg-yellow-100 border border-gray-400"></div>
    </SideContent>
  );
}

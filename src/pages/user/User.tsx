import SideContent from "../../shared/components/ui/SideContent";
import CaloriesSection from "../../shared/components/userData/KcalIndicator";

export default function UserHomePage() {
  return (
    <SideContent>
      <CaloriesSection />
      <div className="bg-blue-100 border border-gray-400"></div>
      <div className="bg-gray-100 border border-gray-400"></div>
      <div className="bg-yellow-100 border border-gray-400"></div>
    </SideContent>
  );
}

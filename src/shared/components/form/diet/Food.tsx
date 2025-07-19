import LibraryNavigation from "../../userData/LibraryNavigation";
import FoodList from "../../userData/FoodList";

export default function FoodLibrary() {
  return (
    <div className="flex justify-between h-full">
      <LibraryNavigation />
      <FoodList />
    </div>
  );
}

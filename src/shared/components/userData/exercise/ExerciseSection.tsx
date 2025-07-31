import { ItemContextProvider } from "../../../context/exercise/ItemContext";
import ExerciseList from "./ExerciseList";
import ExerciseTopBar from "./ExerciseTopBar";

export default function ExerciseSection() {
  return (
    <div className="bg-white border border-gray-400 p-4">
      <div className="flex flex-col overflow-y-auto h-full">
        <ExerciseTopBar />
        {/* TODO: change this provider to RidProvide */}
        <ItemContextProvider>
          <ExerciseList />
        </ItemContextProvider>
      </div>
    </div>
  );
}

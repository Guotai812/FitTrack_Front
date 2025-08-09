import ExerciseList from "./ExerciseList";
import ExerciseTopBar from "./ExerciseTopBar";

export default function ExerciseSection() {
  return (
    <div className="bg-white border border-gray-400 p-4">
      <div className="flex flex-col overflow-y-auto h-full">
        <ExerciseTopBar />
        <ExerciseList />
      </div>
    </div>
  );
}

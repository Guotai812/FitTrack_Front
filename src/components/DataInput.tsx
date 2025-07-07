import { createPortal } from "react-dom";

type DataInputType = {
  onCancelModal: () => void;
};

export default function DataInputModal({ onCancelModal }: DataInputType) {
  const target = document.getElementById("dataInput");
  if (!target) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onCancelModal}
    >
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl flex flex-col gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="space-y-1">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome to FitTrack
          </h2>
          <p className="text-sm text-gray-600">
            Please fill in your details to get started.
          </p>
        </header>

        <form className="grid grid-cols-1 gap-4">
          <div className="flex flex-col">
            <label htmlFor="weight" className="text-sm font-medium mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              placeholder="e.g. 60"
              required
              className="border border-gray-300 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="height" className="text-sm font-medium mb-1">
              Height (cm)
            </label>
            <input
              type="number"
              id="height"
              name="height"
              placeholder="e.g. 170"
              required
              className="border border-gray-300 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="age" className="text-sm font-medium mb-1">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              placeholder="e.g. 20"
              required
              className="border border-gray-300 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="frequency" className="text-sm font-medium mb-1">
              Exercise Frequency (per week)
            </label>
            <select
              id="frequency"
              name="frequency"
              required
              className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Select —</option>
              <option value="none">0 times</option>
              <option value="normal">1–3 times</option>
              <option value="frequent">3–5 times</option>
              <option value="very frequent">More than 5 times</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="type" className="text-sm font-medium mb-1">
              Type of Exercise
            </label>
            <select
              id="type"
              name="type"
              required
              className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Select —</option>
              <option value="anaerobic">Anaerobic exercise</option>
              <option value="aerobic">Aerobic exercise</option>
            </select>
          </div>
        </form>

        <div className="mt-4 flex justify-end space-x-3 border-t pt-4 border-gray-200">
          <button
            type="button"
            onClick={onCancelModal}
            className="px-4 py-2 rounded-md text-black hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-green-300 text-black font-medium hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>
        </div>
      </div>
    </div>,
    target
  );
}

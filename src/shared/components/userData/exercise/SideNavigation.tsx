import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../ui/Button";
import { useCategory } from "../../../context/exercise/CategoryContext";
import { useExercise } from "../../../context/exercise/ExerciseContext";
import { s } from "framer-motion/client";

type TopCategory = "all" | "aerobic" | "anaerobic";
type SubCategory = "chest" | "back" | "leg" | "other";

const topLevel: TopCategory[] = ["all", "aerobic", "anaerobic"];
const subCategories: Record<
  Extract<TopCategory, "anaerobic">,
  SubCategory[]
> = {
  anaerobic: ["chest", "back", "leg", "other"],
};

export default function SideNavigation() {
  const { setId } = useExercise();
  const { category, setCategory } = useCategory();
  const [expanded, setExpanded] = useState<TopCategory | null>(null);
  const toggle = (cat: TopCategory) =>
    setExpanded((prev) => (prev === cat ? null : cat));

  function categoryHandler(cat: TopCategory) {
    toggle(cat);
    setCategory({ top: cat, sub: null });
    setId("");
  }
  function subCategoryHandler(sub: SubCategory) {
    setId("");
    setCategory((pre) => ({ ...pre, sub: sub }));
  }

  return (
    <aside className="bg-green-300 h-full w-1/6 flex items-start justify-center pt-8">
      {/* shrink nav to 75% of sidebar so buttons sit in from the edges */}
      <nav className="w-3/4">
        <ol className="flex flex-col gap-4">
          {topLevel.map((cat) => (
            <li key={cat}>
              <Button
                className={`w-full text-center hover:text-white ${
                  category.top === cat ? "text-white" : ""
                }`}
                onClick={() => categoryHandler(cat)}
              >
                <span className="capitalize">{cat}</span>
              </Button>

              <AnimatePresence initial={false}>
                {cat === "anaerobic" && expanded === cat && (
                  <motion.ol
                    className="overflow-hidden mt-2 pl-4 flex flex-col gap-2"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {subCategories.anaerobic.map((sub) => (
                      <li key={sub}>
                        <Button
                          className={`w-full text-center text-sm hover:text-white capitalize ${
                            category.sub === sub ? "text-white" : ""
                          }`}
                          onClick={() => subCategoryHandler(sub)}
                        >
                          {sub}
                        </Button>
                      </li>
                    ))}
                  </motion.ol>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ol>
      </nav>
    </aside>
  );
}

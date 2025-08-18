const baseUrl = import.meta.env.VITE_BACKEND_URL;
import type { Pool } from "../../../context/PoolConetext";
import { useEffect, useState } from "react";
import { useCategory } from "../../../context/diet/CategoryContext";
import { useDiet } from "../../../context/diet/DietManageContext";
import { useFood } from "../../../context/diet/FoodContext";
import useHttp from "../../../hooks/useHttp";
import Button from "../../ui/Button";
import { useAuth } from "../../../context/AuthContext";
import ErrorModal from "../ErrorModal";
import { useModal } from "../../../hooks/useModal";
import { useCustomizedFood } from "../../../context/CustomizedFoodContext";

export default function FoodGallery() {
  const { pool, setPool } = useCustomizedFood();
  const { show, modalCancelHandler, modalDisplayHandler } = useModal();
  const { user, token } = useAuth();
  const { setFoodId } = useFood();
  const { setState } = useDiet();
  const { category } = useCategory();
  const { sendRequest, isLoading, error } = useHttp<{ foods: Pool }>();

  useEffect(() => {
    async function fetchCustomizedFoodItems() {
      try {
        if (!user?.userId || !token) return;
        const responseData = await sendRequest({
          url: `${baseUrl}/pool/${user?.userId}/getCustomizedFood`,
          headers: { Authorization: `Bearer ${token}` },
        });
        setPool(responseData.foods);
      } catch (err) {
        modalDisplayHandler();
      }
    }
    fetchCustomizedFoodItems();
  }, [token, user?.userId]);

  if (show) {
    return (
      <ErrorModal title="Failed!" msg={error} onCancel={modalCancelHandler} />
    );
  }
  if (isLoading) {
    return <p className="p-4 text-center text-gray-500">Loading...</p>;
  }
  if (!pool || Object.keys(pool).length === 0 || show) {
    return <p className="p-4 text-center text-gray-500">No items available.</p>;
  }

  let items = Object.values(pool);
  switch (category) {
    case "all":
      break;
    case "staple":
    case "dairy":
    case "protein":
    case "vege":
    case "fruit":
    case "oil":
    case "nut":
      items = items.filter((item) => item.type === category);
      break;

    case "others":
      items = items.filter(
        (item) =>
          !["staple", "dairy", "protein", "vege", "oil", "nut"].includes(
            item.type
          )
      );
      break;

    default:
      items = [];
  }

  function recordFoodIdHandler(id: string) {
    setFoodId(id);
    setState("edit");
  }

  return (
    <>
      <div className="h-full overflow-y-auto">
        <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <li key={item._id}>
              <Button
                onClick={() => {
                  recordFoodIdHandler(item._id);
                }}
                className="flex flex-col items-center justify-center w-32 h-40 bg-white rounded-lg shadow hover:shadow-xl hover:bg-green-300 transition-shadow"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-full object-cover mb-2"
                />
                <span className="text-sm font-medium text-gray-800 text-center">
                  {item.name}
                </span>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

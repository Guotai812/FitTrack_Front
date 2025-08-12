import React, {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type DateItem = {
  year: number;
  month: number;
};

type Date = {
  current: DateItem;
  selected: DateItem;
  isCurrent: boolean;
};

type DateContext = {
  date: Date;
  forward: () => void;
  backward: () => void;
  recover: () => void;
  searchDate: (year: number, month: number) => void;
};

const dateContext = createContext<DateContext | undefined>(undefined);

export function DateContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [date, setDate] = useState<Date>({
    current: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    },
    selected: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
    },
    isCurrent: true,
  });

  function forward() {
    setDate((prev) => {
      const nextMonth =
        prev.selected.month === 12 ? 1 : prev.selected.month + 1;
      const nextYear =
        prev.selected.month === 12
          ? prev.selected.year + 1
          : prev.selected.year;

      const nextSelected = { year: nextYear, month: nextMonth };
      const isCurrent =
        nextSelected.year === prev.current.year &&
        nextSelected.month === prev.current.month;

      return {
        ...prev,
        selected: nextSelected,
        isCurrent,
      };
    });
  }
  function backward() {
    setDate((pre) => {
      const preMonth = pre.selected.month === 1 ? 12 : pre.selected.month - 1;
      const preYear =
        pre.selected.month === 1 ? pre.selected.year - 1 : pre.selected.year;
      const nextSelected = { year: preYear, month: preMonth };
      const isCurrent =
        nextSelected.year === pre.current.year &&
        nextSelected.month === pre.current.month;
      return {
        ...pre,
        selected: nextSelected,
        isCurrent,
      };
    });
  }
  function recover() {
    setDate({
      current: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      },
      selected: {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      },
      isCurrent: true,
    });
  }
  function searchDate(nextYear: number, nextMonth: number) {
    setDate((pre) => {
      const nextDate = { year: nextYear, month: nextMonth };
      const isCurrent =
        pre.current.year === nextYear && pre.current.month === nextMonth;
      return {
        ...pre,
        selected: nextDate,
        isCurrent,
      };
    });
  }
  return (
    <dateContext.Provider
      value={{ date, forward, backward, recover, searchDate }}
    >
      {children}
    </dateContext.Provider>
  );
}

export function useDate() {
  const context = useContext(dateContext);
  if (!context) {
    throw new Error("useDate must be used within an DateContextProvider");
  }
  return context;
}

"use client";
import useSWR, { useSWRConfig } from "swr";
import { fetcher } from "@/helpers/fetcher";
import { Task } from "@/interfaces/task";
import { useState, useEffect } from "react";

const ClearCompleted = () => {
  const [disableBtn, setDisableBtn] = useState(false);

  const { mutate } = useSWRConfig();
  const { data } = useSWR(`${process.env.NEXT_PUBLIC_LOCAL}/tasks`, fetcher, {
    revalidateOnMount: false,
  });

  const clearAllArchiveData = () => {
    data.filter((el: Task, index: number) => {
      if (el.status === "complete") {
        mutate(`${process.env.NEXT_PUBLIC_LOCAL}/tasks`, async () => {
          await fetch(`${process.env.NEXT_PUBLIC_LOCAL}/tasks/${el.id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data[index]),
          });
        });
      }
    });
  };

  useEffect(() => {
    if (data.length == 0) {
      setDisableBtn(true);
    }

    data.filter((el: Task) => {
      if (el.status === "complete") {
        setDisableBtn(false);
      } else {
        setDisableBtn(true);
      }
    });
  }, [data]);

  return (
    <button
      className={
        disableBtn
          ? "bg-gray-300 rounded-md pl-2 pr-2 "
          : "bg-cyan-300 rounded-md pl-2 pr-2"
      }
      onClick={clearAllArchiveData}
      disabled={disableBtn}
    >
      Clear completed
    </button>
  );
};
export default ClearCompleted;

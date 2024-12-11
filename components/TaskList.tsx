"use client";
import { fetcher } from "@/helpers/fetcher";
import useSWR, { useSWRConfig } from "swr";
import { Task } from "@/interfaces/task";
import { Circle, CircleCheckBig } from "lucide-react";
import ClearCompleted from "@/components/ClearCompleted";
import { useState, useEffect } from "react";

const ActiveTaskList = () => {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_LOCAL}/tasks`,
    fetcher
  );

  const [localData, setLocalData] = useState(data || []);

  useEffect(() => {
    if (data) setLocalData(data);
  }, [data]);

  const { mutate } = useSWRConfig();

  if (error) return <div>failed to load task list</div>;
  if (isLoading) return <div>...loading...</div>;

  const startComplete = (id: number) => {
    mutate(
      `${process.env.NEXT_PUBLIC_LOCAL}/tasks`,
      async (todos) => {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_LOCAL}/tasks/${id}`,
          {
            method: "PATCH",
            body: JSON.stringify({ status: "complete" }),
          }
        );
        const updatedTodo = await response.json();
        const updatedTodos = todos.map((todo: Task) =>
          todo.id === id ? updatedTodo : todo
        );

        return updatedTodos;
      },
      { revalidate: false }
    );
  };

  const filteredTasks = localData.filter((task: Task) => {
    if (filter === "active") return task.status === "active";
    if (filter === "completed") return task.status === "complete";
    return true;
  });

  return (
    <>
      <ul>
        {localData.length > 0 ? (
          filteredTasks.map((el: Task) => (
            <li
              key={el.id}
              onClick={() => startComplete(el.id)}
              className='relative border border-black pl-10 pt-1 pb-1 cursor-pointer'
            >
              <div className='absolute left-1'>
                {el.status === "active" ? <Circle /> : <CircleCheckBig />}
              </div>
              <div>{el.title}</div>
            </li>
          ))
        ) : (
          <span>Not any tasks</span>
        )}
      </ul>
      <div className='flex justify-between pt-5'>
        <div>
          {data?.filter((el: Task) => el.status !== "complete").length} items
          left
        </div>
        <div>
          <button
            className={
              filter == "all"
                ? "border border-amber-400 p-1 "
                : "border border-transparent p-1 "
            }
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={
              filter == "active"
                ? "border border-amber-400 p-1 mr-2 ml-2 "
                : "border border-transparent p-1 mr-2 ml-2"
            }
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={
              filter == "completed"
                ? "border border-amber-400 p-1 "
                : "border border-transparent p-1"
            }
            onClick={() => setFilter("completed")}
          >
            Completed
          </button>
        </div>
        <div>
          <ClearCompleted />
        </div>
      </div>
    </>
  );
};
export default ActiveTaskList;

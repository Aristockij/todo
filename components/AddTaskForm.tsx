"use client";

import { useSWRConfig } from "swr";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Task } from "@/interfaces/task";

const AddTaskForm = () => {
  const [disableBtn, setDisableBtn] = useState(false);

  const { mutate } = useSWRConfig();

  const [title, setTitle] = useState("");

  const addActive = () => {
    const id = crypto.randomUUID();
    const newTask = { id, title, status: "active" };

    mutate(
      `${process.env.NEXT_PUBLIC_LOCAL}/tasks`,
      async (tasks: Task[]) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_LOCAL}/tasks`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTask),
        });

        const createdTask = await response.json();

        return [...tasks, createdTask];
      },
      { revalidate: false }
    );

    setTitle("");
  };

  useEffect(() => {
    if (title.length > 0) {
      setDisableBtn(false);
    } else {
      setDisableBtn(true);
    }
  }, [title.length]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addActive();
      }}
    >
      <div className='relative'>
        <input
          type='text'
          value={title}
          className='outline-none border border-slate-950  pl-10 h-8 w-full '
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type='submit'
          className={
            disableBtn
              ? " pl-1 pr-2 mt-2 rounded-lg absolute bottom-0 left-0  h-full "
              : " pl-1 pr-2 mt-2 rounded-lg absolute bottom-0 left-0  h-full "
          }
          disabled={disableBtn}
        >
          <ChevronDown color={disableBtn ? "gray" : "black"} size={25} />
        </button>
      </div>
    </form>
  );
};
export default AddTaskForm;

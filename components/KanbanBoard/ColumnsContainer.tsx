"use client";
import React, { useMemo } from "react";
import { Columns, Tasks } from "./types";
import { Button } from "../ui/button";
import { MdDeleteForever } from "react-icons/md";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";

type Props = {
  id: string;
  columns: Columns;
  tasks: Tasks[];
  handleEdit: (id: number | string) => void;
  handleRemoveTask: (id: number | string) => void;
  isSubmitting: boolean;
};

const ColumnsContainer = (props: Props) => {
  const { columns, tasks, id, handleEdit, handleRemoveTask, isSubmitting } = props;
  const taskId = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const { setNodeRef } = useDroppable({
    id: columns.id, // very important: use column id here!
    data: {
      type: "Column",
      column: columns,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="w-[360px] h-[calc(100vh-10rem)] flex flex-col max-h-[calc(100vh-10rem)] rounded-md bg-card shadow-md"
    >
      <div className="h-16 rounded-b-none rounded-md text-lg cursor-grab p-3 font-bold border-4 border-border flex justify-between ">
        <div className="flex gap-2">{columns.title}</div>
        <div className="bg-background flex items-center justify-center py-1 px-2 text-sm rounded-full">
          {tasks.length}
        </div>
      </div>
      <div className="flex flex-col flex-grow gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={taskId} strategy={verticalListSortingStrategy}>
          {tasks.map((task, idx) => (
            <TaskCard
              handleEdit={handleEdit}
              handleRemoveTask={handleRemoveTask}
              key={`${task.id}_${idx}`}
              task={task}
              isSubmitting={isSubmitting}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};
export default ColumnsContainer;

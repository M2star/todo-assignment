import React, { useState } from "react";
import { Tasks } from "./types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface Props {
  task: Tasks;
  handleRemoveTask: (id: number | string) => void;
  handleEdit: (id: number | string) => void;
}

const TaskCard = (props: Props) => {
  const { task, handleRemoveTask, handleEdit } = props;
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const {
    transform,
    transition,
    setNodeRef,
    attributes,
    listeners,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: isEdit,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      style={style}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="bg-background group break-words w-full p-2.5 h-[100px] min-h-[100px] text-left flex items-center rounded-xl hover:ring-2 hover:ring-inset hover:ring-orange-300 cursor-grab relative"
    >
    <div className="flex-1">
      <p className="text-sm text-gray-500">id:{task.id}</p>
      <p className="text-base font-semibold">{task.title}</p>
      <p  className="text-sm text-gray-500">{task.description}</p>
    </div>
      <div className="flex flex-col">
        <Button
          onClick={(e) => {
            handleEdit(task.id);
          }}
          className="w-12 cursor-pointer hover:bg-green-300 bg-green-200  h-full rounded-b-none  items-center rounded-r-2xl rounded-l-none text-xl text-green-600 justify-center  "
        >
          <MdEdit />
        </Button>
        <Button
          onClick={(e) => {
            handleRemoveTask(task.id);
          }}
          className="w-12 cursor-pointer bg-red-100 h-full rounded-t-none   items-center rounded-br-2xl rounded-l-none text-xl text-red-600 justify-center  "
        >
          <MdDeleteForever />
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;

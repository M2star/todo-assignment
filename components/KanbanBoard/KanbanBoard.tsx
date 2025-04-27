"use client";
import React, { act, useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { genrateId } from "@/utils/genrateId";
import { Columns, Tasks } from "./types";
import ColumnsContainer from "./ColumnsContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { createTask, deleteTask, getTasks, updateTask } from "@/service";
import { initialBoard } from "./data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const KanbanBoard = () => {
  // const [columns, setColumns] = useState<Columns[]>([]);
  const [isMount, setIsMount] = useState<Boolean>(false);
  const [activeTasks, setActiveTasks] = useState<Tasks | null>(null);
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [isFrom, setIsFrom] = useState<boolean>(false);
  const [editId, setEditId] = useState<number | string>("");
  const [formData, setFormData] = useState({
    title: "",
    status: "todo",
    description: "",
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );
  
  const syncTasks = async () => {
    try {
      const resp = await getTasks();
      if (resp.status === 200) {
        const modifiedTasks = resp.data.map((task: Tasks, index: number) => ({
          ...task,
          status: task.completed ? "done" : "todo",
          order: index,
        }));
        setTasks(modifiedTasks);
      }else{
        toast("Failed to fetch", {
          description: resp.data?.message || resp.data.error || "Something went wrong, please try again later."
        })
      }
    } catch (error) {
      toast("Failed to fetch", {
        description:"Something went wrong, please try again later.",
      })
    }
  };


  const handleCreateTask = async () => {
    try {
      const newTask: Tasks = {
        id: tasks.length + 1,
        completed: formData.status === "done" ? true : false,
        userId: 1,
        ...formData,
      };
      const resp = await createTask(newTask);
      if (resp.status === 201) {
        setTasks((prev) => [newTask, ...prev]);
        setIsFrom(false);
      }else{
        toast("Failed to create task", {
          description: resp.data?.message || resp.data?.error  ||"Something went wrong, please try again later.",
        })
      }
    } catch (error) {
      toast("Failed to create task", {
        description:"Something went wrong, please try again later.",
      })
    }
  };

  const handleRemoveTask = async (id: Tasks["id"]) => {
    try {
      const resp = await deleteTask(id);
      if (resp.status === 200) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      }else{
        toast("Failed to deleted task", {
          description: resp.data?.message || resp.data?.error  ||"Something went wrong, please try again later.",
        })
      }
    } catch (error) {
      toast("Failed to delete task", {
        description:"Something went wrong, please try again later.",
      })
    }
  };

  const handleUpdateTask = async () => {
    try {
      const body = {
        id: editId,
        completed: formData.status === "done" ? true : false,
        userId: 1,
        ...formData,
      };
      const resp = await updateTask(editId, body);
      if (resp.status === 200) {
        setTasks((prev) =>
          prev.map((task) => (task.id === editId ? { ...task, ...body } : task))
        );
        setIsFrom(false);
        setEditId("");
      }else{
        toast("Failed to update task", {
          description: resp.data?.message || resp.data?.error  ||"Something went wrong, please try again later.",
        })
      }
    } catch (error) {
      toast("Failed to update", {
        description:"Something went wrong, please try again later.",
      })
    }
  };

 

  const columns = useMemo(() => {
    return initialBoard(tasks);
  }, [tasks]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (id: Tasks["id"]) => {
    const task = tasks.find((task) => task.id === id);
    if (!task) return;
    setFormData({
      title: task.title,
      status: task.status ?? "todo",
      description: task.description ?? "",
    });
    setIsFrom(true);
    setEditId(id);
  };

  const handleClose = () => {
    setIsFrom(prev => !prev);
    setEditId("");
  }


  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;
    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;
    if (activeType === "Task" && overType === "Task") {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === active.id);
        const overIndex = prev.findIndex((t) => t.id === over.id);
        prev[activeIndex].status = prev[overIndex].status;
        return arrayMove(prev, activeIndex, overIndex);
      });
    }
    if (activeType === "Task" && overType === "Column") {
      setTasks((prev) => {
        const activeIndex = prev.findIndex((t) => t.id === active.id);
        console.log(activeIndex, over.id);
        prev[activeIndex].status = over.id.toString();
        return arrayMove(prev, activeIndex, activeIndex);
      });
    }
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTasks(event.active.data.current.task);
      return;
    }
  };

  useEffect(() => {
    syncTasks();
    setIsMount(true);
  }, []);

  return (
    <div className="min-h-screen p-10 ">
      <div className="flex justify-between mb-8">
        <p className="text-2xl font-bold">Task management </p>
        <Dialog open={isFrom} onOpenChange={handleClose}>
          <DialogTrigger asChild>
            <Button>Add Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Task" : "Create Task"}</DialogTitle>
              <DialogDescription>
                {editId
                  ? "Update the details of your task. Changes will be saved immediately."
                  : "Fill in the details below to create a new task."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleOnChange}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  type="text"
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleOnChange}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status ?? ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">Todo</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={() => (editId ? handleUpdateTask() : handleCreateTask())}>
                {editId ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex  items-center m-auto  overflow-x-auto overflow-y-hidden w-full">
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          <div className="mx-auto flex gap-4">
            <div className="flex gap-4">
              {columns.map((column) => (
                <ColumnsContainer
                  key={column.id}
                  id={String(column.id)}
                  columns={column}
                  tasks={tasks.filter((task) => task.status === column.id)}
                  handleRemoveTask={handleRemoveTask}
                  handleEdit={handleEdit}
                />
              ))}
            </div>
            <DragOverlay>
              {isMount &&
                activeTasks &&
                createPortal(
                  <TaskCard
                    handleEdit={handleEdit}
                    handleRemoveTask={handleRemoveTask}
                    task={activeTasks}
                  />,
                  document.body
                )}
            </DragOverlay>
            {/* <Button className="min-w-[360px] w-[360px]" onClick={createColumns}>
            Add Column
          </Button> */}
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default KanbanBoard;

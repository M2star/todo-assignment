import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";

export const getTasks = async () => {
  const tasks = await axiosInstance.get("/todos");
  return tasks;
};

export const createTask = async (body: {}) => {
  const tasks = await axiosInstance.post("/todos", body);
  return tasks;
};

export const deleteTask = async (id: number | string) => {
  const tasks = await axiosInstance.delete(`/todos/${id}`);
  return tasks;
};

export const updateTask = async (id: number | string, body: {}) => {
  const tasks = await axiosInstance.put(`/todos/${id}`, body);
  return tasks;
};

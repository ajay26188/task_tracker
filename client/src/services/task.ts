import axios from "axios";
import type { Task } from "../types/task";
import { apiBaseUrl } from "../constants";
import { authHeader } from "../utils/auth";

// Fetch all tasks for a project
export const fetchTasksByProject = async (projectId: string): Promise<Task[]> => {
  const res = await axios.get(`${apiBaseUrl}/tasks/project/${projectId}`, authHeader());
  return res.data;
};

// Fetch single task
export const fetchTask = async (id: string): Promise<Task> => {
  const res = await axios.get(`${apiBaseUrl}/tasks/${id}`, authHeader());
  return res.data;
};

// Create task
export const createTask = async (data: Partial<Task>): Promise<Task> => {
  const res = await axios.post(`${apiBaseUrl}/tasks`, data, authHeader());
  return res.data;
};

// Update task
export const updateTask = async (id: string, data: Partial<Task>): Promise<Task> => {
  const res = await axios.put(`${apiBaseUrl}/tasks/${id}`, data, authHeader());
  return res.data;
};

// Delete task
export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${apiBaseUrl}/tasks/${id}`, authHeader());
};

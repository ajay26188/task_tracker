import axios from "axios";
import type { PaginatedTasks, Task, TaskPayload } from "../types/task";
import { apiBaseUrl } from "../constants";
import { authHeader } from "../utils/auth";

//fetching all projects belonging to an organization id is organization's id
export const fetchTasksByOrg = async (id: string, page: number, limit: number): Promise<PaginatedTasks> => {
  const res = await axios.get(`${apiBaseUrl}/tasks/org/${id}?page=${page}&limit=${limit}`, authHeader());
  return res.data;
};

//fetching tasks assigned to an user
export const fetchTasksByUser = async (page: number, limit: number): Promise<PaginatedTasks> => {
  const res = await axios.get(`${apiBaseUrl}/tasks/assigned?page=${page}&limit=${limit}`, authHeader());
  return res.data;
};

// Fetch single task
export const fetchTask = async (id: string): Promise<Task> => {
  const res = await axios.get(`${apiBaseUrl}/tasks/task/${id}`, authHeader());
  return res.data;
};

// Create task
export const createTask = async (data: Partial<TaskPayload>): Promise<Task> => {
  const res = await axios.post(`${apiBaseUrl}/tasks`, data, authHeader());
  return res.data;
};

// Update task
export const updateTask = async (id: string, data: Partial<TaskPayload>): Promise<Task> => {
  const res = await axios.patch(`${apiBaseUrl}/tasks/${id}`, data, authHeader());
  return res.data;
};

// Delete task
export const deleteTask = async (id: string): Promise<void> => {
  await axios.delete(`${apiBaseUrl}/tasks/${id}`, authHeader());
};

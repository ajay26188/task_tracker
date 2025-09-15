// src/pages/task/Tasks.tsx
import { useEffect, useState } from "react";
import {
  fetchTasksByOrg,
  fetchTasksByUser,
  updateTask,
  deleteTask,
} from "../../services/task";
import TaskModal from "./TaskModal";
import type { Task, TaskStatus, TaskPriority, TaskPayload } from "../../types/task";
import { useAuth } from "../../context/AuthContext";

type StatusFilter = "all" | TaskStatus;
type PriorityFilter = "all" | TaskPriority;
type DueDateFilter = "all" | "past30" | "past7" | "today" | "next7" | "next30";


const Tasks: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [dueDateFilter, setDueDateFilter] = useState<DueDateFilter>("all");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  // Load tasks
  useEffect(() => {
    const loadTasks = async () => {
      if (!user) return;
      try {
        const data =
          user.role === "admin"
            ? await fetchTasksByOrg(user.organizationId)
            : await fetchTasksByUser();
        setTasks(data);
        setFilteredTasks(data);
      } catch {
        setError("Failed to fetch tasks. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, [user]);

  // Filter tasks
  useEffect(() => {
    let filtered = [...tasks];
  
    // Search in title + assigned users
    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          (t.assignedTo?.some((u) =>
            (u.name || "").toLowerCase().includes(query)
          ) ?? false)
      );
    }
  
    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }
  
    if (priorityFilter !== "all") {
      filtered = filtered.filter((t) => t.priority === priorityFilter);
    }
  
    if (dueDateFilter !== "all") {
      const today = new Date().setHours(0, 0, 0, 0);
    
      filtered = filtered.filter((t) => {
        if (!t.dueDate) return false;
        const taskDate = new Date(t.dueDate).setHours(0, 0, 0, 0);
  
        if (dueDateFilter === "today") return taskDate === today;
    
        const diffDays = Math.floor(
          (today - taskDate) / (1000 * 60 * 60 * 24)
        );
    
        if (dueDateFilter === "past7") return diffDays >= 0 && diffDays <= 7;
        if (dueDateFilter === "past30") return diffDays >= 0 && diffDays <= 30;
        if (dueDateFilter === "next7")
          return taskDate >= today && taskDate <= today + 7 * 24 * 60 * 60 * 1000;
        if (dueDateFilter === "next30")
          return taskDate >= today && taskDate <= today + 30 * 24 * 60 * 60 * 1000;
    
        return true;
      });
    }
    
  
    setFilteredTasks(filtered);
  }, [search, statusFilter, priorityFilter, dueDateFilter, tasks]);
  

  // Update task
  const handleUpdate = async (task: Task, updates: Partial<TaskPayload>) => {
    try {
      const updated = await updateTask(task.id, updates);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  // Delete task
  const handleDelete = async () => {
    if (!deleteTaskId) return;
    try {
      await deleteTask(deleteTaskId);
      setTasks((prev) => prev.filter((t) => t.id !== deleteTaskId));
    } catch (err) {
      console.error("Failed to delete task", err);
    } finally {
      setDeleteTaskId(null);
    }
  };

  // Skeleton loader
  const renderSkeleton = () => (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, idx) => (
        <div
          key={idx}
          className="p-5 rounded-2xl bg-gray-200 animate-pulse h-40"
        ></div>
      ))}
    </div>
  );

  return (
    <div className="p-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Search by task or assignee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="min-w-[250px] sm:min-w-[300px] border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) =>
              setPriorityFilter(e.target.value as PriorityFilter)
            }
            className="border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            value={dueDateFilter}
            onChange={(e) => setDueDateFilter(e.target.value as DueDateFilter)}
            className="border rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Due Dates</option>
            <option value="past7">Past 7 Days</option>
            <option value="past30">Past 30 Days</option>
            <option value="today">Today</option>
            <option value="next7">Next 7 Days</option>
            <option value="next30">Next 30 Days</option>
          </select>

        </div>
      </div>

      {/* Loading & Empty States */}
      {loading ? (
        renderSkeleton()
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : filteredTasks.length === 0 ? (
        <p className="text-gray-500">No tasks found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="relative block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-5 border border-gray-100 overflow-hidden"
            >
              <div className="mt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-gray-800">
                    {task.title}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full w-fit ${
                      task.priority === "high"
                        ? "bg-red-100 text-red-700"
                        : task.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {task.priority || "-"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{task.status}</p>
                {task.dueDate && (
                  <p className="text-sm text-gray-400">
                    Due: {task.dueDate.slice(0, 10)}
                  </p>
                )}

                {/* Admin actions */}
                {user?.role === "admin" ? (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setSelectedTask(task);
                        setShowTaskModal(true);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteTaskId(task.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <select
                      value={task.status}
                      onChange={(e) =>
                        handleUpdate(task, {
                          status: e.target.value as TaskStatus,
                        })
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && selectedTask && (
        <TaskModal
          task={selectedTask}
          projectId={selectedTask.projectId}
          orgId={selectedTask.organizationId}
          onClose={() => {
            setShowTaskModal(false);
            setSelectedTask(null);
          }}
          onSuccess={(updatedTask) => {
            setTasks((prev) =>
              prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
            );
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteTaskId && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm transform transition-transform duration-200 scale-95 animate-scale-in">
            <h2 className="text-lg font-semibold mb-4">Delete Task</h2>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete this task?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTaskId(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;

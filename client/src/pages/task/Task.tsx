// src/pages/task/TaskPage.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTask } from "../../services/task";
import type { Task } from "../../types/task";
import {
  Calendar,
  Users,
  ClipboardList,
  Clock,
  RefreshCcw,
  Folder,
  Building,
} from "lucide-react"; 
import type { Project } from "../../types/project";
import { fetchProject } from "../../services/project";

const TaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTask = async () => {
      if (!id) return;
      try {
        const data = await fetchTask(id);
        setTask(data);

        // Fetch related project
        if (data.projectId) {
            const projectData = await fetchProject(data.projectId);
            setProject(projectData);
          }
      } catch (err) {
        console.error(err);
        setError("Failed to load task.");
      } finally {
        setLoading(false);
      }
    };
    loadTask();
  }, [id]);

  if (loading)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="p-6 w-full max-w-lg bg-white rounded-2xl animate-pulse">
          Loading...
        </div>
      </div>
    );

  if (error)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="p-6 w-full max-w-lg bg-white rounded-2xl text-red-600">
          {error}
          <button
            className="ml-4 px-3 py-1 bg-gray-200 rounded"
            onClick={() => navigate(-1)}
          >
            Close
          </button>
        </div>
      </div>
    );

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-y-auto max-h-[90vh]">
        <div className="p-6 relative">
          {/* Close Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {task.title}
            </h2>
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  task.status === "done"
                    ? "bg-green-100 text-green-700"
                    : task.status === "in-progress"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {task.status}
              </span>
              <span
                className={`px-3 py-1 text-sm rounded-full ${
                  task.priority === "high"
                    ? "bg-red-100 text-red-700"
                    : task.priority === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {task.priority || "No priority"}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
              <ClipboardList className="w-4 h-4" /> Description
            </h3>
            <p className="text-gray-600">
              {task.description || "No description available."}
            </p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <strong>Due:</strong>{" "}
              {task.dueDate ? task.dueDate.slice(0, 10) : "-"}
            </div>
            <div className="flex items-center gap-2">
              <Folder className="w-4 h-4 text-gray-500" />
              <strong>Project:</strong> {project?.name}
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-500" />
              <strong>Organization:</strong> {task.organizationId}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <strong>Created:</strong>{" "}
              {task.createdAt
                ? new Date(task.createdAt).toLocaleString()
                : "-"}
            </div>
            <div className="flex items-center gap-2">
              <RefreshCcw className="w-4 h-4 text-gray-500" />
              <strong>Updated:</strong>{" "}
              {task.updatedAt
                ? new Date(task.updatedAt).toLocaleString()
                : "-"}
            </div>
          </div>

          {/* Assigned Users */}
          {task.assignedTo && task.assignedTo.length > 0 && (
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" /> Assigned Users
              </h3>
              <ul className="space-y-1 text-gray-700">
                {task.assignedTo.map((user) => (
                  <li
                    key={user.id}
                    className="flex items-center gap-2 text-sm"
                  >
                    <span className="font-medium">{user.name}</span>{" "}
                    <span className="text-gray-500">({user.email})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskPage;

// src/pages/project/Project.tsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProject } from "../../services/project";
import type { Project } from "../../types/project";
import type { Task } from "../../types/task";
import TaskModal from "../task/TaskModal";
import { useAuth } from "../../context/AuthContext";


const ProjectPage: React.FC = () => {
  const {user} =useAuth();
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);


  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;
      try {
        const data = await fetchProject(id);
        setProject(data);
      } catch {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  const renderSkeleton = () => (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-gray-200 animate-pulse h-48"></div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl bg-gray-200 animate-pulse h-28"
          ></div>
        ))}
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
        <div className="max-w-5xl mx-auto">{renderSkeleton()}</div>
      </div>
    );

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!project) return <p className="p-6 text-gray-500">Project not found.</p>;

  const getTaskStats = () => {
    if (!project?.tasks) return { todo: 0, inprogress: 0, done: 0 };

    return project.tasks.reduce(
      (acc, task: string | Partial<Task>) => {
        if (typeof task === "object" && task.status) {
          if (task.status === "done") acc.done += 1;
          else if (task.status === "in-progress") acc.inprogress += 1;
          else acc.todo += 1;
        } else {
          acc.todo += 1;
        }
        return acc;
      },
      { todo: 0, inprogress: 0, done: 0 }
    );
  };

  const { todo, inprogress, done } = getTaskStats();

  const getStatusBadge = (project: Project) => {
    const now = new Date();
    const start = project.startDate ? new Date(project.startDate) : null;
    const end = project.endDate ? new Date(project.endDate) : null;

    if (end && end < now)
      return (
        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
          Completed
        </span>
      );
    if (start && start > now)
      return (
        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">
          Upcoming
        </span>
      );
    return (
      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
        Active
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Project Header */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-24"></div>
          <div className="p-6 -mt-12 relative">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {project.name} {getStatusBadge(project)}
              </h1>
              <p className="text-gray-600 mb-4">{project.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                <span>
                  📅 <strong>Start:</strong>{" "}
                  {project.startDate?.slice(0, 10) || "-"}
                </span>
                <span>
                  ⏰ <strong>End:</strong>{" "}
                  {project.endDate?.slice(0, 10) || "-"}
                </span>

                <span>
                  🏢 <strong>Organization:</strong> 
                  {" "}
                  {project.organizationId && typeof project.organizationId === "object"
                    ? project.organizationId
                    : "N/A"}
                </span>
                <span>
                  👤 <strong>Created By:</strong>{" "}
                  {project.createdBy && typeof project.createdBy === "object"
                    ? project.createdBy.name
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              ✅ Tasks
              <span className="ml-3 text-sm text-gray-500">
                {todo} To Do · {inprogress} In Progress · {done} Done
              </span>
            </h2>
            {user?.role === 'admin' && (   // only admins see this button
              <button
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => setShowTaskModal(true)}
              >
                + Add Task
              </button>
            )}
          </div>

          {project.tasks && project.tasks.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2">
              {project.tasks.map((task, index) =>
                typeof task === "string" ? (
                  <li
                    key={task}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                  >
                    Task ID: {task}
                  </li>
                ) : (
                  <li
                    key={task.id || index}
                    className="p-5 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-lg transition cursor-pointer"
                  >
                    <Link
                      to={`/tasks/${task.id}`}
                      className="flex flex-col justify-between h-full"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-indigo-600 hover:underline text-lg">
                          {task.title}
                        </span>

                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            task.status === "done"
                              ? "bg-green-100 text-green-700"
                              : task.status === "in-progress"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {task.status === "done"
                            ? "Done"
                            : task.status === "in-progress"
                            ? "In Progress"
                            : "To Do"}
                        </span>
                      </div>
                    </Link>
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No tasks added yet.</p>
          )}
          {showTaskModal && (
            <TaskModal
              task={null}
              projectId={project.id}
              orgId={project.organizationId}
              onClose={() => setShowTaskModal(false)}
              onSuccess={(newTask) => {
                setProject((prev) =>
                  prev
                    ? { ...prev, tasks: [...(prev.tasks || []), newTask] }
                    : prev
                );
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;

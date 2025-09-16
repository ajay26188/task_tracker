import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProject } from "../../services/project";
import type { Project } from "../../types/project";
import type { Task } from "../../types/task";
import TaskModal from "../task/TaskModal";
import { useAuth } from "../../context/AuthContext";

const ProjectPage: React.FC = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      if (!id) return;
      try {
        const data = await fetchProject(id);
        console.log(data.tasks);
        setProject(data);
      } catch {
        setError("Failed to load project");
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  

  // Filter tasks by title or assignee
  const filteredTasks = project?.tasks?.filter((task) => {
    if (typeof task === "string") return false;
    const query = search.toLowerCase();
    return (
      task.title?.toLowerCase().includes(query) ||
      task.assignedTo?.some((user) =>
        user.name?.toLowerCase().includes(query)
      )
    );
  }) || [];


  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
        <div className="animate-pulse space-y-6 w-full max-w-4xl">
          <div className="h-48 bg-gray-200 rounded-2xl"></div>
          <div className="h-32 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );

  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!project) return <p className="p-6 text-gray-500">Project not found.</p>;

  // Task stats
  const getTaskStats = () => {
    if (!project?.tasks) return { todo: 0, inprogress: 0, done: 0 };
    return project.tasks.reduce(
      (acc, task: string | Partial<Task>) => {
        if (typeof task === "object" && task.status) {
          if (task.status === "done") acc.done += 1;
          else if (task.status === "in-progress") acc.inprogress += 1;
          else acc.todo += 1;
        } else acc.todo += 1;
        return acc;
      },
      { todo: 0, inprogress: 0, done: 0 }
    );
  };

  const { todo, inprogress, done } = getTaskStats();

  // Status badge
  const getStatusBadge = (project: Project) => {
    const now = new Date();
    const start = project.startDate ? new Date(project.startDate) : null;
    const end = project.endDate ? new Date(project.endDate) : null;
    if (end && end < now)
      return (
        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
          Completed
        </span>
      );
    if (start && start > now)
      return (
        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
          Upcoming
        </span>
      );
    return (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
        Active
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Project Header */}
        <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
          <div className="p-6 -mt-12 relative">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                {project.name}
              </h1>
              <div className="mb-4">{getStatusBadge(project)}</div>
              <p className="text-gray-600 mb-6">{project.description}</p>

              <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-700">
                <span>🆔 <strong>ID:</strong> {project.id}</span>
                <span>📅 <strong>Start:</strong> {project.startDate?.slice(0, 10) || "-"}</span>
                <span>⏰ <strong>End:</strong> {project.endDate?.slice(0, 10) || "-"}</span>
                <span>🏢 <strong>Organization:</strong> {project.organizationId}</span>
                <span>👤 <strong>Created By:</strong> {typeof project.createdBy === "object" ? project.createdBy?.name : "N/A"}</span>
                <span>🕒 <strong>Created At:</strong> {project.createdAt?.slice(0, 10) || "-"}</span>
                <span>♻️ <strong>Updated At:</strong> {project.updatedAt?.slice(0, 10) || "-"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              Tasks
              <span className="ml-3 text-sm text-gray-500 font-normal">
                {todo} To Do · {inprogress} In Progress · {done} Done
              </span>
            </h2>

            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="🔍 Search tasks by title or assignee..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
              />
              {user?.role === "admin" && (
                <button
                  className="px-4 py-2 text-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 shadow-md transition"
                  onClick={() => setShowTaskModal(true)}
                >
                  + Add Task
                </button>
              )}
            </div>
        </div>

        

          {filteredTasks.length > 0 ? (
            <ul className="grid gap-4 sm:grid-cols-2">
              {filteredTasks.map((task, index) =>
                typeof task === "string" ? (
                  <li key={task} className="p-4 border rounded-lg bg-gray-50 text-gray-600">
                    Task ID: {task}
                  </li>
                ) : (
                  <li
                    key={task.id || index}
                    className="p-5 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-lg transition"
                  >
                    <Link to={`/tasks/task/${task.id}`} className="block">
                      <div className="flex items-center justify-between mb-2">
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
                      <p className="text-sm text-gray-500 line-clamp-2">{task.description}</p>
                    </Link>
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No tasks found.</p>
          )}

          {showTaskModal && (
            <TaskModal
              task={null}
              projectId={project.id}
              orgId={project.organizationId}
              onClose={() => setShowTaskModal(false)}
              onSuccess={(newTask) => {
                setProject((prev) =>
                  prev ? { ...prev, tasks: [...(prev.tasks || []), newTask] } : prev
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

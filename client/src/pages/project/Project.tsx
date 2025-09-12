// src/pages/project/ProjectPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProject } from "../../services/project";
import type { Project } from "../../types/project";

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p className="p-6">Loading project...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!project) return <p className="p-6 text-gray-500">Project not found.</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Project Header */}
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-24"></div>
          <div className="p-6 -mt-12 relative">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {project.name}
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
                  🏢 <strong>Org:</strong> {project.organizationId || "N/A"}
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
              <span className="ml-2 text-sm text-gray-500">
                ({project.tasks?.length || 0})
              </span>
            </h2>
            <button
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              onClick={() => alert("Add Task coming soon!")}
            >
              + Add Task
            </button>
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
                    className="p-5 border border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:shadow-lg transition flex flex-col justify-between"
                  >
                    <Link
                      to={`/tasks/${task.id}`}
                      className="font-semibold text-indigo-600 hover:underline text-lg"
                    >
                      {task.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                      Click to view details
                    </p>
                  </li>
                )
              )}
            </ul>
          ) : (
            <p className="text-gray-500 italic">No tasks added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;

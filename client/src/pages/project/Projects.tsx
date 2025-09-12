import { useEffect, useState } from "react";
import {
  fetchProjectsByOrg,
  fetchAssignedProjects,
  deleteProject,
} from "../../services/project";
import ProjectModal from "./ProjectModal";
import type { Project } from "../../types/project";
import { Link } from "react-router-dom";

interface ProjectsProps {
  isAdmin: boolean;
  orgId: string;
}

const Projects: React.FC<ProjectsProps> = ({ isAdmin, orgId }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = isAdmin
          ? await fetchProjectsByOrg(orgId)
          : await fetchAssignedProjects();

        setProjects(data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [isAdmin, orgId]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        {isAdmin && (
          <button
            onClick={() => {
              setSelectedProject(null);
              setShowModal(true);
            }}
            className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-colors shadow-md"
          >
            + New Project
          </button>
        )}
      </div>

      {/* Loading & Empty States */}
      {loading ? (
        <p className="text-gray-600">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500">No projects found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/project/${project.id}`}
              className="relative block bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-5 border border-gray-100 overflow-hidden"
            >
              {/* Gradient Accent */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-t-2xl"></div>

              <div className="mt-3">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {project.name}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-3">
                  {project.description}
                </p>
                <div className="mt-3 text-sm text-gray-400 flex justify-between">
                  <span>📅 {project.startDate?.slice(0, 10) || "-"}</span>
                  <span>⏰ {project.endDate?.slice(0, 10) || "-"}</span>
                </div>
              </div>

              {isAdmin && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // stop link navigation
                      setSelectedProject(project);
                      setShowModal(true);
                    }}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault(); // stop link navigation
                      setDeleteProjectId(project.id);
                    }}
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Project Modal */}
      {showModal && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setShowModal(false)}
          onSuccess={(p) => {
            if (selectedProject) {
              setProjects((prev) =>
                prev.map((proj) => (proj.id === p.id ? p : proj))
              );
            } else {
              setProjects((prev) => [...prev, p]);
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteProjectId && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm transform transition-transform duration-200 scale-95 animate-scale-in">
            <h2 className="text-lg font-semibold mb-4">Delete Project</h2>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete this project?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteProjectId(null)}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (deleteProjectId) {
                    try {
                      await deleteProject(deleteProjectId);
                      setProjects((prev) =>
                        prev.filter((p) => p.id !== deleteProjectId)
                      );
                    } catch (err) {
                      console.error("Delete failed", err);
                    } finally {
                      setDeleteProjectId(null);
                    }
                  }
                }}
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

export default Projects;

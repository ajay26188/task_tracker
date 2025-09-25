// src/pages/dashboard/Home.tsx

import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { fetchAssignedProjects, fetchProjectsByOrg, groupedTasksByProject } from "../../services/project";
import type { groupedTasks, Task, TaskStatus } from "../../types/task";
import type { DropResult } from "@hello-pangea/dnd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { updateTask } from "../../services/task";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { alertMessageHandler } from "../../reducers/alertMessageReducer";
import type { Project } from "../../types/project";
import { socket } from "../../socket";
import TaskModal from "../task/TaskModal";
import { Plus } from "lucide-react";

const COLUMNS = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

const Home = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const alertMessage = useSelector((state: RootState) => state.alertMessage);
  const [tasks, setTasks] = useState<groupedTasks | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null);
  const [showProjects, setShowProjects] = useState(false);

  //For adding new task
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Load projects
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = user?.role === 'admin'
          ? await fetchProjectsByOrg(user?.organizationId)
          : await fetchAssignedProjects();
        console.log(data);

        const now = new Date();
        
        //only show active projects
        setProjects(data.filter(p => (new Date(p.startDate)) < now && (new Date(p.endDate)) > now));
      } catch {
        setError("Failed to fetch projects. Please check your connection.");
      }
    };
    loadProjects();
  }, [user]);


  useEffect(() => {
    console.log("hi");
    if (!selectedProjectId) return; 
    const fetchTasks = async () => {
      try {
        setTasks(null); // reset before loading
        const data = await groupedTasksByProject(selectedProjectId);
        console.log(data);
        setTasks(data);
      } catch {
        setError("Failed to fetch tasks for this project.");
      }
    };
    fetchTasks();
    socket.emit("joinProject", selectedProjectId);
  }, [selectedProjectId]);

  // Pick first project as default
  useEffect(() => {
    if (projects.length && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  //socket listener
  useEffect(() => {
    if (!selectedProjectId) return;
  
    const handleTaskStatusUpdate = (updatedTask: Task) => {
      setTasks((prev) => {
        if (!prev) return prev;
  
        // Find which column it was in
        const newTasks = { ...prev };
        const allColumns = Object.keys(newTasks) as TaskStatus[];
  
        // Remove task from current column
        for (const col of allColumns) {
          const index = newTasks[col].findIndex(t => t.id === updatedTask.id);
          if (index > -1) {
            newTasks[col].splice(index, 1);
            break;
          }
        }
  
        // Add task to new column based on its updated status
        newTasks[updatedTask.status].push(updatedTask);
  
        return newTasks;
      });
    };
  
    socket.on("taskStatusUpdated", handleTaskStatusUpdate);
  
    return () => {
      socket.off("taskStatusUpdated", handleTaskStatusUpdate);
    };
  }, [selectedProjectId]);
  
  

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-600">{error}</p>
      </DashboardLayout>
    );
  }

  if (!user) return <p>Loading...</p>;
  
  if (!projects.length) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4 animate-pulse bg-gray-200 rounded w-1/3 h-6"></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 border rounded-lg shadow-sm bg-gray-200 animate-pulse h-24"
              ></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  const handleDragEnd = async (result: DropResult) => {
    if (!tasks) return;
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const startCol = source.droppableId as TaskStatus;
    const endCol = destination.droppableId as TaskStatus;

    // Copy for local state
    const newTasks: groupedTasks = {
      todo: [...tasks.todo],
      "in-progress": [...tasks["in-progress"]],
      done: [...tasks.done],
    };

    const prevTasks = tasks;

    // Remove from start
    const [movedTask] = newTasks[startCol].splice(source.index, 1);

    // Optimistic update: update status locally
    const optimisticTask = { ...movedTask, status: endCol };
    newTasks[endCol].splice(destination.index, 0, optimisticTask);
    setTasks(newTasks);

    try {
      // Persist to backend and get fully populated task
      const updatedTask = await updateTask(movedTask.id, { status: endCol });
      if (!updatedTask) throw new Error("Failed to update task");

      // Replace task in state with fully populated one
      setTasks((prev) => {
        if (!prev) return prev;
        const replacedTasks: groupedTasks = {
          todo: [...prev.todo],
          "in-progress": [...prev["in-progress"]],
          done: [...prev.done],
        };

        // Remove old task wherever it is
        Object.keys(replacedTasks).forEach((col) => {
          replacedTasks[col as TaskStatus] = replacedTasks[col as TaskStatus].filter(
            (t) => t.id !== updatedTask.id
          );
        });

        // Add updated task to its new column
        replacedTasks[updatedTask.status].splice(destination.index, 0, updatedTask as Task);
        return replacedTasks;
      });
    } catch (error: unknown) {
      // rollback if API fails
      setTasks(prevTasks);
  
      if (axios.isAxiosError(error) && error.response) {
        dispatch(
          alertMessageHandler(
            { message: error.response.data.error, type: "error" },
            3
          )
        );
      } else {
        dispatch(
          alertMessageHandler(
            { message: "Update task status failed", type: "error" },
            3
          )
        );
      }
    }
  };
  
  return (
    <DashboardLayout>
      {/* Fixed alert container */}
      {alertMessage.message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <p className={`font-medium ${alertMessage.type === "error" ? "text-red-600" : "text-green-600"}`}>
              {alertMessage.message}
            </p>
          </div>
        </div>
      )}


      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold text-gray-800">
          Welcome back, {user?.name}!
        </h2>
        <p className="mt-2 text-gray-600 text-lg">
          ✨ View all your active projects & manage tasks below
        </p>
      </div>

      {/* Project Selector */}
      <div className="flex items-center gap-4 mb-6 flex-wrap md:flex-nowrap">
        <h3 className="text-2xl md:text-3xl font-extrabold text-indigo-700 flex-1 min-w-0 truncate">
          {projects.find(p => p.id === selectedProjectId)?.name || "Your Project"}
        </h3>

        {user?.role === 'admin' && (
          <button
            className="flex items-center gap-2 px-3 py-1.5 text-sm md:text-base bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow transition"
            onClick={() => setShowTaskModal(true)}
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            Add Task
          </button>
        )}

        <button
          onClick={() => setShowProjects(!showProjects)}
          className="ml-auto px-4 py-2 text-sm md:text-base bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          {showProjects ? "Hide Projects" : "View Projects"}
        </button>
      </div>

      {showProjects && (
        <div className="mb-6 p-4 rounded-lg shadow bg-white border">
          <h3 className="font-semibold mb-3 text-gray-700">All Projects</h3>
          <div className="space-y-2">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => {
                  setSelectedProjectId(project.id);
                  setShowProjects(false);
                }}
                className="w-full flex justify-between items-center p-3 rounded-md border hover:bg-indigo-50 transition"
              >
                <span className="font-medium">{project.name}</span>
                <span className="text-sm text-gray-500">#{project.id}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500 mb-2 text-center">
        💡 Tip: Drag and drop tasks between columns to update their status
      </p>

      {/* Kanban Board */}
      {selectedProjectId && tasks && (
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
            <DragDropContext onDragEnd={handleDragEnd}>
              {Object.entries(COLUMNS).map(([key, title]) => {
                const columnColors: Record<TaskStatus, string> = {
                  todo: "bg-blue-50 border-blue-300",
                  "in-progress": "bg-yellow-50 border-yellow-300",
                  done: "bg-green-50 border-green-300",
                };

                return (
                  <Droppable key={key} droppableId={key}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`rounded-xl p-4 border-2 shadow-lg min-h-[550px] flex flex-col transition-colors ${
                          snapshot.isDraggingOver
                            ? "bg-indigo-100 border-indigo-400"
                            : columnColors[key as TaskStatus]
                        }`}
                      >
                        {/* Column Header */}
                        <div className="flex justify-between items-center mb-4 border-b pb-2">
                          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                          
                        </div>

                        {/* Tasks */}
                        {(tasks?.[key as TaskStatus] ?? []).map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`rounded-lg p-4 mb-3 shadow-md border bg-white transition transform ${
                                  snapshot.isDragging
                                    ? "bg-indigo-200 border-indigo-500 scale-105"
                                    : "hover:shadow-lg hover:scale-[1.01]"
                                }`}
                              >
                               <p className="font-semibold text-gray-900">{task.title}</p>

                              <span className="inline-block mt-1 px-2 py-0.5 text-[12px] font-mono font-semibold rounded bg-gray-100 text-gray-600 border border-gray-300">
                                #{task.id} 
                              </span>

                                {/* Assigned users initials */}
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {task.assignedTo && task.assignedTo.length > 0 ? (
                                    task.assignedTo.map((user, idx) => {
                                      const initials = user.name
                                        ? user.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                            .toUpperCase()
                                        : "?";
                                      return (
                                        <div
                                          key={idx}
                                          className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold"
                                          title={user.name}
                                        >
                                          {initials}
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <span className="text-gray-400 text-sm">
                                      Unassigned
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </DragDropContext>
          </div>
          {showTaskModal && selectedProjectId && (
                <TaskModal
                task={null}
                projectId={selectedProjectId}
                orgId={user.organizationId}
                onClose={() => {
                  setShowTaskModal(false);
                }}
                onSuccess={(newTask) => {
                  // update Kanban state
                  setTasks(prev => {
                    if (!prev) return prev;
                    const newTasks = { ...prev };
                    newTasks[newTask.status] = [
                      ...newTasks[newTask.status].filter(t => t.id !== newTask.id),
                      newTask,
                    ];
                    return newTasks;
                  });
                  
                }}
              />
              
                )}
        </div>
      )}
    </DashboardLayout> 
  );
};

export default Home;


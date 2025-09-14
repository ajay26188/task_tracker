import { useState, useEffect } from "react";
import { createTask, updateTask } from "../../services/task";
import type { Task } from "../../types/task";
import axios from "axios";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store";
import { alertMessageHandler } from "../../reducers/alertMessageReducer";
import FormLayout from "../../components/layouts/FormLayout";
import { authHeader } from "../../utils/auth";
import { apiBaseUrl } from "../../constants";

interface TaskModalProps {
  task: Task | null;
  projectId: string;
  onClose: () => void;
  onSuccess: (t: Task) => void;
  orgId: string;
}

interface UserOption {
  id: string;
  name: string;
  email: string;
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  projectId,
  onClose,
  onSuccess,
  orgId,
}) => {
  console.log(task);
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "todo",
    priority: task?.priority || "medium",
    dueDate: task?.dueDate?.slice(0, 10) || "",
    assignedTo: task?.assignedTo || [],
  });
  const [loading, setLoading] = useState(false);

  // Users autocomplete state
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserOption[]>([]);
  const [userLoading, setUserLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<UserOption[]>([]);

  // Fetch users based on search input
  useEffect(() => {
    if (!search) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        setUserLoading(true);
        const res = await axios.get<UserOption[]>(
          `${apiBaseUrl}/users/${orgId}?search=${encodeURIComponent(search)}`,
          authHeader()
        );
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to load users", err);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUsers();
  }, [search, orgId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const saved = task
        ? await updateTask(task.id, { ...form, projectId })
        : await createTask({ ...form, projectId });

      onSuccess(saved);
      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        dispatch(
          alertMessageHandler(
            { message: error.response.data.error, type: "error" },
            5
          )
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const fields = (
    <>
      {/* Title */}
      <label className="flex flex-col">
        <span className="mb-1 text-sm font-medium">Title</span>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        />
      </label>

      {/* Description */}
      <label className="flex flex-col">
        <span className="mb-1 text-sm font-medium">Description</span>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          rows={3}
          className="border rounded px-3 py-2"
        />
      </label>

      {/* Assign To */}
      <label className="flex flex-col relative">
        <span className="mb-1 text-sm font-medium">Assign To</span>
        <input
          type="text"
          placeholder="Type name of team member..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2"
        />

        {userLoading && (
          <div className="text-sm text-gray-500 mt-1">Loading...</div>
        )}

        {!userLoading && users.length > 0 && (
          <ul className="absolute top-full left-0 z-10 bg-white border rounded w-full max-h-40 overflow-y-auto mt-1 shadow-md">
            {users.map((u) => (
              <li
                key={u.id}
                className="px-3 py-1 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                    if (!form.assignedTo.includes(u.id)) {
                      setForm({
                        ...form,
                        assignedTo: Array.isArray(form.assignedTo)
                          ? [...form.assignedTo, u.id]
                          : [u.id],
                      });
                      setSelectedUsers((prev) => [...prev, u]); // keep user details
                    }
                    setSearch("");
                    setUsers([]); // hide suggestions
                  }}
              >
                {u.name} ({u.email})
              </li>
            ))}
          </ul>
        )}

        {/* Selected users (chips) */}
        <div className="flex flex-wrap gap-2 mt-2">
            {Array.isArray(form.assignedTo) &&
                form.assignedTo.map((uid) => {
                const user = selectedUsers.find((u) => u.id === uid);
                return (
                    <span
                    key={uid}
                    className="flex items-center gap-1 px-2 py-1 bg-gray-200 rounded-full text-sm"
                    >
                    {user?.name || uid} {/* Show name if available */}
                    <button
                        type="button"
                        className="text-red-500 ml-1"
                        onClick={() => {
                        setForm({
                            ...form,
                            assignedTo: form.assignedTo.filter((id) => id !== uid),
                        });
                        setSelectedUsers((prev) =>
                            prev.filter((u) => u.id !== uid)
                        );
                        }}
                    >
                        ✕
                    </button>
                    </span>
                );
                })}
            </div>
      </label>

      {/* Status & Priority */}
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="mb-1 text-sm font-medium">Status</span>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>
        <label className="flex flex-col">
          <span className="mb-1 text-sm font-medium">Priority</span>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>

      {/* Due Date */}
      <label className="flex flex-col">
        <span className="mb-1 text-sm font-medium">Due Date</span>
        <input
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          required
          className="border rounded px-3 py-2"
        />
      </label>
    </>
  );

  const actions = (
    <div className="flex justify-end gap-2 pt-4 border-t">
      <button
        onClick={onClose}
        type="button"
        className="px-4 py-2 border rounded"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2 bg-indigo-600 text-white rounded"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl animate-fadeIn">
        <FormLayout
          title={task ? "Edit Task" : "New Task"}
          fields={fields}
          actions={actions}
          onSubmit={handleSubmit}
          variant="modal"
        />
      </div>
    </div>
  );
};

export default TaskModal;
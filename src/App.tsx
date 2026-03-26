import { useState, useEffect } from "react";
import "./App.css";
// ✅ Types
type Task = {
  id: string;
  content: string;
};

type Column = {
  name: string;
  items: Task[];
};

type ColumnsType = Record<string, Column>;

export default function App() {
  const [columns, setColumns] = useState<ColumnsType>({
    todo: {
      name: "To Do",
      items: [
        { id: "1", content: "Design UI" },
        { id: "2", content: "Report writing" }
      ]
    },
    inProgress: {
      name: "In Progress",
      items: [
        { id: "3", content: "Market Research" },
        { id: "4", content: "Report writing" }
      ]
    },
    done: {
      name: "Done",
      items: [{ id: "5", content: "Set up Repo" }]
    }
  });

  const [newTask, setNewTask] = useState("");
  const [activeColumn, setActiveColumn] = useState<keyof ColumnsType>("todo");

  const [draggedItem, setDraggedItem] = useState<{
    columnId: keyof ColumnsType;
    item: Task;
  } | null>(null);

  // ✅ Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("kanban");
    if (saved) setColumns(JSON.parse(saved));
  }, []);

  // ✅ Save to localStorage
  useEffect(() => {
    localStorage.setItem("kanban", JSON.stringify(columns));
  }, [columns]);

  const addNewTask = () => {
    if (newTask.trim() === "") return;

    const updated = { ...columns };

    updated[activeColumn].items.push({
      id: Date.now().toString(),
      content: newTask
    });

    setColumns(updated);
    setNewTask("");
  };

  const removeTask = (columnId: keyof ColumnsType, taskId: string) => {
    const updated = { ...columns };

    updated[columnId].items = updated[columnId].items.filter(
      (item: Task) => item.id !== taskId
    );

    setColumns(updated);
  };

  const handleDragStart = (
    columnId: keyof ColumnsType,
    item: Task
  ) => {
    setDraggedItem({ columnId, item });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    columnId: keyof ColumnsType
  ) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { columnId: sourceColumnId, item } = draggedItem;
    if (sourceColumnId === columnId) return;

    const updated = { ...columns };

    updated[sourceColumnId].items =
      updated[sourceColumnId].items.filter((i) => i.id !== item.id);

    updated[columnId].items.push(item);

    setColumns(updated);
    setDraggedItem(null);
  };

  return (
    <div className="app-container">
      <h1 className="title">Kanban Board</h1>

      {/* Add Task */}
      <div className="task-bar">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          onKeyDown={(e) => e.key === "Enter" && addNewTask()}
        />

        <select
          value={activeColumn}
          onChange={(e) =>
            setActiveColumn(e.target.value as keyof ColumnsType)
          }
        >
          {Object.entries(columns).map(([id, col]) => (
            <option key={id} value={id}>
              {col.name}
            </option>
          ))}
        </select>

        <button onClick={addNewTask}>Add</button>
      </div>

      {/* Board */}
      <div className="board">
        {Object.entries(columns).map(([columnId, column]) => (
          <div
            key={columnId}
            onDragOver={handleDragOver}
            onDrop={(e) =>
              handleDrop(e, columnId as keyof ColumnsType)
            }
            style={{
              flex: 1,
              border: "1px solid #ccc",
              padding: 10
            }}
          >
            <h3>
              {column.name} ({column.items.length})
            </h3>

            {column.items.map((item: Task) => (
              <div
                key={item.id}
                draggable
                onDragStart={() =>
                  handleDragStart(
                    columnId as keyof ColumnsType,
                    item
                  )
                }
                style={{
                  background: "#eee",
                  padding: 10,
                  marginBottom: 10
                }}
              >
                {item.content}
                <button
                  onClick={() =>
                    removeTask(
                      columnId as keyof ColumnsType,
                      item.id
                    )
                  }
                className="close">
                  X
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

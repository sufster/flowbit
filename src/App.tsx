import { useState } from "react";
function App() {
  const [columns, setColumns] = useState({
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
  const [activeColumn, setActiveColumn] = useState("todo");
  const [draggedItem, setDraggedItem] = useState<any>(null);

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

  const removeTask = (columnId: string, taskId: string) => {
    const updated = { ...columns };
    updated[columnId].items = updated[columnId].items.filter(
      (item) => item.id !== taskId
    );
    setColumns(updated);
  };

  const handleDragStart = (columnId: string, item: any) => {
    setDraggedItem({ columnId, item });
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
  };

  const handleDrop = (e: any, columnId: string) => {
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

  const columnStyles: any = {
    todo: {
      header: "bg-gradient-to-r from-green-600 to-green-400",
      border: "border-green-400"
    },
    inProgress: {
      header: "bg-gradient-to-r from-orange-600 to-orange-400",
      border: "border-orange-400"
    },
    done: {
      header: "bg-gradient-to-r from-violet-600 to-violet-400",
      border: "border-violet-400"
    }
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
          onChange={(e) => setActiveColumn(e.target.value)}
        >
          {Object.entries(columns).map(([id, col]) => (
            <option key={id} value={id}>
              {col.name}
            </option>
          ))}
        </select>

        <button onClick={addNewTask}>Add</button>
      </div>

      {/* Columns */}
      <div className="board">
        {Object.entries(columns).map(([columnId, column]) => (
          <div
            key={columnId}
            className={`column ${columnStyles[columnId].border}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, columnId)}
          >
            <div className={`column-header ${columnStyles[columnId].header}`}>
              {column.name}
              <span>{column.items.length}</span>
            </div>

            <div className="column-body">
              {column.items.map((item) => (
                <div
                  key={item.id}
                  className="task"
                  draggable
                  onDragStart={() => handleDragStart(columnId, item)}
                >
                  {item.content}
                  <button onClick={() => removeTask(columnId, item.id)} className="close">
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

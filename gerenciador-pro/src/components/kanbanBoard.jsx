import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import { supabase } from "../services/supabase";

const columns = {
  pending: "Pendentes",
  doing: "Em andamento",
  done: "Concluído",
};

function TaskCard({ task, reload, provided }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(task.name);

  const handleCheck = async () => {
    const newStatus = task.status === "done" ? "pending" : "done";
    await supabase.from("tasks").update({ status: newStatus }).eq("id", task.id);
    reload();
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    await supabase.from("tasks").update({ name }).eq("id", task.id);
    setEditing(false);
    reload();
  };

  const handleDelete = async () => {
    await supabase.from("tasks").delete().eq("id", task.id);
    reload();
  };

  const isDone = task.status === "done";

  return (
    <div
      className={`card-task ${isDone ? "card-task--done" : ""}`}
      ref={provided.innerRef}
      {...provided.draggableProps}
    >
      <div className="card-task-header" {...provided.dragHandleProps}>
        <button
          className={`task-check ${isDone ? "task-check--checked" : ""}`}
          onClick={handleCheck}
          title="Concluir tarefa"
        >
          {isDone && (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1.5 5L4 7.5L8.5 2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        {editing ? (
          <input
            className="task-edit-input"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSave()}
            autoFocus
          />
        ) : (
          <span className={`task-name ${isDone ? "task-name--done" : ""}`}>
            {task.name}
          </span>
        )}
      </div>

      <div className="card-task-actions">
        {editing ? (
          <>
            <button className="task-btn save" onClick={handleSave}>Salvar</button>
            <button className="task-btn cancel" onClick={() => { setEditing(false); setName(task.name); }}>Cancelar</button>
          </>
        ) : (
          <>
            <button className="task-btn edit" onClick={() => setEditing(true)} title="Editar">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8.5 1.5L10.5 3.5L4 10H2V8L8.5 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="task-btn delete" onClick={handleDelete} title="Excluir">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 3H10M4.5 3V2H7.5V3M5 5.5V9M7 5.5V9M3 3L3.5 10H8.5L9 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard({ tasks, reload }) {
  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const id = result.draggableId;
    const status = result.destination.droppableId;
    await supabase.from("tasks").update({ status }).eq("id", id);
    reload();
  };

  if (!tasks) return <p>Carregando...</p>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban">
        {Object.entries(columns).map(([key, title]) => (
          <Droppable key={key} droppableId={key}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="column">
                <h2>
                  {title}
                  <span className="column-count">
                    {tasks.filter(t => t.status === key).length}
                  </span>
                </h2>
                {tasks
                  .filter(t => t.status === key)
                  .map((task, index) => (
                    <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                      {(provided) => (
                        <TaskCard task={task} reload={reload} provided={provided} />
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
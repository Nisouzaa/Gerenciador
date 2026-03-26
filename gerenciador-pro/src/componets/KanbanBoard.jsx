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

export default function KanbanBoard({ tasks, reload }) {
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const id = result.draggableId;
    const status = result.destination.droppableId;

    await supabase.from("tasks").update({ status }).eq("id", id);

    reload();
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban">
        {Object.entries(columns).map(([key, title]) => (
          <Droppable key={key} droppableId={key}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="column">
                <h2>{title}</h2>

                {tasks
                  .filter(t => t.status === key)
                  .map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          className="card-task"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {task.name}
                        </div>
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
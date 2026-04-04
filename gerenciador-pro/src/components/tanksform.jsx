import { useState } from "react";
import { supabase } from "../services/supabase";

export default function TaskForm({ reload }) {
  const [name, setName] = useState("");

  const createTask = async () => {
    if (!name.trim()) return;
    await supabase.from("tasks").insert({ name, status: "pending" });
    setName("");
    reload();
  };

  return (
    <div className="task-form">
      <input
        placeholder="Nome da tarefa"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={createTask}>Adicionar</button>
    </div>
  );
}
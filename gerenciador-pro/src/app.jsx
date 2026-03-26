import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import Auth from "./Auth";
import KanbanBoard from "./components/KanbanBoard";

export default function App() {
  const [session, setSession] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
  }, []);

  useEffect(() => {
    if (session) loadTasks();
  }, [session]);

  const loadTasks = async () => {
    const { data } = await supabase
      .from("tasks")
      .select("*");

    setTasks(data);
  };

  if (!session) return <Auth setSession={setSession} />;

  return (
    <div className="container">
      <h1>Kanban Pro</h1>
      <KanbanBoard tasks={tasks} reload={loadTasks} />
    </div>
  );
}
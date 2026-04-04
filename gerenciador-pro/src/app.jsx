import { useEffect, useState } from "react";
import { supabase } from "./services/supabase";
import Auth from "./Auth";
import KanbanBoard from "./components/kanbanBoard";
import TaskForm from "./components/tanksform";
import Navbar from "./components/Navbar";

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
    const { data } = await supabase.from("tasks").select("*");
    setTasks(data);
  };

  if (!session) return <Auth setSession={setSession} />;

  return (
    <div>
      <Navbar session={session} onLogout={() => setSession(null)} />
      <div className="container">
        <TaskForm reload={loadTasks} />
        <KanbanBoard tasks={tasks} reload={loadTasks} />
      </div>
    </div>
  );
}
import { useState } from "react";
import { supabase } from "../services/supabase";

export default function Auth({ setSession }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setSession(data.session);
  };

  return (
    <div className="card">
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>Entrar</button>
    </div>
  );
}
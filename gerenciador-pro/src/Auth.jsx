import { useState } from "react";
import { supabase } from "./services/supabase.js";

export default function Auth({ setSession }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [erro, setErro] = useState("");

  const login = async () => {
    setErro("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setErro(error.message);
    setSession(data.session);
  };

  const cadastrar = async () => {
    setErro("");
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return setErro(error.message);
    setErro("Cadastro realizado! Verifique seu email para confirmar.");
  };

  return (
    <div className="card">
      <h2>{isRegistering ? "Cadastro" : "Login"}</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Senha" onChange={e => setPassword(e.target.value)} />
      {erro && <p style={{ color: isRegistering ? "green" : "red" }}>{erro}</p>}
      {isRegistering ? (
        <>
          <button onClick={cadastrar}>Cadastrar</button>
          <button onClick={() => setIsRegistering(false)}>Voltar ao Login</button>
        </>
      ) : (
        <>
          <button onClick={login}>Entrar</button>
          <button onClick={() => setIsRegistering(true)}>Criar conta</button>
        </>
      )}
    </div>
  );
}
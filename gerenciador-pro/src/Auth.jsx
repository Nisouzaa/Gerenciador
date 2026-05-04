import { useState } from "react";
import { supabase } from "./services/supabase.js";

export default function Auth({ setSession }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [erro, setErro] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);

  const login = async () => {
    setErro("");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return setErro(error.message);
    setSession(data.session);
  };

  const recoverSenha = async () => {
    setErro("");
    if (!email) return setErro("Digite seu email para recuperar a senha.");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) return setErro(error.message);
    setErro("Instruções para redefinição de senha enviadas para seu email.");
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
        <span onClick={recoverSenha} style={{
           color: "#6c63ff",
           fontSize: "13px",
           fontWeight: "500",
           cursor: "pointer",
           textAlign: "center",
           textDecoration: "underline"
           }}>
            Esqueci minha senha
          </span>
          <button className="btn-primary" onClick={login}>Entrar</button>
          <button className="btn-secondary" onClick={() => setIsRegistering(true)}>Criar conta</button>
        </>
      )}
    </div>
  );
}
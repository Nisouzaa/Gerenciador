import { useState } from "react";
import { supabase } from "../services/supabase";

export default function Navbar({ session, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const email = session?.user?.email || "";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">⬡</span>
        Kanban Pro
      </div>

      <div className="navbar-right">
        <span className="navbar-email">{email}</span>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {menuOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-user">
            <div className="dropdown-avatar">
              {email.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="dropdown-name">Minha conta</p>
              <p className="dropdown-email">{email}</p>
            </div>
          </div>
          <hr className="dropdown-divider" />
          <button className="dropdown-btn logout" onClick={handleLogout}>
            Sair
          </button>
        </div>
      )}
    </nav>
  );
}
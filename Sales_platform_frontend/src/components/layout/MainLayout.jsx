import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";

function MainLayout({ title = "Dashboard", breadcrumb = [], children, userName = "User" }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`app-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      <Sidebar onNavigate={() => setSidebarOpen(false)} />

      <div className="main-panel">
        <Navbar title={title} userName={userName} onMenuClick={() => setSidebarOpen((open) => !open)} />

        {breadcrumb.length > 0 && (
          <div className="content-container">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              {breadcrumb.map((item, index) => (
                <span key={`${item}-${index}`}>
                  <span>{item}</span>
                  {index < breadcrumb.length - 1 && <span className="breadcrumb-separator"> / </span>}
                </span>
              ))}
            </nav>
          </div>
        )}

        <main className="content-container main-content">{children}</main>
      </div>
    </div>
  );
}

export default MainLayout;

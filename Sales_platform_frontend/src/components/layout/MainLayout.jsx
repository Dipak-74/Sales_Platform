import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";

function MainLayout({
  title = "Dashboard",
  breadcrumb = [],
  children,
  userName = "User",
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`app-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 25,
          }}
        />
      )}

      <Sidebar onNavigate={() => setSidebarOpen(false)} />

      <div className="main-panel">
        <Navbar
          title={title}
          userName={userName}
          onMenuClick={() => setSidebarOpen((open) => !open)}
        />

        {breadcrumb.length > 0 && (
          <div
            className="content-container"
            style={{ paddingBottom: 0 }}
          >
            <nav
              className="breadcrumb"
              aria-label="Breadcrumb"
            >
              {breadcrumb.map((item, index) => (
                <span
                  key={`${item}-${index}`}
                  className="breadcrumb-item"
                >
                  <span
                    style={{
                      color:
                        index === breadcrumb.length - 1
                          ? "var(--text-main)"
                          : "var(--text-muted)",
                      fontWeight:
                        index === breadcrumb.length - 1
                          ? 600
                          : 500,
                    }}
                  >
                    {item}
                  </span>

                  {index < breadcrumb.length - 1 && (
                    <span
                      className="breadcrumb-separator"
                      style={{ color: "#cbd5e1" }}
                    >
                      /
                    </span>
                  )}
                </span>
              ))}
            </nav>
          </div>
        )}

        <main className="content-container main-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
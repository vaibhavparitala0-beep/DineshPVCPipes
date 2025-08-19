import "./global.css";
import { createRoot, Root } from "react-dom/client";
import App from "./App";

// Global root instance to prevent multiple createRoot calls
let root: Root | null = null;
let isInitialized = false;

function getOrCreateRoot(): Root {
  const container = document.getElementById("root");

  if (!container) {
    throw new Error(
      "Root container not found. Make sure there's a div with id='root' in your HTML.",
    );
  }

  // Only create a new root if one doesn't exist
  if (!root) {
    console.log("[HMR] Creating new React root");
    root = createRoot(container);
  }

  return root;
}

function renderApp() {
  try {
    const appRoot = getOrCreateRoot();
    appRoot.render(<App />);

    if (!isInitialized) {
      console.log("[App] React application initialized successfully");
      isInitialized = true;
    }
  } catch (error) {
    console.error("[App] Failed to render application:", error);

    // Fallback error display
    const container = document.getElementById("root");
    if (container) {
      container.innerHTML = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: system-ui;
          background-color: #f9fafb;
          color: #374151;
          padding: 1rem;
        ">
          <div style="
            text-align: center;
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            max-width: 400px;
            width: 100%;
          ">
            <h1 style="color: #dc2626; margin-bottom: 1rem;">Application Error</h1>
            <p style="margin-bottom: 1rem;">Failed to load the application. Please refresh the page.</p>
            <button onclick="window.location.reload()" style="
              background: #dc2626;
              color: white;
              border: none;
              padding: 0.5rem 1rem;
              border-radius: 4px;
              cursor: pointer;
            ">Reload Page</button>
          </div>
        </div>
      `;
    }
  }
}

// Initial render
renderApp();

// Handle HMR (Hot Module Replacement) in development
if (import.meta.hot) {
  // Accept updates to the App component
  import.meta.hot.accept("./App", (newModule) => {
    console.log("[HMR] App component updated, re-rendering...");
    renderApp();
  });

  // Handle disposal (when this module is about to be replaced)
  import.meta.hot.dispose(() => {
    console.log("[HMR] Disposing current app instance");
    // Note: We don't unmount the root here as it will be reused
  });

  // Handle errors during HMR
  import.meta.hot.on("vite:error", (error) => {
    console.error("[HMR] Vite error:", error);
  });
}

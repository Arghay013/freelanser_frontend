import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("UI crashed:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="max-w-xl w-full card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="text-xl font-bold">App crashed</h2>
              <p className="text-sm text-base-content/70 mt-2">
                Console (F12) এ full details আছে।
              </p>
              <pre className="mt-4 p-3 rounded bg-base-200 text-xs overflow-auto">
                {String(this.state.error)}
              </pre>
              <button
                type="button"
                className="btn btn-primary mt-4"
                onClick={() => window.location.reload()}
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
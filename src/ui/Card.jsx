import React from "react";

export default function Card({ children, className = "", title, actions }) {
  return (
    <div className={`card bg-base-100 shadow-sm border border-base-200 ${className}`}>
      <div className="card-body gap-4">
        {(title || actions) && (
          <div className="flex items-start justify-between gap-3">
            {title ? <h2 className="card-title text-lg">{title}</h2> : <div />}
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
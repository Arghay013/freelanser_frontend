import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-3xl bg-base-100 border border-base-200 shadow-md",
        "hover:shadow-xl transition-all duration-200",
        className,
      ].join(" ")}
    >
      <div className="p-5">{children}</div>
    </div>
  );
}
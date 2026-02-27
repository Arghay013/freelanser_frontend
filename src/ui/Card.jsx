import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-2xl bg-base-100 border border-base-200",
        // 👇 LIGHT MODE এ strong shadow
        "shadow-md shadow-black/10",
        // 👇 HOVER এ আরো lift effect
        "hover:shadow-lg hover:shadow-black/20",
        "transition-all duration-200",
        className,
      ].join(" ")}
    >
      <div className="p-5">{children}</div>
    </div>
  );
}
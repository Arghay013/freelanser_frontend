import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-[28px] border border-base-200/80 bg-base-100 shadow-sm",
        "transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl",
        className,
      ].join(" ")}
    >
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
}
import React from "react";

export default function Card({ children }) {
  return <div className="rounded-xl border bg-white p-4 shadow-sm">{children}</div>;
}

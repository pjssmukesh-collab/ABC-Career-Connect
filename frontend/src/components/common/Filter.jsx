import React from "react";

const Filter = ({ options, value, onChange, label }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {label && <span style={{ fontSize: "14px", color: "#4b5563", fontWeight: 500 }}>{label}:</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "8px 12px",
          fontSize: "14px",
          border: "1px solid #d1d5db",
          borderRadius: "6px",
          outline: "none",
          backgroundColor: "#ffffff",
          color: "#374151",
          cursor: "pointer",
          minWidth: "120px"
        }}
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;

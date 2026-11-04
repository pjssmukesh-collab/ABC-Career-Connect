import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      position: "relative",
      width: "100%",
      maxWidth: "340px"
    }}>
      <FaSearch style={{
        position: "absolute",
        left: "14px",
        color: "#94a3b8",
        fontSize: "14px",
        pointerEvents: "none"
      }} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          height: "42px",
          padding: "0 14px 0 38px",
          fontSize: "14px",
          fontWeight: 500,
          border: "1px solid #cbd5e1",
          borderRadius: "10px",
          outline: "none",
          backgroundColor: "#ffffff",
          color: "#0f172a",
          boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
          transition: "all 0.2s ease"
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#e11d48";
          e.target.style.boxShadow = "0 0 0 3px rgba(225, 29, 72, 0.15)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#cbd5e1";
          e.target.style.boxShadow = "0 1px 2px rgba(15, 23, 42, 0.04)";
        }}
      />
    </div>
  );
};

export default SearchBar;

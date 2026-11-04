import React from "react";

const Card = ({ title, children, style = {}, onClick, className = "" }) => {
  return (
    <div 
      className={className}
      onClick={onClick}
      style={{
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "18px",
        padding: "24px 28px",
        boxShadow: "0 2px 10px rgba(15, 23, 42, 0.04)",
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        ...style
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 10px 25px -4px rgba(15, 23, 42, 0.08)";
        if (onClick) e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 10px rgba(15, 23, 42, 0.04)";
        if (onClick) e.currentTarget.style.transform = "none";
      }}
    >
      {title && (
        <h3 style={{
          margin: "0 0 18px 0",
          fontSize: "18px",
          fontWeight: 800,
          color: "#0f172a",
          borderBottom: "1px solid #f1f5f9",
          paddingBottom: "12px",
          fontFamily: "var(--font-heading)"
        }}>{title}</h3>
      )}
      <div>{children}</div>
    </div>
  );
};

export default Card;

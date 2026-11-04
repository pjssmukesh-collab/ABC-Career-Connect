import React from "react";

const Loader = ({ message = "Loading data..." }) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "48px 24px",
      width: "100%"
    }}>
      <div style={{
        width: "40px",
        height: "40px",
        border: "3px solid #e5e7eb",
        borderTop: "3px solid #C62828",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
      }} />
      <span style={{
        marginTop: "16px",
        fontSize: "14px",
        color: "#6b7280",
        fontWeight: 500
      }}>{message}</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;

import React from "react";
import { FaInbox } from "react-icons/fa";

const EmptyState = ({ message = "No data available." }) => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 24px",
      textAlign: "center",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      border: "1px dashed #d1d5db",
      margin: "16px 0"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "56px",
        height: "56px",
        borderRadius: "50%",
        backgroundColor: "#fef2f2",
        color: "#C62828",
        marginBottom: "16px"
      }}>
        <FaInbox size={24} />
      </div>
      <h3 style={{
        fontSize: "16px",
        fontWeight: 600,
        color: "#1f2937",
        margin: "0 0 4px 0"
      }}>{message}</h3>
      <p style={{
        fontSize: "14px",
        color: "#6b7280",
        margin: 0
      }}>Please try adjusting filters, searching, or adding a new record.</p>
    </div>
  );
};

export default EmptyState;

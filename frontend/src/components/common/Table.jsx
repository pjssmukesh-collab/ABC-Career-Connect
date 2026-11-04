import React from "react";

const Table = ({ headers, data, renderRow, emptyMessage = "No records found." }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{
        padding: "36px",
        textAlign: "center",
        backgroundColor: "#ffffff",
        borderRadius: "14px",
        border: "1px solid #e2e8f0",
        color: "#64748b",
        fontWeight: 500
      }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div style={{
      width: "100%",
      overflowX: "auto",
      backgroundColor: "#ffffff",
      borderRadius: "14px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 1px 3px rgba(15, 23, 42, 0.03)"
    }}>
      <table style={{
        width: "100%",
        borderCollapse: "collapse",
        textAlign: "left",
        fontSize: "14px"
      }}>
        <thead>
          <tr style={{
            backgroundColor: "#f8fafc",
            borderBottom: "1px solid #e2e8f0"
          }}>
            {headers.map((header, idx) => (
              <th key={idx} style={{
                padding: "14px 18px",
                fontWeight: 700,
                color: "#475569",
                textTransform: "uppercase",
                fontSize: "11.5px",
                letterSpacing: "0.06em"
              }}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr 
              key={index} 
              style={{
                borderBottom: index < data.length - 1 ? "1px solid #f1f5f9" : "none",
                transition: "background-color 0.15s ease"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fafbfc"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              {renderRow(item, index)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

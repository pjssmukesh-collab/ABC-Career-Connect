import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "6px",
      marginTop: "16px"
    }}>
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "32px",
          height: "32px",
          borderRadius: "6px",
          border: "1px solid #d1d5db",
          backgroundColor: "#ffffff",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          color: currentPage === 1 ? "#9ca3af" : "#374151",
          opacity: currentPage === 1 ? 0.6 : 1
        }}
      >
        <FaChevronLeft size={10} />
      </button>

      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "6px",
            border: num === currentPage ? "1px solid #C62828" : "1px solid #d1d5db",
            backgroundColor: num === currentPage ? "#C62828" : "#ffffff",
            color: num === currentPage ? "#ffffff" : "#374151",
            fontWeight: num === currentPage ? "600" : "normal",
            cursor: "pointer"
          }}
        >
          {num}
        </button>
      ))}

      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "32px",
          height: "32px",
          borderRadius: "6px",
          border: "1px solid #d1d5db",
          backgroundColor: "#ffffff",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          color: currentPage === totalPages ? "#9ca3af" : "#374151",
          opacity: currentPage === totalPages ? 0.6 : 1
        }}
      >
        <FaChevronRight size={10} />
      </button>
    </div>
  );
};

export default Pagination;

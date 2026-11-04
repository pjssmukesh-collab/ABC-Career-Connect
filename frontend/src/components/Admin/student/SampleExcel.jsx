import React from 'react';
import { FaDownload } from 'react-icons/fa';
import studentDetailsTemplate from '../student_details.xlsx';

export default function SampleExcel() {
  return (
    <a
      href={studentDetailsTemplate}
      download="student_details.xlsx"
      className="download-template-btn"
      title="Download Sample Excel Template"
    >
      <FaDownload />
      <span>Sample Excel</span>
    </a>
  );
}

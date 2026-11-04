import React, { useState, useEffect, useRef } from "react";
import "./student.css";
import axios from "axios";
import {
  FaSearch,
  FaEdit,
  FaTrashAlt,
  FaFileExport,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaLinkedin,
  FaGithub,
  FaFilePdf,
  FaDownload,
  FaPlus,
  FaUpload,
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaPhone,
  FaBuilding,
  FaVenusMars,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaCertificate
} from "react-icons/fa";
import studentDetailsTemplate from "../../components/Admin/student_details.xlsx?url";

// ==========================================
// 1. SUB-COMPONENT: StudentTable
// ==========================================
function StudentTable({
  currentStudents,
  indexOfFirstStudent,
  setSelectedStudentProfile,
  handleEditClick,
  handleDelete,
}) {
  return (
    <div className="table-responsive">
      <table className="students-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Student Name</th>
            <th>Roll Number</th>
            <th>Email</th>
            <th>Department</th>
            <th>Year</th>
            <th>CGPA</th>
            <th>Backlogs</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.length > 0 ? (
            currentStudents.map((student, idx) => (
              <tr
                key={student.roll_number}
                className="clickable-row"
                onClick={() => setSelectedStudentProfile(student)}
                title="Click to view student profile"
              >
                <td>{indexOfFirstStudent + idx + 1}</td>
                <td>
                  <div className="student-profile-cell">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(student.student_name || "Student")}&background=random&color=fff&size=128`}
                      alt={student.student_name}
                      className="student-avatar-img"
                    />
                    <span>{student.student_name}</span>
                  </div>
                </td>
                <td>{student.roll_number}</td>
                <td>{student.email_id}</td>
                <td>{student.department}</td>
                <td>{student.year}</td>
                <td>{student.cgpa || "-"}</td>
                <td>{student.backlogs ?? "0"}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      type="button"
                      className="action-btn edit"
                      onClick={e => { e.stopPropagation(); handleEditClick(student); }}
                      title="Edit student"
                    >
                      <FaEdit />
                    </button>
                    <button
                      type="button"
                      className="action-btn delete"
                      onClick={e => { e.stopPropagation(); handleDelete(student.roll_number); }}
                      title="Delete student"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" style={{ textAlign: "center", padding: "32px 0", color: "#64748b" }}>
                No students found matching your query.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ==========================================
// 2. SUB-COMPONENT: StudentProfile
// ==========================================
function StudentProfile({ selectedStudent, onBack, onEdit }) {
  if (!selectedStudent) return null;

  const getBatch = (year) => {
    const currentYear = new Date().getFullYear();
    const numericYear = parseInt(year) || 4;
    const startYear = currentYear - (numericYear - 1) - 1;
    return `${startYear} - ${startYear + 4}`;
  };

  const phone = selectedStudent.phone || "-";
  const dob = selectedStudent.dob || "-";
  const gender = selectedStudent.gender || "-";
  const address = selectedStudent.address || "-";
  const admissionBatch = getBatch(selectedStudent.year);
  
  let skills = [];
  if (selectedStudent.skills) {
    if (typeof selectedStudent.skills === "string") {
      skills = selectedStudent.skills.split(",").map(s => s.trim()).filter(Boolean);
    } else if (Array.isArray(selectedStudent.skills)) {
      skills = selectedStudent.skills;
    }
  }

  let projects = [];
  if (selectedStudent.projects) {
    if (typeof selectedStudent.projects === "string") {
      try {
        projects = JSON.parse(selectedStudent.projects);
      } catch (e) {
        projects = selectedStudent.projects.split(";").map(p => ({ title: p.trim(), desc: "" })).filter(x => x.title);
      }
    } else if (Array.isArray(selectedStudent.projects)) {
      projects = selectedStudent.projects;
    }
  }

  let certifications = [];
  if (selectedStudent.certifications) {
    if (typeof selectedStudent.certifications === "string") {
      certifications = selectedStudent.certifications.split(",").map(c => c.trim()).filter(Boolean);
    } else if (Array.isArray(selectedStudent.certifications)) {
      certifications = selectedStudent.certifications;
    }
  }

  const numBacklogs = selectedStudent.backlogs ?? 0;

  return (
    <div className="profile-page-container">
      <div className="profile-page-header">
        <button type="button" className="profile-back-btn" onClick={onBack}>
          <FaChevronLeft /> Back to Students
        </button>
        <div className="profile-header-actions">
          {onEdit && (
            <button type="button" className="profile-edit-btn" onClick={() => onEdit(selectedStudent)}>
              <FaEdit /> Edit Student
            </button>
          )}
          <span className="profile-header-title">Student Profile</span>
        </div>
      </div>

      <div className="profile-page-grid">
        <div className="profile-sidebar-card">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar-circle">
              {selectedStudent.student_name ? selectedStudent.student_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : "ST"}
            </div>
          </div>
          <div className="profile-sidebar-name">
            <h3>{selectedStudent.student_name}</h3>
            <span className={`profile-status-badge ${selectedStudent.status?.toLowerCase() === 'active' ? 'active' : 'inactive'}`}>
              {selectedStudent.status || "Active"}
            </span>
            <p className="profile-roll-no">Roll No: {selectedStudent.roll_number}</p>
          </div>

          <div className="profile-sidebar-details profile-info-list">
            <div className="profile-info-item">
              <div className="profile-info-icon">
                <FaEnvelope />
              </div>
              <div className="profile-info-content">
                <span className="profile-info-label">Email</span>
                <span className="profile-info-value">{selectedStudent.email_id}</span>
              </div>
            </div>
            <div className="profile-info-item">
              <div className="profile-info-icon">
                <FaPhone />
              </div>
              <div className="profile-info-content">
                <span className="profile-info-label">Phone</span>
                <span className="profile-info-value">{phone}</span>
              </div>
            </div>
            <div className="profile-info-item">
              <div className="profile-info-icon">
                <FaBuilding />
              </div>
              <div className="profile-info-content">
                <span className="profile-info-label">Department</span>
                <span className="profile-info-value">{selectedStudent.department}</span>
              </div>
            </div>
            <div className="profile-info-item">
              <div className="profile-info-icon">
                <FaGraduationCap />
              </div>
              <div className="profile-info-content">
                <span className="profile-info-label">Year</span>
                <span className="profile-info-value">{selectedStudent.year} Year</span>
              </div>
            </div>
            <div className="profile-info-item">
              <div className="profile-info-icon">
                <FaCalendarAlt />
              </div>
              <div className="profile-info-content">
                <span className="profile-info-label">Date of Birth</span>
                <span className="profile-info-value">{dob}</span>
              </div>
            </div>
            <div className="profile-info-item">
              <div className="profile-info-icon">
                <FaVenusMars />
              </div>
              <div className="profile-info-content">
                <span className="profile-info-label">Gender</span>
                <span className="profile-info-value">{gender}</span>
              </div>
            </div>
            <div className="profile-info-item">
              <div className="profile-info-icon">
                <FaMapMarkerAlt />
              </div>
              <div className="profile-info-content">
                <span className="profile-info-label">Address</span>
                <span className="profile-info-value">{address}</span>
              </div>
            </div>
          </div>

          <div className="sidebar-action-buttons">
            {selectedStudent.resume ? (
              <>
                <a
                  href={selectedStudent.resume.startsWith("http") ? selectedStudent.resume : `http://localhost:8000/resumes/${selectedStudent.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sidebar-btn btn-view-resume"
                >
                  <FaFilePdf /> View Resume
                </a>
                <a
                  href={selectedStudent.resume.startsWith("http") ? selectedStudent.resume : `http://localhost:8000/resumes/${selectedStudent.resume}`}
                  download
                  className="sidebar-btn btn-download-resume"
                >
                  Download Resume
                </a>
              </>
            ) : (
              <span className="sidebar-btn disabled">No Resume Uploaded</span>
            )}
          </div>
        </div>

        <div className="profile-main-content">
          <div className="profile-section-card">
            <h4 className="section-title">Academic Performance</h4>
            <div className="profile-cgpa-display">
              <span className="profile-cgpa-number">{selectedStudent.cgpa || "N/A"}</span>
              <div className="profile-cgpa-label">
                <span className="title">CGPA</span>
                <span className="sub">Cumulative Grade Point Average</span>
              </div>
              <div className="profile-cgpa-label" style={{ marginLeft: "auto", textAlign: "right" }}>
                <span className="profile-cgpa-number" style={{ color: numBacklogs > 0 ? "#ef4444" : "#10b981" }}>{numBacklogs}</span>
                <span className="sub">Active Backlogs</span>
              </div>
            </div>

            <div className="profile-sem-grid" style={{ marginTop: "20px" }}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => {
                const val = selectedStudent[`sgpa_sem${num}`];
                return (
                  <div key={num} className="profile-sem-card">
                    <div className="profile-sem-num">Sem {num}</div>
                    <div className={`profile-sem-sgpa ${!val ? 'empty' : ''}`}>{val || "-"}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="details-placement-grid">
            <div className="profile-section-card">
              <h4 className="section-title">Personal & Academic Details</h4>
              <div className="details-fields-grid">
                <div className="detail-field">
                  <FaBriefcase className="field-icon" />
                  <div>
                    <span className="field-label">Roll Number</span>
                    <span className="field-value">{selectedStudent.roll_number}</span>
                  </div>
                </div>
                <div className="detail-field">
                  <FaGraduationCap className="field-icon" />
                  <div>
                    <span className="field-label">Year</span>
                    <span className="field-value">{selectedStudent.year} Year</span>
                  </div>
                </div>
                <div className="detail-field">
                  <FaEnvelope className="field-icon" />
                  <div>
                    <span className="field-label">Email</span>
                    <span className="field-value">{selectedStudent.email_id}</span>
                  </div>
                </div>
                <div className="detail-field">
                  <FaCalendarAlt className="field-icon" />
                  <div>
                    <span className="field-label">Date of Birth</span>
                    <span className="field-value">{dob}</span>
                  </div>
                </div>
                <div className="detail-field">
                  <FaPhone className="field-icon" />
                  <div>
                    <span className="field-label">Phone</span>
                    <span className="field-value">{phone}</span>
                  </div>
                </div>
                <div className="detail-field">
                  <FaVenusMars className="field-icon" />
                  <div>
                    <span className="field-label">Gender</span>
                    <span className="field-value">{gender}</span>
                  </div>
                </div>
                <div className="detail-field">
                  <FaBuilding className="field-icon" />
                  <div>
                    <span className="field-label">Department</span>
                    <span className="field-value">{selectedStudent.department}</span>
                  </div>
                </div>
                <div className="detail-field">
                  <FaCalendarAlt className="field-icon" />
                  <div>
                    <span className="field-label">Admission Batch</span>
                    <span className="field-value">{admissionBatch}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="profile-section-card">
              <div className="placement-header-row">
                <h4 className="section-title">Placement Status</h4>
                <span className="status-eligible-badge">{selectedStudent.placement_status || "-"}</span>
              </div>
              <div className="placement-status-list">
                <div className="placement-status-item">
                  <div className="item-left">
                    <FaCheckCircle className="status-icon green" />
                    <span>Overall Status</span>
                  </div>
                  <span className="item-value font-medium">{selectedStudent.placement_overall_status || "-"}</span>
                </div>
                <div className="placement-status-item">
                  <div className="item-left">
                    <FaBriefcase className="status-icon blue" />
                    <span>Applied Drives</span>
                  </div>
                  <span className="item-value font-semibold">{selectedStudent.applied_drives ?? "0"}</span>
                </div>
                <div className="placement-status-item">
                  <div className="item-left">
                    <FaGraduationCap className="status-icon orange" />
                    <span>Shortlisted</span>
                  </div>
                  <span className="item-value font-semibold">{selectedStudent.shortlisted_drives ?? "0"}</span>
                </div>
                <div className="placement-status-item">
                  <div className="item-left">
                    <FaCheckCircle className="status-icon green" />
                    <span>Placed</span>
                  </div>
                  <span className="item-value font-semibold">{selectedStudent.placed_status ?? "-"}</span>
                </div>
                <div className="placement-status-item">
                  <div className="item-left">
                    <FaCertificate className="status-icon purple" />
                    <span>Offers</span>
                  </div>
                  <span className="item-value font-semibold">{selectedStudent.offers_count ?? "0"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-section-card">
            <h4 className="section-title">Skills</h4>
            <div className="skills-tags-container">
              {skills && skills.length > 0 ? (
                skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))
              ) : (
                <span style={{ fontSize: "13px", color: "#64748b" }}>No skills added</span>
              )}
            </div>
          </div>

          <div className="projects-certifications-grid">
            <div className="profile-section-card">
              <h4 className="section-title">Projects</h4>
              {projects && projects.length > 0 ? (
                <ul className="projects-list">
                  {projects.map((project, index) => (
                    <li key={index}>
                      <strong>{project.title}</strong>
                      <p>{project.desc}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <span style={{ fontSize: "13px", color: "#64748b" }}>No projects added</span>
              )}
            </div>

            <div className="profile-section-card">
              <h4 className="section-title">Certifications</h4>
              {certifications && certifications.length > 0 ? (
                <ul className="certifications-list">
                  {certifications.map((cert, index) => (
                    <li key={index}>
                      <FaCertificate className="cert-bullet" />
                      <span>{cert}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <span style={{ fontSize: "13px", color: "#64748b" }}>No certifications added</span>
              )}
            </div>
          </div>

          <div className="profile-section-card">
            <h4 className="section-title">Documents & Links</h4>
            <div className="profile-links-list">
              <div className="profile-link-row">
                <div className="profile-link-left">
                  <FaFilePdf />
                  <div className="profile-link-text">
                    <span className="profile-link-name">Resume</span>
                    <span className="profile-link-url">{selectedStudent.resume || "No file uploaded"}</span>
                  </div>
                </div>
                {selectedStudent.resume ? (
                  <a
                    href={selectedStudent.resume.startsWith("http") ? selectedStudent.resume : `http://localhost:8000/resumes/${selectedStudent.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link-action"
                  >
                    View
                  </a>
                ) : (
                  <span className="profile-link-action empty">N/A</span>
                )}
              </div>

              <div className="profile-link-row">
                <div className="profile-link-left">
                  <FaLinkedin />
                  <div className="profile-link-text">
                    <span className="profile-link-name">LinkedIn Profile</span>
                    <span className="profile-link-url">{selectedStudent.linkedin_link || "Not Linked"}</span>
                  </div>
                </div>
                {selectedStudent.linkedin_link ? (
                  <a
                    href={selectedStudent.linkedin_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link-action"
                  >
                    Open
                  </a>
                ) : (
                  <span className="profile-link-action empty">N/A</span>
                )}
              </div>

              <div className="profile-link-row">
                <div className="profile-link-left">
                  <FaGithub />
                  <div className="profile-link-text">
                    <span className="profile-link-name">GitHub Profile</span>
                    <span className="profile-link-url">{selectedStudent.github_profile || "Not Linked"}</span>
                  </div>
                </div>
                {selectedStudent.github_profile ? (
                  <a
                    href={selectedStudent.github_profile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="profile-link-action"
                  >
                    Open
                  </a>
                ) : (
                  <span className="profile-link-action empty">N/A</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. SUB-COMPONENT: SearchAndFilter
// ==========================================
function SearchAndFilter({ searchQuery, setSearchQuery, filterColumn, setFilterColumn, getSearchPlaceholder }) {
  return (
    <>
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder={getSearchPlaceholder()}
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="search-column-select-wrapper">
        <select
          className="search-column-select"
          value={filterColumn}
          onChange={(e) => setFilterColumn(e.target.value)}
          title="Select Column to Filter"
        >
          <option value="all">All Columns</option>
          <option value="student_name">Name</option>
          <option value="roll_number">Roll Number</option>
          <option value="email_id">Email</option>
          <option value="department">Department</option>
          <option value="year">Year</option>
          <option value="cgpa">CGPA</option>
          <option value="backlogs">Backlogs</option>
        </select>
      </div>
    </>
  );
}

// ==========================================
// 4. SUB-COMPONENT: UploadExcel
// ==========================================
function UploadExcel({ fileInputRef, setToast, onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };
  const processFile = async (file) => {
    if (!file) return;
    const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (extension !== '.xlsx' && extension !== '.xls') {
      setToast({ show: true, message: 'Only Excel files allowed', type: 'error' });
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      setIsUploading(true);
      setToast({ show: true, message: 'Uploading students...', type: 'info' });
      const response = await fetch('http://localhost:8000/student/upload-excel', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setToast({ show: true, message: data.message, type: 'success' });
        onUploadSuccess();
      } else {
        setToast({ show: true, message: data.detail || 'Upload failed', type: 'error' });
      }
    } catch (err) {
      setToast({ show: true, message: err.message || 'Upload error', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-student-container">
      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button
        type="button"
        className={isDragging ? 'upload-student-btn drag-over' : 'upload-student-btn'}
        onClick={() => fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <span className="upload-spinner" />
            <span>Uploading...</span>
          </>
        ) : (
          <>
            <span className="upload-icon">{isDragging ? <FaDownload /> : <FaUpload />}</span>
            <span>Upload Excel</span>
          </>
        )}
      </button>
    </div>
  );
}

// ==========================================
// 5. SUB-COMPONENT: SampleExcel
// ==========================================
function SampleExcel() {
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

// ==========================================
// 6. MAIN CONTAINER PAGE COMPONENT: Student
// ==========================================
function Student() {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterColumn, setFilterColumn] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Editing Modal States
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    student_name: "",
    email_id: "",
    department: "",
    year: "",
    status: "",
    cgpa: "",
    sgpa_sem1: "",
    sgpa_sem2: "",
    sgpa_sem3: "",
    sgpa_sem4: "",
    sgpa_sem5: "",
    sgpa_sem6: "",
    sgpa_sem7: "",
    sgpa_sem8: "",
    linkedin_link: "",
    github_profile: "",
    resume: "",
    backlogs: "0"
  });
  const [isSaving, setIsSaving] = useState(false);

  // Profile Card States
  const [selectedStudentProfile, setSelectedStudentProfile] = useState(null);

  // Upload Excel States
  const fileInputRef = useRef(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info"
  });

  // auto close toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({
          ...prev,
          show: false
        }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  function showToast(message, type = "info") {
    setToast({
      show: true,
      message,
      type
    });
  }

  function renderToastIcon() {
    if (toast.type === "success") {
      return <FaCheckCircle className="toast-icon success" />;
    }
    if (toast.type === "error") {
      return <FaTimesCircle className="toast-icon error" />;
    }
    return <FaInfoCircle className="toast-icon info" />;
  }

  // Fetch students from the database on component mount
  useEffect(() => {
    axios.get("http://localhost:8000/admin/students")
      .then((res) => {
        setStudents(res.data);
      })
      .catch((err) => {
        console.error("Error fetching students from backend DB:", err);
      });
  }, []);

  // Reset to first page when search query or filter column changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterColumn]);

  // Helper to dynamically set placeholder text for search query
  const getSearchPlaceholder = () => {
    switch (filterColumn) {
      case "student_name":
        return "Search by Student Name...";
      case "roll_number":
        return "Search by Roll Number...";
      case "email_id":
        return "Search by Email Address...";
      case "department":
        return "Search by Department...";
      case "year":
        return "Search by Year...";
      case "cgpa":
        return "Filter by Min CGPA (e.g. 8.5)...";
      case "backlogs":
        return "Filter by Backlogs (e.g. 0)...";
      default:
        return "Search by name, roll number, email...";
    }
  };

  // Filter students by search query and specific column selection
  const filteredStudents = students.filter((s) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    if (filterColumn === "student_name") {
      return (s.student_name || "").toLowerCase().includes(query);
    }
    if (filterColumn === "roll_number") {
      return (s.roll_number || "").toLowerCase().includes(query);
    }
    if (filterColumn === "email_id") {
      return (s.email_id || "").toLowerCase().includes(query);
    }
    if (filterColumn === "department") {
      return (s.department || "").toLowerCase().includes(query);
    }
    if (filterColumn === "year") {
      return (s.year || "").toLowerCase().includes(query);
    }
    if (filterColumn === "cgpa") {
      const targetCgpa = parseFloat(searchQuery);
      if (isNaN(targetCgpa)) {
        return (s.cgpa || "").toLowerCase().includes(query);
      }
      const studentCgpa = parseFloat(s.cgpa);
      if (isNaN(studentCgpa)) return false;
      return studentCgpa >= targetCgpa;
    }
    if (filterColumn === "backlogs") {
      const targetBacklogs = parseInt(searchQuery, 10);
      if (isNaN(targetBacklogs)) {
        return (s.backlogs?.toString() || "").toLowerCase().includes(query);
      }
      const studentBacklogs = parseInt(s.backlogs, 10);
      if (isNaN(studentBacklogs)) return false;
      return studentBacklogs === targetBacklogs;
    }

    return (
      (s.student_name || "").toLowerCase().includes(query) ||
      (s.roll_number || "").toLowerCase().includes(query) ||
      (s.email_id || "").toLowerCase().includes(query) ||
      (s.department || "").toLowerCase().includes(query) ||
      (s.year || "").toLowerCase().includes(query) ||
      (s.cgpa || "").toLowerCase().includes(query)
    );
  });

  const handleDelete = (rollNumber) => {
    if (window.confirm(`Are you sure you want to delete student with Roll Number: ${rollNumber}?`)) {
      axios.delete(`http://localhost:8000/admin/students/${rollNumber}`)
        .then(() => {
          setStudents((prev) => prev.filter((s) => s.roll_number !== rollNumber));
        })
        .catch((err) => {
          console.error("Error deleting student from DB:", err);
          alert("Failed to delete student from database.");
        });
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student);
    setEditForm({
      student_name: student.student_name || "",
      email_id: student.email_id || "",
      department: student.department || "",
      year: student.year || "",
      status: student.status || "Active",
      cgpa: student.cgpa || "",
      sgpa_sem1: student.sgpa_sem1 || "",
      sgpa_sem2: student.sgpa_sem2 || "",
      sgpa_sem3: student.sgpa_sem3 || "",
      sgpa_sem4: student.sgpa_sem4 || "",
      sgpa_sem5: student.sgpa_sem5 || "",
      sgpa_sem6: student.sgpa_sem6 || "",
      sgpa_sem7: student.sgpa_sem7 || "",
      sgpa_sem8: student.sgpa_sem8 || "",
      linkedin_link: student.linkedin_link || "",
      github_profile: student.github_profile || "",
      resume: student.resume || "",
      backlogs: student.backlogs?.toString() || "0"
    });
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingStudent) return;
    
    setIsSaving(true);
    axios.put(`http://localhost:8000/admin/students/${editingStudent.roll_number}`, editForm)
      .then((res) => {
        setStudents((prev) => 
          prev.map((s) => s.roll_number === editingStudent.roll_number ? res.data : s)
        );
        if (selectedStudentProfile && selectedStudentProfile.roll_number === editingStudent.roll_number) {
          setSelectedStudentProfile(res.data);
        }
        setEditingStudent(null);
        alert("Student details updated successfully!");
      })
      .catch((err) => {
        console.error("Error updating student:", err);
        alert("Failed to update student details.");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  const handleExport = () => {
    if (students.length === 0) {
      alert("No student data available to export.");
      return;
    }

    const headers = ["Student Name", "Roll Number", "Email ID", "Department", "Year", "CGPA", "Backlogs"];
    const rows = students.map((s) => [
      s.student_name || "",
      s.roll_number || "",
      s.email_id || "",
      s.department || "",
      s.year || "",
      s.cgpa || "",
      s.backlogs?.toString() || "0"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "students_list.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="student-page">
      {selectedStudentProfile ? (
        <StudentProfile
          selectedStudent={selectedStudentProfile}
          onBack={() => setSelectedStudentProfile(null)}
          onEdit={handleEditClick}
        />
      ) : (
        <>
          <div className="page-header-section">
            <div className="page-title-area">
              <h2>Students</h2>
            </div>

            <div className="page-controls">
              <SearchAndFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterColumn={filterColumn}
                setFilterColumn={setFilterColumn}
                getSearchPlaceholder={getSearchPlaceholder}
              />

              <UploadExcel
                fileInputRef={fileInputRef}
                setToast={setToast}
                onUploadSuccess={() => {
                  axios.get("http://localhost:8000/admin/students")
                    .then((res) => {
                      setStudents(res.data);
                    })
                    .catch((err) => {
                      console.error("Error fetching students after upload:", err);
                    });
                }}
              />

              <SampleExcel />
            </div>
          </div>

          <div className="table-section">
            <div className="table-header-row">
              <h3>All Students</h3>
              <button type="button" className="export-btn" onClick={handleExport} title="Export as CSV">
                <FaFileExport />
                <span>Export</span>
              </button>
            </div>

            <StudentTable
              currentStudents={currentStudents}
              indexOfFirstStudent={indexOfFirstStudent}
              setSelectedStudentProfile={setSelectedStudentProfile}
              handleEditClick={handleEditClick}
              handleDelete={handleDelete}
            />

            {students.length > 0 && (
              <div className="table-footer">
                <span>Showing {filteredStudents.length > 0 ? indexOfFirstStudent + 1 : 0} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} entries</span>
                <div className="pagination-controls">
                  <button
                    type="button"
                    className={`page-link ${currentPage === 1 ? "disabled" : ""}`}
                    onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <FaChevronLeft size={10} />
                  </button>
                  
                  {pageNumbers.map((number) => (
                    <button
                      key={number}
                      type="button"
                      className={`page-link ${currentPage === number ? "active" : ""}`}
                      onClick={() => setCurrentPage(number)}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    type="button"
                    className={`page-link ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}
                    onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    aria-label="Next page"
                  >
                    <FaChevronRight size={10} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {editingStudent && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-content">
            <div className="edit-modal-header">
              <h3>Edit Student Details</h3>
              <button
                type="button"
                className="edit-modal-close"
                onClick={() => setEditingStudent(null)}
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit}>
              <div className="edit-form-group">
                <label className="edit-form-label">Roll Number (Disabled)</label>
                <input
                  type="text"
                  className="edit-form-input"
                  value={editingStudent.roll_number}
                  disabled
                />
              </div>

              <div className="edit-form-group">
                <label className="edit-form-label">Student Name</label>
                <input
                  type="text"
                  name="student_name"
                  className="edit-form-input"
                  value={editForm.student_name}
                  onChange={handleEditFormChange}
                  required
                />
              </div>

              <div className="edit-form-group">
                <label className="edit-form-label">Email Address</label>
                <input
                  type="email"
                  name="email_id"
                  className="edit-form-input"
                  value={editForm.email_id}
                  onChange={handleEditFormChange}
                  required
                />
              </div>

              <div className="edit-form-group">
                <label className="edit-form-label">Department</label>
                <input
                  type="text"
                  name="department"
                  className="edit-form-input"
                  value={editForm.department}
                  onChange={handleEditFormChange}
                  required
                />
              </div>

              <div className="edit-form-group">
                <label className="edit-form-label">Year</label>
                <input
                  type="text"
                  name="year"
                  className="edit-form-input"
                  value={editForm.year}
                  onChange={handleEditFormChange}
                  required
                />
              </div>

              <div className="edit-section-title">Academic Details</div>

              <div className="edit-form-group">
                <label className="edit-form-label">Cumulative Grade Point Average (CGPA)</label>
                <input
                  type="text"
                  name="cgpa"
                  className="edit-form-input"
                  value={editForm.cgpa}
                  onChange={handleEditFormChange}
                  placeholder="e.g. 9.15"
                />
              </div>

              <div className="edit-form-row">
                <div className="edit-form-group">
                  <label className="edit-form-label">Semester 1 SGPA</label>
                  <input
                    type="text"
                    name="sgpa_sem1"
                    className="edit-form-input"
                    value={editForm.sgpa_sem1}
                    onChange={handleEditFormChange}
                    placeholder="Sem 1"
                  />
                </div>
                <div className="edit-form-group">
                  <label className="edit-form-label">Semester 2 SGPA</label>
                  <input
                    type="text"
                    name="sgpa_sem2"
                    className="edit-form-input"
                    value={editForm.sgpa_sem2}
                    onChange={handleEditFormChange}
                    placeholder="Sem 2"
                  />
                </div>
              </div>

              <div className="edit-form-row">
                <div className="edit-form-group">
                  <label className="edit-form-label">Semester 3 SGPA</label>
                  <input
                    type="text"
                    name="sgpa_sem3"
                    className="edit-form-input"
                    value={editForm.sgpa_sem3}
                    onChange={handleEditFormChange}
                    placeholder="Sem 3"
                  />
                </div>
                <div className="edit-form-group">
                  <label className="edit-form-label">Semester 4 SGPA</label>
                  <input
                    type="text"
                    name="sgpa_sem4"
                    className="edit-form-input"
                    value={editForm.sgpa_sem4}
                    onChange={handleEditFormChange}
                    placeholder="Sem 4"
                  />
                </div>
              </div>

              <div className="edit-form-row">
                <div className="edit-form-group">
                  <label className="edit-form-label">Semester 5 SGPA</label>
                  <input
                    type="text"
                    name="sgpa_sem5"
                    className="edit-form-input"
                    value={editForm.sgpa_sem5}
                    onChange={handleEditFormChange}
                    placeholder="Sem 5"
                  />
                </div>
                <div className="edit-form-group">
                  <label className="edit-form-label">Semester 6 SGPA</label>
                  <input
                    type="text"
                    name="sgpa_sem6"
                    className="edit-form-input"
                    value={editForm.sgpa_sem6}
                    onChange={handleEditFormChange}
                    placeholder="Sem 6"
                  />
                </div>
              </div>

              <div className="edit-form-row">
                <div className="edit-form-group">
                  <label className="edit-form-label">Semester 7 SGPA</label>
                  <input
                    type="text"
                    name="sgpa_sem7"
                    className="edit-form-input"
                    value={editForm.sgpa_sem7}
                    onChange={handleEditFormChange}
                    placeholder="Sem 7"
                  />
                </div>
                <div className="edit-form-group">
                  <label className="edit-form-label">Semester 8 SGPA</label>
                  <input
                    type="text"
                    name="sgpa_sem8"
                    className="edit-form-input"
                    value={editForm.sgpa_sem8}
                    onChange={handleEditFormChange}
                    placeholder="Sem 8"
                  />
                </div>
              </div>

              <div className="edit-modal-footer">
                <button
                  type="button"
                  className="edit-btn-cancel"
                  onClick={() => setEditingStudent(null)}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="edit-btn-save"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast.show && (
        <div className={`upload-toast toast-${toast.type}`}>
          {renderToastIcon()}
          <span>{toast.message}</span>
          <button
            className="toast-close-btn"
            onClick={() =>
              setToast((prev) => ({
                ...prev,
                show: false
              }))
            }
          >
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
}

export default Student;
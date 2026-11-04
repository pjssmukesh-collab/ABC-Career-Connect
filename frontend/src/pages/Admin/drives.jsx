import React, { useState, useEffect } from "react";
import { getDrives, createDrive, closeDrive, deleteDrive } from "../../services/driveService";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Table from "../../components/common/Table";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import SearchBar from "../../components/common/SearchBar";
import { FaTrash, FaPlus, FaBriefcase, FaCalendarAlt, FaCheck, FaTimes } from "react-icons/fa";

import styles from "./recruiters.module.css";

function AdminDrives() {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    recruiter_email: "",
    job_title: "",
    role_type: "Full Time",
    ctc_package: "",
    location: "Hybrid / On-site",
    eligible_departments: "CSE, IT, ECE",
    required_cgpa: "7.0",
    allowed_backlogs: 0,
    job_description: "",
    application_deadline: "",
    drive_date: "",
    status: "Active"
  });

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const data = await getDrives();
      setDrives(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch recruitment drives.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createDrive(formData);
      setIsOpen(false);
      setFormData({
        company_name: "",
        recruiter_email: "",
        job_title: "",
        role_type: "Full Time",
        ctc_package: "",
        location: "Hybrid / On-site",
        eligible_departments: "CSE, IT, ECE",
        required_cgpa: "7.0",
        allowed_backlogs: 0,
        job_description: "",
        application_deadline: "",
        drive_date: "",
        status: "Active"
      });
      fetchDrives();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to schedule drive.");
    }
  };

  const handleClose = async (id) => {
    if (window.confirm("Close registration for this recruitment drive?")) {
      try {
        await closeDrive(id);
        fetchDrives();
      } catch (err) {
        console.error(err);
        alert("Failed to close drive.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this drive?")) {
      try {
        await deleteDrive(id);
        fetchDrives();
      } catch (err) {
        console.error(err);
        alert("Failed to delete drive.");
      }
    }
  };

  const filteredDrives = drives.filter((d) => {
    const term = searchQuery.toLowerCase();
    const matchQuery =
      (d.company_name || "").toLowerCase().includes(term) ||
      (d.job_title || "").toLowerCase().includes(term) ||
      (d.location || "").toLowerCase().includes(term);

    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    return matchQuery && matchStatus;
  });

  if (loading) return <Loader message="Fetching recruitment drives..." />;
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div>
          <h2 className={styles.title}>Campus Job Drives</h2>
          <p className={styles.subtitle}>
            Organize recruitment schedules, criteria rules, packages, and eligibility.
          </p>
        </div>

        <div className={styles.controlsContainer}>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drives or company..."
          />
          <button className={styles.addButton} onClick={() => setIsOpen(true)}>
            <FaPlus />
            Schedule New Drive
          </button>
        </div>
      </div>

      <Card>
        {filteredDrives.length > 0 ? (
          <Table
            headers={[
              "Company",
              "Role / Title",
              "Package (CTC)",
              "Location",
              "Min CGPA",
              "Depts",
              "Deadline",
              "Drive Date",
              "Applicants",
              "Status",
              "Actions"
            ]}
            data={filteredDrives}
            renderRow={(d) => (
              <>
                <td className={styles.tableCellBold}>
                  <div className={styles.nameContainer}>
                    <FaBriefcase color="#C62828" />
                    {d.company_name}
                  </div>
                </td>
                <td className={styles.tableCellBold}>{d.job_title}</td>
                <td className={styles.tableCell} style={{ color: "#047857", fontWeight: 600 }}>
                  {d.ctc_package}
                </td>
                <td className={styles.tableCell}>{d.location}</td>
                <td className={styles.tableCellBold}>{d.required_cgpa}</td>
                <td className={styles.tableCell}>{d.eligible_departments}</td>
                <td className={styles.tableCell}>{d.application_deadline}</td>
                <td className={styles.tableCell}>{d.drive_date}</td>
                <td className={styles.tableCellBold}>{d.applicants_count || 0}</td>
                <td className={styles.tableCell}>
                  <span
                    className={`${styles.badge} ${
                      d.status === "Active" ? styles.badgeActive : styles.badgeInactive
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {d.status === "Active" && (
                      <button
                        className={styles.iconButton}
                        onClick={() => handleClose(d.id)}
                        title="Close Registration"
                        style={{ color: "#d97706" }}
                      >
                        <FaTimes />
                      </button>
                    )}
                    <button
                      className={styles.iconButton}
                      onClick={() => handleDelete(d.id)}
                      title="Delete Drive"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </>
            )}
          />
        ) : (
          <EmptyState message="No recruitment drives found." />
        )}
      </Card>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Schedule Campus Drive">
        <form onSubmit={handleCreateSubmit} className={styles.formContainer}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Company Name *</label>
              <input
                type="text"
                required
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className={styles.formInput}
                placeholder="e.g. Google, Microsoft"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Recruiter Contact Email *</label>
              <input
                type="email"
                required
                value={formData.recruiter_email}
                onChange={(e) => setFormData({ ...formData, recruiter_email: e.target.value })}
                className={styles.formInput}
                placeholder="recruiter@company.com"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Job Title / Role *</label>
              <input
                type="text"
                required
                value={formData.job_title}
                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                className={styles.formInput}
                placeholder="e.g. Software Engineer"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Package (CTC) *</label>
              <input
                type="text"
                required
                value={formData.ctc_package}
                onChange={(e) => setFormData({ ...formData, ctc_package: e.target.value })}
                className={styles.formInput}
                placeholder="e.g. 12.0 LPA"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Job Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={styles.formInput}
                placeholder="e.g. Bengaluru / Hyderabad"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Eligible Departments</label>
              <input
                type="text"
                value={formData.eligible_departments}
                onChange={(e) => setFormData({ ...formData, eligible_departments: e.target.value })}
                className={styles.formInput}
                placeholder="CSE, IT, ECE or All"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Min CGPA Required</label>
              <input
                type="text"
                value={formData.required_cgpa}
                onChange={(e) => setFormData({ ...formData, required_cgpa: e.target.value })}
                className={styles.formInput}
                placeholder="e.g. 7.5"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Max Allowed Backlogs</label>
              <input
                type="number"
                min="0"
                value={formData.allowed_backlogs}
                onChange={(e) => setFormData({ ...formData, allowed_backlogs: parseInt(e.target.value) || 0 })}
                className={styles.formInput}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Application Deadline *</label>
              <input
                type="date"
                required
                value={formData.application_deadline}
                onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Drive / Interview Date *</label>
              <input
                type="date"
                required
                value={formData.drive_date}
                onChange={(e) => setFormData({ ...formData, drive_date: e.target.value })}
                className={styles.formInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Job Description</label>
            <textarea
              rows="3"
              value={formData.job_description}
              onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
              className={styles.formInput}
              placeholder="Outline responsibilities, skill expectations..."
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Drive
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AdminDrives;


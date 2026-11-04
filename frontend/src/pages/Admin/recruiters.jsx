import React, { useState, useEffect } from "react";
import { getRecruiters, createRecruiter, deleteRecruiter } from "../../services/recruiterService";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Table from "../../components/common/Table";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import SearchBar from "../../components/common/SearchBar";
import { FaTrash, FaPlus, FaUserTie } from "react-icons/fa";

import styles from "./recruiters.module.css";

function Recruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Create Modal
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company_name: "",
    email_id: "",
    phone: "",
    password: "",
    status: "Active"
  });

  const fetchList = async () => {
    try {
      setLoading(true);
      const data = await getRecruiters();
      setRecruiters(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch recruiters list from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRecruiter(formData);
      setIsOpen(false);
      setFormData({
        name: "",
        company_name: "",
        email_id: "",
        phone: "",
        password: "",
        status: "Active"
      });
      fetchList();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to create recruiter profile.");
    }
  };

  const handleDelete = async (emailId) => {
    if (window.confirm(`Are you sure you want to remove recruiter account for ${emailId}?`)) {
      try {
        await deleteRecruiter(emailId);
        fetchList();
      } catch (err) {
        console.error(err);
        alert("Failed to delete recruiter.");
      }
    }
  };

  const filteredRecruiters = recruiters.filter((r) => {
    const term = searchQuery.toLowerCase();
    return (
      (r.name || "").toLowerCase().includes(term) ||
      (r.company_name || "").toLowerCase().includes(term) ||
      (r.email_id || "").toLowerCase().includes(term)
    );
  });

  if (loading) return <Loader message="Fetching recruiters profiles..." />;
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.headerContainer}>
        <div>
          <h2 className={styles.title}>Recruiter Accounts</h2>
          <p className={styles.subtitle}>Manage recruiter users access and credentials.</p>
        </div>

        <div className={styles.controlsContainer}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search name, company, email..." />
          <button
            onClick={() => setIsOpen(true)}
            className={styles.addButton}
          >
            <FaPlus /> Add Recruiter
          </button>
        </div>
      </div>

      {/* Recruiter Profiles Table */}
      <Card>
        {filteredRecruiters.length > 0 ? (
          <Table
            headers={["Name", "Company", "Email", "Phone", "Status", "Actions"]}
            data={filteredRecruiters}
            renderRow={(r) => (
              <>
                <td className={styles.tableCellBold}>
                  <div className={styles.nameContainer}>
                    <FaUserTie color="#9ca3af" />
                    <span>{r.name || "Recruiter Manager"}</span>
                  </div>
                </td>
                <td className={styles.tableCell}>{r.company_name}</td>
                <td className={styles.tableCell}>{r.email_id}</td>
                <td className={styles.tableCell}>{r.phone || "N/A"}</td>
                <td className={styles.tableCell}>
                  <span className={`${styles.badge} ${r.status === "Active" ? styles.badgeActive : styles.badgeInactive}`}>
                    {r.status || "Active"}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <button
                    onClick={() => handleDelete(r.email_id)}
                    className={styles.iconButton}
                    title="Remove Recruiter"
                  >
                    <FaTrash />
                  </button>
                </td>
              </>
            )}
          />
        ) : (
          <EmptyState message="No recruiters registered." />
        )}
      </Card>

      {/* Create Recruiter Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Register Recruiter User Account">
        <form onSubmit={handleCreateSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Company Name</label>
            <input
              type="text"
              required
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Recruiter Email (Login ID) *</label>
            <input
              type="email"
              required
              value={formData.email_id}
              onChange={(e) => setFormData({ ...formData, email_id: e.target.value })}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Temporary Password *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={styles.formInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Account Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className={styles.formInput}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={styles.cancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
            >
              Create Account
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Recruiters;

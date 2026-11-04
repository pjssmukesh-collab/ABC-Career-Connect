import React, { useState, useEffect } from "react";
import { getApplications, updateApplicationStatus } from "../../services/applicationService";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Table from "../../components/common/Table";
import Card from "../../components/common/Card";
import SearchBar from "../../components/common/SearchBar";
import { FaFileAlt, FaCheckCircle, FaUserGraduate } from "react-icons/fa";

import styles from "./recruiters.module.css";

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const data = await getApplications();
      setApplications(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to retrieve candidate applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await updateApplicationStatus(appId, newStatus);
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert("Failed to update candidate status.");
    }
  };

  const filteredApps = applications.filter((app) => {
    const term = searchQuery.toLowerCase();
    const matchesSearch =
      (app.student_name || "").toLowerCase().includes(term) ||
      (app.student_roll_number || "").toLowerCase().includes(term) ||
      (app.company_name || "").toLowerCase().includes(term) ||
      (app.job_title || "").toLowerCase().includes(term);

    const matchesStatus = statusFilter === "all" || app.current_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Selected":
      case "Offer Released":
        return <span className={`${styles.badge} ${styles.badgeActive}`}>{status}</span>;
      case "Rejected":
        return <span className={`${styles.badge} ${styles.badgeInactive}`}>{status}</span>;
      case "Shortlisted":
      case "Interviewed":
        return (
          <span
            className={styles.badge}
            style={{ backgroundColor: "#eff6ff", color: "#1d4ed8" }}
          >
            {status}
          </span>
        );
      default:
        return (
          <span
            className={styles.badge}
            style={{ backgroundColor: "#fef3c7", color: "#b45309" }}
          >
            {status || "Applied"}
          </span>
        );
    }
  };

  if (loading) return <Loader message="Fetching submitted applications..." />;
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
          <h2 className={styles.title}>Student Placement Applications</h2>
          <p className={styles.subtitle}>
            Monitor hiring pipeline progress from application through shortlist to final selection.
          </p>
        </div>

        <div className={styles.controlsContainer}>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, roll no, company..."
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              height: "37px",
              padding: "0 12px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
              backgroundColor: "#ffffff",
              fontSize: "14px",
              color: "#374151"
            }}
          >
            <option value="all">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interviewed">Interviewed</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <Card>
        {filteredApps.length > 0 ? (
          <Table
            headers={[
              "Student",
              "Roll Number",
              "Dept",
              "CGPA",
              "Company",
              "Role",
              "Package",
              "Applied Date",
              "Status",
              "Change Status"
            ]}
            data={filteredApps}
            renderRow={(app) => (
              <>
                <td className={styles.tableCellBold}>
                  <div className={styles.nameContainer}>
                    <FaUserGraduate color="#C62828" />
                    {app.student_name}
                  </div>
                </td>
                <td className={styles.tableCell}>{app.student_roll_number}</td>
                <td className={styles.tableCell}>{app.department}</td>
                <td className={styles.tableCellBold}>{app.cgpa || "-"}</td>
                <td className={styles.tableCellBold} style={{ color: "#111827" }}>
                  {app.company_name}
                </td>
                <td className={styles.tableCell}>{app.job_title}</td>
                <td className={styles.tableCell} style={{ color: "#047857", fontWeight: 600 }}>
                  {app.ctc_package || "-"}
                </td>
                <td className={styles.tableCell}>{app.applied_date}</td>
                <td className={styles.tableCell}>{getStatusBadge(app.current_status)}</td>
                <td className={styles.tableCell}>
                  <select
                    value={app.current_status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      border: "1px solid #cbd5e1",
                      fontSize: "13px",
                      background: "#ffffff",
                      cursor: "pointer"
                    }}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlist</option>
                    <option value="Interviewed">Interviewed</option>
                    <option value="Selected">Select / Offer</option>
                    <option value="Rejected">Reject</option>
                  </select>
                </td>
              </>
            )}
          />
        ) : (
          <EmptyState message="No student applications recorded." />
        )}
      </Card>
    </div>
  );
}

export default AdminApplications;


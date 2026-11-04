import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Table from "../../components/common/Table";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import SearchBar from "../../components/common/SearchBar";

import {
  getRecruiterProfile,
  updateRecruiterProfile,
  changeRecruiterPassword,
  getRecruiterDashboardStats,
  getRecruiterDrives,
  createRecruiterDrive,
  closeRecruiterDrive,
  deleteRecruiterDrive,
  getRecruiterApplicants,
  updateCandidateStatus
} from "../../services/recruiterService";

import {
  FaChartBar,
  FaBriefcase,
  FaUsers,
  FaBuilding,
  FaSignOutAlt,
  FaPlus,
  FaTrash,
  FaCheck,
  FaTimes,
  FaExternalLinkAlt,
  FaUserTie,
  FaUserGraduate,
  FaEnvelope,
  FaPhone,
  FaLock
} from "react-icons/fa";

import styles from "./Recruiter.module.css";

function Recruiter() {
  const navigate = useNavigate();
  // Get logged-in recruiter email or fallback to demo google recruiter
  const emailId = localStorage.getItem("recruiterEmail") || "google@gmail.com";
  const [recruiter, setRecruiter] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // overview, drives, applicants, profile
  const [loading, setLoading] = useState(true);

  // Stats state
  const [stats, setStats] = useState(null);

  // Drives state
  const [drives, setDrives] = useState([]);
  const [driveSearch, setDriveSearch] = useState("");
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [driveForm, setDriveForm] = useState({
    job_title: "",
    role_type: "Full Time",
    ctc_package: "",
    location: "Bengaluru / Hybrid",
    eligible_departments: "CSE, IT, ECE",
    required_cgpa: "7.0",
    allowed_backlogs: 0,
    job_description: "",
    application_deadline: "",
    drive_date: ""
  });

  // Applicants state
  const [applicants, setApplicants] = useState([]);
  const [applicantSearch, setApplicantSearch] = useState("");
  const [selectedDriveFilter, setSelectedDriveFilter] = useState("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("all");

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    company_name: ""
  });
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });

  // Load initial data
  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, statsData, drivesData, applicantsData] = await Promise.all([
        getRecruiterProfile(emailId),
        getRecruiterDashboardStats(emailId),
        getRecruiterDrives(emailId),
        getRecruiterApplicants(emailId)
      ]);
      setRecruiter(profileData);
      setProfileForm({
        name: profileData.name || "",
        phone: profileData.phone || "",
        company_name: profileData.company_name || ""
      });
      setStats(statsData);
      setDrives(drivesData);
      setApplicants(applicantsData);
    } catch (err) {
      console.error("Recruiter portal load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [emailId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Drive Actions
  const handleCreateDrive = async (e) => {
    e.preventDefault();
    try {
      await createRecruiterDrive(emailId, driveForm);
      setIsDriveModalOpen(false);
      setDriveForm({
        job_title: "",
        role_type: "Full Time",
        ctc_package: "",
        location: "Bengaluru / Hybrid",
        eligible_departments: "CSE, IT, ECE",
        required_cgpa: "7.0",
        allowed_backlogs: 0,
        job_description: "",
        application_deadline: "",
        drive_date: ""
      });
      loadData();
      alert("Recruitment drive posted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to create drive.");
    }
  };

  const handleCloseDrive = async (driveId) => {
    if (window.confirm("Close this recruitment drive for applications?")) {
      try {
        await closeRecruiterDrive(driveId);
        loadData();
      } catch (err) {
        console.error(err);
        alert("Failed to close drive.");
      }
    }
  };

  const handleDeleteDrive = async (driveId) => {
    if (window.confirm("Are you sure you want to delete this drive?")) {
      try {
        await deleteRecruiterDrive(driveId);
        loadData();
      } catch (err) {
        console.error(err);
        alert("Failed to delete drive.");
      }
    }
  };

  // Applicant Status Action
  const handleUpdateApplicantStatus = async (appId, newStatus) => {
    try {
      await updateCandidateStatus(appId, newStatus);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to update applicant status.");
    }
  };

  // Profile Action
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateRecruiterProfile(emailId, profileForm);
      loadData();
      alert("Recruiter profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert("New password and confirm password do not match.");
      return;
    }
    try {
      await changeRecruiterPassword(emailId, passwordForm.old_password, passwordForm.new_password);
      setPasswordForm({ old_password: "", new_password: "", confirm_password: "" });
      alert("Password changed successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to update password.");
    }
  };

  if (loading) return <Loader message="Accessing Recruiter Workspace..." />;

  const filteredDrives = drives.filter((d) => {
    const term = driveSearch.toLowerCase();
    return (
      (d.job_title || "").toLowerCase().includes(term) ||
      (d.location || "").toLowerCase().includes(term) ||
      (d.eligible_departments || "").toLowerCase().includes(term)
    );
  });

  const filteredApplicants = applicants.filter((a) => {
    const term = applicantSearch.toLowerCase();
    const matchSearch =
      (a.student_name || "").toLowerCase().includes(term) ||
      (a.student_roll_number || "").toLowerCase().includes(term) ||
      (a.department || "").toLowerCase().includes(term) ||
      (a.job_title || "").toLowerCase().includes(term);

    const matchDrive = selectedDriveFilter === "all" || a.drive_id === parseInt(selectedDriveFilter);
    const matchStatus = selectedStatusFilter === "all" || a.current_status === selectedStatusFilter;

    return matchSearch && matchDrive && matchStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Selected":
      case "Offer Released":
        return <span className={`${styles.badge} ${styles.badgeSelected}`}>{status}</span>;
      case "Shortlisted":
        return <span className={`${styles.badge} ${styles.badgeShortlisted}`}>{status}</span>;
      case "Interviewed":
        return <span className={`${styles.badge} ${styles.badgeInterviewed}`}>{status}</span>;
      case "Rejected":
        return <span className={`${styles.badge} ${styles.badgeRejected}`}>{status}</span>;
      default:
        return <span className={`${styles.badge} ${styles.badgeApplied}`}>{status || "Applied"}</span>;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <Link to="/" style={{ display: "flex", alignItems: "center" }}>
            <img src={logo} className={styles.logo} alt="ABC Career Connect" />
          </Link>
          <div className={styles.brandCopy}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <h1>ABC Career Connect</h1>
              <span className={styles.portalBadge}>Recruiter</span>
            </div>
            <p>Corporate Talent Acquisition Portal</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className={styles.nav}>
          <button
            className={`${styles.navButton} ${activeTab === "overview" ? styles.navButtonActive : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <FaChartBar />
            <span>Dashboard</span>
          </button>

          <button
            className={`${styles.navButton} ${activeTab === "drives" ? styles.navButtonActive : ""}`}
            onClick={() => setActiveTab("drives")}
          >
            <FaBriefcase />
            <span>Job Drives ({drives.length})</span>
          </button>

          <button
            className={`${styles.navButton} ${activeTab === "applicants" ? styles.navButtonActive : ""}`}
            onClick={() => setActiveTab("applicants")}
          >
            <FaUsers />
            <span>Candidates ({applicants.length})</span>
          </button>

          <button
            className={`${styles.navButton} ${activeTab === "profile" ? styles.navButtonActive : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <FaBuilding />
            <span>Company Profile</span>
          </button>
        </nav>

        {/* Right Section */}
        <div className={styles.headerRight}>
          <div className={styles.companyChip}>
            <FaBuilding color="#C62828" />
            <span>{recruiter?.company_name || "Company"}</span>
          </div>

          <div className={styles.recruiterAvatar} title={recruiter?.name || "Recruiter"}>
            {(recruiter?.name || "R").charAt(0).toUpperCase()}
          </div>

          <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className={styles.main}>
        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ======================================================== */}
        {activeTab === "overview" && (
          <div>
            <div className={styles.pageHeader}>
              <div>
                <h2 className={styles.pageTitle}>Recruiter Workspace</h2>
                <p className={styles.pageSubtitle}>
                  Overview of recruitment campaigns, applicant pipelines, and hiring activity for{" "}
                  <strong>{recruiter?.company_name}</strong>.
                </p>
              </div>

              <button className={styles.primaryButton} onClick={() => setIsDriveModalOpen(true)}>
                <FaPlus />
                Post New Job Drive
              </button>
            </div>

            {/* Metrics Grid */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}>
                  <FaBriefcase size={22} />
                </div>
                <div className={styles.statDetails}>
                  <span className={styles.statLabel}>Active Job Drives</span>
                  <span className={styles.statValue}>{stats?.active_drives ?? 0}</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>
                  <FaUsers size={22} />
                </div>
                <div className={styles.statDetails}>
                  <span className={styles.statLabel}>Total Applicants</span>
                  <span className={styles.statValue}>{stats?.total_applicants ?? 0}</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}>
                  <FaUserTie size={22} />
                </div>
                <div className={styles.statDetails}>
                  <span className={styles.statLabel}>Shortlisted Candidates</span>
                  <span className={styles.statValue}>{stats?.shortlisted_count ?? 0}</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ backgroundColor: "#ecfdf5", color: "#059669" }}>
                  <FaCheck size={22} />
                </div>
                <div className={styles.statDetails}>
                  <span className={styles.statLabel}>Selected / Hired</span>
                  <span className={styles.statValue}>{stats?.selected_count ?? 0}</span>
                </div>
              </div>
            </div>

            {/* Recent Applicants Card */}
            <Card title="Recent Candidate Applications">
              {applicants.length > 0 ? (
                <Table
                  headers={["Candidate", "Roll No", "Dept", "CGPA", "Drive Role", "Applied Date", "Status", "Quick Action"]}
                  data={applicants.slice(0, 5)}
                  renderRow={(a) => (
                    <>
                      <td style={{ fontWeight: 600, color: "#0f172a", padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <FaUserGraduate color="#C62828" />
                          {a.student_name}
                        </div>
                      </td>
                      <td style={{ padding: "14px 18px", color: "#475569" }}>{a.student_roll_number}</td>
                      <td style={{ padding: "14px 18px", color: "#475569" }}>{a.department}</td>
                      <td style={{ fontWeight: 600, padding: "14px 18px", color: "#0f172a" }}>{a.cgpa || "-"}</td>
                      <td style={{ padding: "14px 18px", color: "#475569" }}>{a.job_title}</td>
                      <td style={{ padding: "14px 18px", color: "#475569" }}>{a.applied_date}</td>
                      <td style={{ padding: "14px 18px" }}>{getStatusBadge(a.current_status)}</td>
                      <td style={{ padding: "14px 18px" }}>
                        <select
                          value={a.current_status}
                          onChange={(e) => handleUpdateApplicantStatus(a.id, e.target.value)}
                          className={styles.selectInput}
                          style={{ height: "32px", fontSize: "13px" }}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlist</option>
                          <option value="Interviewed">Interview</option>
                          <option value="Selected">Select / Offer</option>
                          <option value="Rejected">Reject</option>
                        </select>
                      </td>
                    </>
                  )}
                />
              ) : (
                <EmptyState message="No candidate applications received yet." />
              )}
            </Card>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: JOB DRIVES */}
        {/* ======================================================== */}
        {activeTab === "drives" && (
          <div>
            <div className={styles.pageHeader}>
              <div>
                <h2 className={styles.pageTitle}>Campus Job Drives</h2>
                <p className={styles.pageSubtitle}>
                  Post and oversee recruitment drives, eligibility criteria, and scheduled dates.
                </p>
              </div>

              <div className={styles.controlsBar}>
                <SearchBar
                  value={driveSearch}
                  onChange={(e) => setDriveSearch(e.target.value)}
                  placeholder="Search your drives..."
                />
                <button className={styles.primaryButton} onClick={() => setIsDriveModalOpen(true)}>
                  <FaPlus />
                  Post New Drive
                </button>
              </div>
            </div>

            <Card>
              {filteredDrives.length > 0 ? (
                <Table
                  headers={[
                    "Job Role",
                    "Type",
                    "CTC Package",
                    "Location",
                    "Min CGPA",
                    "Eligible Depts",
                    "Deadline",
                    "Drive Date",
                    "Applicants",
                    "Status",
                    "Actions"
                  ]}
                  data={filteredDrives}
                  renderRow={(d) => (
                    <>
                      <td style={{ fontWeight: 600, color: "#0f172a", padding: "14px 18px" }}>
                        {d.job_title}
                      </td>
                      <td style={{ padding: "14px 18px", color: "#475569" }}>{d.role_type}</td>
                      <td style={{ fontWeight: 600, color: "#059669", padding: "14px 18px" }}>
                        {d.ctc_package}
                      </td>
                      <td style={{ padding: "14px 18px", color: "#475569" }}>{d.location}</td>
                      <td style={{ fontWeight: 600, color: "#0f172a", padding: "14px 18px" }}>
                        {d.required_cgpa}
                      </td>
                      <td style={{ padding: "14px 18px", color: "#475569" }}>
                        {d.eligible_departments}
                      </td>
                      <td style={{ padding: "14px 18px", color: "#475569" }}>
                        {d.application_deadline}
                      </td>
                      <td style={{ padding: "14px 18px", color: "#475569" }}>{d.drive_date}</td>
                      <td style={{ fontWeight: 600, color: "#0f172a", padding: "14px 18px" }}>
                        <button
                          onClick={() => {
                            setSelectedDriveFilter(d.id.toString());
                            setActiveTab("applicants");
                          }}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#C62828",
                            fontWeight: 600,
                            cursor: "pointer",
                            textDecoration: "underline"
                          }}
                        >
                          {d.applicants_count || 0} candidates
                        </button>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span
                          className={`${styles.badge} ${
                            d.status === "Active" ? styles.badgeActive : styles.badgeClosed
                          }`}
                        >
                          {d.status}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", gap: "8px" }}>
                          {d.status === "Active" && (
                            <button
                              onClick={() => handleCloseDrive(d.id)}
                              title="Close Drive"
                              style={{
                                background: "none",
                                border: "none",
                                color: "#d97706",
                                cursor: "pointer",
                                padding: "4px"
                              }}
                            >
                              <FaTimes size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteDrive(d.id)}
                            title="Delete Drive"
                            style={{
                              background: "none",
                              border: "none",
                              color: "#dc2626",
                              cursor: "pointer",
                              padding: "4px"
                            }}
                          >
                            <FaTrash size={15} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                />
              ) : (
                <EmptyState message="No job drives found matching your filter." />
              )}
            </Card>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CANDIDATES & APPLICANTS */}
        {/* ======================================================== */}
        {activeTab === "applicants" && (
          <div>
            <div className={styles.pageHeader}>
              <div>
                <h2 className={styles.pageTitle}>Candidate Applications</h2>
                <p className={styles.pageSubtitle}>
                  Evaluate applicants, inspect student resumes, and update recruitment status pipeline.
                </p>
              </div>

              <div className={styles.controlsBar}>
                <SearchBar
                  value={applicantSearch}
                  onChange={(e) => setApplicantSearch(e.target.value)}
                  placeholder="Search by student, roll no..."
                />

                <select
                  value={selectedDriveFilter}
                  onChange={(e) => setSelectedDriveFilter(e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="all">All Drives</option>
                  {drives.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.job_title}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedStatusFilter}
                  onChange={(e) => setSelectedStatusFilter(e.target.value)}
                  className={styles.selectInput}
                >
                  <option value="all">All Statuses</option>
                  <option value="Applied">Applied</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interviewed">Interviewed</option>
                  <option value="Selected">Selected / Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>

            <Card>
              {filteredApplicants.length > 0 ? (
                <Table
                  headers={[
                    "Candidate",
                    "Roll Number",
                    "Dept",
                    "CGPA",
                    "Backlogs",
                    "Role Applied",
                    "Resume / Links",
                    "Applied Date",
                    "Status",
                    "Update Status"
                  ]}
                  data={filteredApplicants}
                  renderRow={(a) => (
                    <>
                      <td style={{ fontWeight: 600, color: "#0f172a", padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <FaUserGraduate color="#C62828" />
                          <div>
                            <div>{a.student_name}</div>
                            <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 400 }}>
                              {a.student_email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "14px 18px", color: "#475569" }}>{a.student_roll_number}</td>
                      <td style={{ padding: "14px 18px", color: "#475569" }}>{a.department}</td>
                      <td style={{ fontWeight: 600, color: "#0f172a", padding: "14px 18px" }}>
                        {a.cgpa || "-"}
                      </td>
                      <td style={{ padding: "14px 18px", color: "#475569" }}>{a.backlogs ?? 0}</td>
                      <td style={{ padding: "14px 18px", color: "#0f172a", fontWeight: 500 }}>
                        {a.job_title}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", gap: "10px" }}>
                          {a.resume ? (
                            <a
                              href={a.resume}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#C62828",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                                textDecoration: "none",
                                fontSize: "13px",
                                fontWeight: 500
                              }}
                            >
                              Resume <FaExternalLinkAlt size={11} />
                            </a>
                          ) : (
                            <span style={{ color: "#94a3b8", fontSize: "13px" }}>No resume</span>
                          )}
                          {a.linkedin_link && (
                            <a
                              href={a.linkedin_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#0284c7", fontSize: "13px" }}
                              title="LinkedIn Profile"
                            >
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: "14px 18px", color: "#475569" }}>{a.applied_date}</td>
                      <td style={{ padding: "14px 18px" }}>{getStatusBadge(a.current_status)}</td>
                      <td style={{ padding: "14px 18px" }}>
                        <select
                          value={a.current_status}
                          onChange={(e) => handleUpdateApplicantStatus(a.id, e.target.value)}
                          className={styles.selectInput}
                          style={{ height: "32px", fontSize: "13px" }}
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlist</option>
                          <option value="Interviewed">Schedule Interview</option>
                          <option value="Selected">Select / Offer</option>
                          <option value="Rejected">Reject</option>
                        </select>
                      </td>
                    </>
                  )}
                />
              ) : (
                <EmptyState message="No applicants match the selected criteria." />
              )}
            </Card>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: COMPANY PROFILE */}
        {/* ======================================================== */}
        {activeTab === "profile" && (
          <div>
            <div className={styles.pageHeader}>
              <div>
                <h2 className={styles.pageTitle}>Company & Recruiter Profile</h2>
                <p className={styles.pageSubtitle}>
                  Update organization details, primary contact phone, and credentials.
                </p>
              </div>
            </div>

            <div className={styles.profileGrid}>
              <Card title="Corporate Profile Details">
                <form onSubmit={handleProfileSubmit}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Company Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.company_name}
                      onChange={(e) => setProfileForm({ ...profileForm, company_name: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Recruiter Contact Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Corporate Email (Login ID)</label>
                    <input
                      type="email"
                      disabled
                      value={emailId}
                      className={styles.formInput}
                      style={{ backgroundColor: "#f8fafc", color: "#64748b" }}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Contact Phone Number</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className={styles.formInput}
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <button type="submit" className={styles.primaryButton}>
                    Save Profile Changes
                  </button>
                </form>
              </Card>

              <Card title="Change Portal Password">
                <form onSubmit={handlePasswordSubmit}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.old_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirm_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>

                  <button type="submit" className={styles.primaryButton}>
                    Update Password
                  </button>
                </form>
              </Card>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Post New Job Drive */}
      <Modal
        isOpen={isDriveModalOpen}
        onClose={() => setIsDriveModalOpen(false)}
        title="Post New Campus Recruitment Drive"
      >
        <form onSubmit={handleCreateDrive}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Job Title / Role *</label>
              <input
                type="text"
                required
                value={driveForm.job_title}
                onChange={(e) => setDriveForm({ ...driveForm, job_title: e.target.value })}
                className={styles.formInput}
                placeholder="e.g. Software Engineer (SDE-1)"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Employment Type *</label>
              <select
                value={driveForm.role_type}
                onChange={(e) => setDriveForm({ ...driveForm, role_type: e.target.value })}
                className={styles.formInput}
              >
                <option value="Full Time">Full Time</option>
                <option value="Internship">Internship</option>
                <option value="Full Time + Internship">Full Time + Internship</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Compensation Package (CTC) *</label>
              <input
                type="text"
                required
                value={driveForm.ctc_package}
                onChange={(e) => setDriveForm({ ...driveForm, ctc_package: e.target.value })}
                className={styles.formInput}
                placeholder="e.g. 14.5 LPA"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Location *</label>
              <input
                type="text"
                required
                value={driveForm.location}
                onChange={(e) => setDriveForm({ ...driveForm, location: e.target.value })}
                className={styles.formInput}
                placeholder="e.g. Bengaluru / Hyderabad / Remote"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Eligible Departments *</label>
              <input
                type="text"
                required
                value={driveForm.eligible_departments}
                onChange={(e) => setDriveForm({ ...driveForm, eligible_departments: e.target.value })}
                className={styles.formInput}
                placeholder="CSE, IT, ECE or All"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Minimum CGPA Required</label>
              <input
                type="text"
                value={driveForm.required_cgpa}
                onChange={(e) => setDriveForm({ ...driveForm, required_cgpa: e.target.value })}
                className={styles.formInput}
                placeholder="e.g. 7.5"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Max Allowed Backlogs</label>
              <input
                type="number"
                min="0"
                value={driveForm.allowed_backlogs}
                onChange={(e) => setDriveForm({ ...driveForm, allowed_backlogs: parseInt(e.target.value) || 0 })}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Application Deadline *</label>
              <input
                type="date"
                required
                value={driveForm.application_deadline}
                onChange={(e) => setDriveForm({ ...driveForm, application_deadline: e.target.value })}
                className={styles.formInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Drive / Interview Date *</label>
            <input
              type="date"
              required
              value={driveForm.drive_date}
              onChange={(e) => setDriveForm({ ...driveForm, drive_date: e.target.value })}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Job Description & Requirements</label>
            <textarea
              rows="3"
              value={driveForm.job_description}
              onChange={(e) => setDriveForm({ ...driveForm, job_description: e.target.value })}
              className={styles.formInput}
              placeholder="Outline roles, key technical skillsets, and requirements..."
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => setIsDriveModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className={styles.submitBtn}>
              Publish Drive
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Recruiter;

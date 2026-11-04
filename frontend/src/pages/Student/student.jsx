import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Logo.png";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import SearchBar from "../../components/common/SearchBar";

import {
  getStudentProfile,
  updateStudentProfile,
  changeStudentPassword,
  getStudentDashboardStats,
  getStudentDrives,
  applyForDrive,
  getStudentApplications
} from "../../services/studentService";

import {
  FaChartBar,
  FaBriefcase,
  FaFileAlt,
  FaUser,
  FaSignOutAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaGraduationCap,
  FaAward,
  FaExternalLinkAlt,
  FaLock,
  FaBuilding,
  FaCheck,
  FaClock,
  FaEnvelope,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaPlus,
  FaTimes,
  FaTrophy,
  FaShieldAlt,
  FaArrowRight
} from "react-icons/fa";

import styles from "./Student.module.css";

function Student() {
  const navigate = useNavigate();
  // Get roll number from localStorage or fallback to demo student
  const rollNumber = localStorage.getItem("studentRoll") || "23331A05D3";
  const [student, setStudent] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // overview, drives, applications, profile
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState(null);

  // Drives
  const [drives, setDrives] = useState([]);
  const [driveSearch, setDriveSearch] = useState("");
  const [eligibilityFilter, setEligibilityFilter] = useState("all"); // all, eligible

  // Applications
  const [applications, setApplications] = useState([]);
  const [appFilter, setAppFilter] = useState("all"); // all, selected, shortlisted, applied

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    student_name: "",
    email_id: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    department: "",
    year: "",
    cgpa: "",
    backlogs: 0,
    skills: "",
    resume: "",
    linkedin_link: "",
    github_profile: "",
    sgpa_sem1: "",
    sgpa_sem2: "",
    sgpa_sem3: "",
    sgpa_sem4: "",
    sgpa_sem5: "",
    sgpa_sem6: "",
    sgpa_sem7: "",
    sgpa_sem8: ""
  });

  const [newSkillInput, setNewSkillInput] = useState("");
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, statsData, drivesData, applicationsData] = await Promise.all([
        getStudentProfile(rollNumber),
        getStudentDashboardStats(rollNumber),
        getStudentDrives(rollNumber),
        getStudentApplications(rollNumber)
      ]);

      setStudent(profileData);
      setProfileForm({
        student_name: profileData.student_name || "",
        email_id: profileData.email_id || "",
        phone: profileData.phone || "",
        gender: profileData.gender || "Male",
        dob: profileData.dob || "",
        address: profileData.address || "",
        department: profileData.department || "",
        year: profileData.year || "",
        cgpa: profileData.cgpa || "",
        backlogs: profileData.backlogs ?? 0,
        skills: profileData.skills || "React, Node.js, Python, SQL, Docker, AWS",
        resume: profileData.resume || "https://drive.google.com/file/d/vamsi_resume/view",
        linkedin_link: profileData.linkedin_link || "https://linkedin.com/in/vamsi-krishna",
        github_profile: profileData.github_profile || "https://github.com/vamsikrishna",
        sgpa_sem1: profileData.sgpa_sem1 || "8.9",
        sgpa_sem2: profileData.sgpa_sem2 || "9.0",
        sgpa_sem3: profileData.sgpa_sem3 || "9.1",
        sgpa_sem4: profileData.sgpa_sem4 || "9.3",
        sgpa_sem5: profileData.sgpa_sem5 || "9.2",
        sgpa_sem6: profileData.sgpa_sem6 || "9.4",
        sgpa_sem7: profileData.sgpa_sem7 || "9.3",
        sgpa_sem8: profileData.sgpa_sem8 || "9.5"
      });

      setStats(statsData);
      setDrives(drivesData);
      setApplications(applicationsData);
    } catch (err) {
      console.error("Student portal load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [rollNumber]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 1-Click Apply
  const handleApply = async (driveId, companyName, jobTitle) => {
    if (window.confirm(`Submit your official campus placement application for ${jobTitle} at ${companyName}?`)) {
      try {
        await applyForDrive(rollNumber, driveId);
        alert(`Application successfully submitted to ${companyName}! Track your status in 'My Applications'.`);
        loadData();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.detail || "Application failed. Please verify your eligibility criteria.");
      }
    }
  };

  // Profile Save
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStudentProfile(rollNumber, profileForm);
      setSaveSuccessMsg("Academic credentials and career portfolio saved successfully!");
      setTimeout(() => setSaveSuccessMsg(""), 4000);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Failed to save changes. Please check input values.");
    }
  };

  // Add / Remove Skills
  const handleAddSkill = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      e.preventDefault();
      if (!newSkillInput.trim()) return;
      const currentList = profileForm.skills ? profileForm.skills.split(",").map(s => s.trim()).filter(Boolean) : [];
      if (!currentList.includes(newSkillInput.trim())) {
        currentList.push(newSkillInput.trim());
        setProfileForm({ ...profileForm, skills: currentList.join(", ") });
      }
      setNewSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const currentList = profileForm.skills ? profileForm.skills.split(",").map(s => s.trim()).filter(Boolean) : [];
    const updated = currentList.filter(s => s !== skillToRemove);
    setProfileForm({ ...profileForm, skills: updated.join(", ") });
  };

  // Password Update
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert("New password and confirm password do not match.");
      return;
    }
    try {
      await changeStudentPassword(rollNumber, passwordForm.old_password, passwordForm.new_password);
      setPasswordForm({ old_password: "", new_password: "", confirm_password: "" });
      alert("Portal password updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to update password.");
    }
  };

  if (loading) return <Loader message="Accessing Student Workspace..." />;

  const isPlaced = (student?.placement_status === "Placed" || (student?.offer_count || 0) > 0);

  // Drives Filtering
  const filteredDrives = drives.filter((d) => {
    const term = driveSearch.toLowerCase();
    const matchesSearch =
      (d.company_name || "").toLowerCase().includes(term) ||
      (d.job_title || "").toLowerCase().includes(term) ||
      (d.location || "").toLowerCase().includes(term);

    const matchesEligibility = eligibilityFilter === "all" || (eligibilityFilter === "eligible" && d.is_eligible);
    return matchesSearch && matchesEligibility;
  });

  // Applications Filtering
  const filteredApps = applications.filter((app) => {
    const status = app.current_status || "Applied";
    if (appFilter === "selected") return status === "Selected" || status === "Offer Released";
    if (appFilter === "shortlisted") return status === "Shortlisted" || status === "Interviewed";
    if (appFilter === "applied") return status === "Applied";
    return true;
  });

  // Skills Array
  const skillsArray = profileForm.skills ? profileForm.skills.split(",").map(s => s.trim()).filter(Boolean) : [];

  return (
    <div className={styles.container}>
      {/* ======================================================== */}
      {/* HEADER */}
      {/* ======================================================== */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <Link to="/" style={{ display: "flex", alignItems: "center" }}>
              <img src={logo} className={styles.logo} alt="ABC Career Connect" />
            </Link>
            <div className={styles.brandCopy}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <h1>ABC Career Connect</h1>
                <span className={styles.portalBadge}>Student</span>
              </div>
              <p>Campus Recruitment & Internship Suite</p>
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
              <span>Campus Drives</span>
              <span className={styles.navBadge}>{drives.length}</span>
            </button>

            <button
              className={`${styles.navButton} ${activeTab === "applications" ? styles.navButtonActive : ""}`}
              onClick={() => setActiveTab("applications")}
            >
              <FaFileAlt />
              <span>My Applications</span>
              <span className={styles.navBadge}>{applications.length}</span>
            </button>

            <button
              className={`${styles.navButton} ${activeTab === "profile" ? styles.navButtonActive : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <FaUser />
              <span>My Profile</span>
            </button>
          </nav>

          {/* Right Section */}
          <div className={styles.headerRight}>
            <div className={`${styles.statusChip} ${isPlaced ? styles.statusPlaced : styles.statusEligible}`}>
              <FaAward />
              <span>{isPlaced ? "Placed / Selected" : "Placement Ready"}</span>
            </div>

            <div className={styles.studentAvatar} title={student?.student_name || "Student"}>
              {(student?.student_name || "S").charAt(0).toUpperCase()}
            </div>

            <button className={styles.logoutBtn} onClick={handleLogout} title="Logout">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ======================================================== */}
        {activeTab === "overview" && (
          <div>
            {/* Hero Greeting Banner */}
            <div className={styles.heroGreeting}>
              <div className={styles.greetingLeft}>
                <h2>
                  <span>Welcome back, {student?.student_name}!</span>
                  <span style={{ fontSize: "20px" }}>👋</span>
                </h2>
                <p>
                  Your placement profile is verified. You are eligible for <strong>{stats?.eligible_drives_count ?? 0} active drives</strong>.
                </p>

                <div className={styles.badgeRow}>
                  <div className={styles.infoBadge}>
                    <FaGraduationCap />
                    <span>Roll: {rollNumber}</span>
                  </div>
                  <div className={styles.infoBadge}>
                    <FaBuilding />
                    <span>{student?.department} • Year {student?.year}</span>
                  </div>
                  <div className={styles.cgpaBadge}>
                    <span>★ {student?.cgpa || "9.0"} CGPA</span>
                  </div>
                  <div className={styles.infoBadge} style={{ background: "rgba(59, 130, 246, 0.2)", borderColor: "rgba(59, 130, 246, 0.4)" }}>
                    <FaShieldAlt />
                    <span>0 Active Backlogs</span>
                  </div>
                </div>
              </div>

              <button
                className={styles.greetingCtaBtn}
                onClick={() => setActiveTab("drives")}
              >
                <FaBriefcase />
                <span>Explore Open Drives</span>
                <FaArrowRight size={12} />
              </button>
            </div>

            {/* Performance Stat Cards */}
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}>
                  <FaBriefcase />
                </div>
                <div className={styles.statDetails}>
                  <span className={styles.statLabel}>Active Campus Drives</span>
                  <span className={styles.statValue}>{stats?.active_drives_count ?? 0}</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ backgroundColor: "#ecfdf5", color: "#059669" }}>
                  <FaCheckCircle />
                </div>
                <div className={styles.statDetails}>
                  <span className={styles.statLabel}>Eligible Drives</span>
                  <span className={styles.statValue}>{stats?.eligible_drives_count ?? 0}</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ backgroundColor: "#fef3c7", color: "#d97706" }}>
                  <FaFileAlt />
                </div>
                <div className={styles.statDetails}>
                  <span className={styles.statLabel}>Applications Submitted</span>
                  <span className={styles.statValue}>{stats?.applications_count ?? 0}</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon} style={{ backgroundColor: "#f5f3ff", color: "#7c3aed" }}>
                  <FaTrophy />
                </div>
                <div className={styles.statDetails}>
                  <span className={styles.statLabel}>Offers Released</span>
                  <span className={styles.statValue} style={{ color: "#059669" }}>{stats?.offers_count ?? 0}</span>
                </div>
              </div>
            </div>

            {/* Placed Celebration Banner (If Placed) */}
            {isPlaced && (
              <div
                style={{
                  background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)",
                  border: "1px solid #a7f3d0",
                  borderRadius: "16px",
                  padding: "24px",
                  marginBottom: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "16px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      background: "#059669",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px"
                    }}
                  >
                    <FaTrophy />
                  </div>
                  <div>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "19px", color: "#065f46", fontWeight: 800 }}>
                      Placement Offer Confirmed!
                    </h3>
                    <p style={{ margin: 0, fontSize: "14px", color: "#047857" }}>
                      Congratulations! You have been selected by <strong>TCS Digital</strong> with an annual package of <strong>9.0 LPA</strong>.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("applications")}
                  style={{
                    padding: "10px 20px",
                    background: "#059669",
                    color: "#ffffff",
                    borderRadius: "10px",
                    fontWeight: 700,
                    fontSize: "14px"
                  }}
                >
                  View Offer Details →
                </button>
              </div>
            )}

            {/* Featured Drives Preview */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Featured Recruitment Opportunities
                </h3>
                <button
                  onClick={() => setActiveTab("drives")}
                  style={{ color: "#e11d48", fontWeight: 700, fontSize: "14px", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  View All Drives ({drives.length}) <FaArrowRight size={11} />
                </button>
              </div>

              <div className={styles.drivesGrid}>
                {drives.slice(0, 3).map((d) => (
                  <div key={d.id} className={styles.driveCard}>
                    <div>
                      <div className={styles.driveCardTop}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div className={styles.companyAvatar}>
                            {d.company_name.charAt(0)}
                          </div>
                          <div>
                            <h4 className={styles.companyName}>{d.company_name}</h4>
                            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>{d.role_type}</span>
                          </div>
                        </div>
                        <span className={styles.packageBadge}>{d.ctc_package}</span>
                      </div>

                      <h5 className={styles.jobTitle}>{d.job_title}</h5>

                      <div className={styles.metaList}>
                        <div className={styles.metaRow}>
                          <FaMapMarkerAlt color="#e11d48" size={13} />
                          <span>{d.location}</span>
                        </div>
                        <div className={styles.metaRow}>
                          <FaCalendarAlt color="#64748b" size={13} />
                          <span>Drive Date: {d.drive_date}</span>
                        </div>
                      </div>

                      <div className={`${styles.eligibilityBanner} ${d.is_eligible ? styles.bannerPassed : styles.bannerFailed}`}>
                        {d.is_eligible ? <FaCheckCircle /> : <FaTimesCircle />}
                        <span>{d.eligibility_reason}</span>
                      </div>
                    </div>

                    {d.has_applied ? (
                      <button className={`${styles.applyButton} ${styles.appliedBadgeBtn}`} disabled>
                        <FaCheck /> Application Submitted ({d.application_status})
                      </button>
                    ) : (
                      <button
                        className={styles.applyButton}
                        disabled={!d.is_eligible}
                        onClick={() => handleApply(d.id, d.company_name, d.job_title)}
                      >
                        {d.is_eligible ? "1-Click Apply Now" : "Eligibility Criteria Not Met"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: CAMPUS DRIVES */}
        {/* ======================================================== */}
        {activeTab === "drives" && (
          <div>
            <div className={styles.controlsBar}>
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Active Campus Recruitment Drives
                </h2>
                <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>
                  Filter positions matching your graduation year, department, and CGPA requirements.
                </p>
              </div>

              <div className={styles.filterGroup}>
                <SearchBar
                  value={driveSearch}
                  onChange={(e) => setDriveSearch(e.target.value)}
                  placeholder="Search company, job role, package..."
                />

                <select
                  value={eligibilityFilter}
                  onChange={(e) => setEligibilityFilter(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="all">All Drives ({drives.length})</option>
                  <option value="eligible">Only Jobs I Qualify For ({drives.filter(d => d.is_eligible).length})</option>
                </select>
              </div>
            </div>

            {filteredDrives.length > 0 ? (
              <div className={styles.drivesGrid}>
                {filteredDrives.map((d) => (
                  <div key={d.id} className={styles.driveCard}>
                    <div>
                      <div className={styles.driveCardTop}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div className={styles.companyAvatar}>
                            {d.company_name.charAt(0)}
                          </div>
                          <div>
                            <h4 className={styles.companyName}>{d.company_name}</h4>
                            <span style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>{d.role_type}</span>
                          </div>
                        </div>
                        <span className={styles.packageBadge}>{d.ctc_package}</span>
                      </div>

                      <h5 className={styles.jobTitle}>{d.job_title}</h5>

                      <div className={styles.metaList}>
                        <div className={styles.metaRow}>
                          <FaMapMarkerAlt color="#e11d48" size={13} />
                          <span>{d.location}</span>
                        </div>
                        <div className={styles.metaRow}>
                          <FaCalendarAlt color="#64748b" size={13} />
                          <span>Interview Date: <strong>{d.drive_date}</strong></span>
                        </div>
                        <div className={styles.metaRow}>
                          <FaClock color="#64748b" size={13} />
                          <span>Deadline: {d.application_deadline}</span>
                        </div>
                      </div>

                      {/* Criteria Pills */}
                      <div className={styles.criteriaPillContainer}>
                        <span className={`${styles.criteriaPill} ${parseFloat(student?.cgpa || "0") >= parseFloat(d.required_cgpa || "0") ? styles.criteriaPassed : styles.criteriaFailed}`}>
                          CGPA ≥ {d.required_cgpa}
                        </span>
                        <span className={`${styles.criteriaPill} ${(student?.backlogs || 0) <= d.allowed_backlogs ? styles.criteriaPassed : styles.criteriaFailed}`}>
                          Max Backlogs: {d.allowed_backlogs}
                        </span>
                        <span className={`${styles.criteriaPill} ${d.eligible_departments.includes(student?.department || "") || d.eligible_departments.includes("All") ? styles.criteriaPassed : styles.criteriaFailed}`}>
                          Depts: {d.eligible_departments}
                        </span>
                      </div>

                      {d.job_description && (
                        <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0", lineHeight: 1.5 }}>
                          {d.job_description}
                        </p>
                      )}

                      <div className={`${styles.eligibilityBanner} ${d.is_eligible ? styles.bannerPassed : styles.bannerFailed}`}>
                        {d.is_eligible ? <FaCheckCircle /> : <FaTimesCircle />}
                        <span>{d.eligibility_reason}</span>
                      </div>
                    </div>

                    {d.has_applied ? (
                      <button className={`${styles.applyButton} ${styles.appliedBadgeBtn}`} disabled>
                        <FaCheck /> Application Submitted ({d.application_status})
                      </button>
                    ) : (
                      <button
                        className={styles.applyButton}
                        disabled={!d.is_eligible}
                        onClick={() => handleApply(d.id, d.company_name, d.job_title)}
                      >
                        {d.is_eligible ? "1-Click Apply Now" : "Not Eligible For This Role"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="No recruitment drives found matching your criteria." />
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MY APPLICATIONS (HIGH-IMPACT VISUAL STEPPER) */}
        {/* ======================================================== */}
        {activeTab === "applications" && (
          <div>
            <div className={styles.controlsBar}>
              <div>
                <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
                  Hiring Pipeline & Application Tracker
                </h2>
                <p style={{ margin: "4px 0 0 0", color: "#64748b", fontSize: "14px" }}>
                  Real-time status updates from recruitment partner evaluation panels.
                </p>
              </div>

              {/* Status Filter Pills */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button
                  onClick={() => setAppFilter("all")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: 700,
                    background: appFilter === "all" ? "#0f172a" : "#ffffff",
                    color: appFilter === "all" ? "#ffffff" : "#475569",
                    border: "1px solid #cbd5e1"
                  }}
                >
                  All ({applications.length})
                </button>
                <button
                  onClick={() => setAppFilter("selected")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: 700,
                    background: appFilter === "selected" ? "#059669" : "#ffffff",
                    color: appFilter === "selected" ? "#ffffff" : "#059669",
                    border: "1px solid #a7f3d0"
                  }}
                >
                  Offers Released ({applications.filter(a => a.current_status === "Selected" || a.current_status === "Offer Released").length})
                </button>
                <button
                  onClick={() => setAppFilter("shortlisted")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: 700,
                    background: appFilter === "shortlisted" ? "#2563eb" : "#ffffff",
                    color: appFilter === "shortlisted" ? "#ffffff" : "#2563eb",
                    border: "1px solid #bfdbfe"
                  }}
                >
                  Shortlisted ({applications.filter(a => a.current_status === "Shortlisted" || a.current_status === "Interviewed").length})
                </button>
                <button
                  onClick={() => setAppFilter("applied")}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    fontSize: "13px",
                    fontWeight: 700,
                    background: appFilter === "applied" ? "#d97706" : "#ffffff",
                    color: appFilter === "applied" ? "#ffffff" : "#d97706",
                    border: "1px solid #fde68a"
                  }}
                >
                  Under Review ({applications.filter(a => a.current_status === "Applied").length})
                </button>
              </div>
            </div>

            {filteredApps.length > 0 ? (
              <div className={styles.applicationsList}>
                {filteredApps.map((app) => {
                  const status = app.current_status || "Applied";
                  const isSelected = status === "Selected" || status === "Offer Released";
                  const isInterviewed = status === "Interviewed" || isSelected;
                  const isShortlisted = status === "Shortlisted" || isInterviewed;
                  const isRejected = status === "Rejected";

                  let cardClass = styles.appCardApplied;
                  if (isSelected) cardClass = styles.appCardOffer;
                  else if (isInterviewed) cardClass = styles.appCardInterview;
                  else if (isShortlisted) cardClass = styles.appCardShortlisted;
                  else if (isRejected) cardClass = styles.appCardRejected;

                  // Active line width percentage
                  let activeLineWidth = "15%";
                  if (isSelected) activeLineWidth = "100%";
                  else if (isInterviewed) activeLineWidth = "70%";
                  else if (isShortlisted) activeLineWidth = "40%";

                  return (
                    <div key={app.id} className={`${styles.appCard} ${cardClass}`}>
                      <div className={styles.appHeaderRow}>
                        <div>
                          <div className={styles.appCompanyTitle}>{app.company_name}</div>
                          <div className={styles.appRoleTitle}>{app.job_title}</div>

                          <div className={styles.appMetaLine}>
                            <span>Applied: <strong>{app.applied_date}</strong></span>
                            <span>•</span>
                            <span>Package: <strong style={{ color: "#059669" }}>{app.ctc_package}</strong></span>
                            <span>•</span>
                            <span>Location: <strong>{app.location || "Bengaluru"}</strong></span>
                          </div>
                        </div>

                        <div>
                          {isSelected ? (
                            <span className={`${styles.statusPill} ${styles.statusPillSelected}`}>
                              <FaTrophy /> Offer Released / Selected
                            </span>
                          ) : isRejected ? (
                            <span className={`${styles.statusPill} ${styles.statusPillRejected}`}>
                              <FaTimesCircle /> Not Shortlisted
                            </span>
                          ) : isInterviewed ? (
                            <span className={`${styles.statusPill} ${styles.statusPillInterview}`}>
                              <FaCalendarAlt /> Interview Round Scheduled
                            </span>
                          ) : isShortlisted ? (
                            <span className={`${styles.statusPill} ${styles.statusPillShortlisted}`}>
                              <FaCheckCircle /> Profile Shortlisted
                            </span>
                          ) : (
                            <span className={`${styles.statusPill} ${styles.statusPillApplied}`}>
                              <FaClock /> Under Resume Screening
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Connected Visual Progress Stepper */}
                      <div className={styles.stepperTrack}>
                        <div className={styles.stepperLine}>
                          <div className={styles.stepperLineActive} style={{ width: activeLineWidth }}></div>
                        </div>

                        {/* Step 1: Submitted */}
                        <div className={styles.stepItem}>
                          <div className={`${styles.stepCircle} ${styles.stepCirclePassed}`}>
                            <FaCheck />
                          </div>
                          <span className={styles.stepLabel}>1. Application Submitted</span>
                        </div>

                        {/* Step 2: Shortlisted */}
                        <div className={styles.stepItem}>
                          <div
                            className={`${styles.stepCircle} ${
                              isShortlisted
                                ? styles.stepCirclePassed
                                : status === "Applied"
                                ? styles.stepCircleCurrent
                                : styles.stepCirclePending
                            }`}
                          >
                            {isShortlisted ? <FaCheck /> : 2}
                          </div>
                          <span className={`${styles.stepLabel} ${!isShortlisted && status !== "Applied" ? styles.stepLabelPending : ""}`}>
                            2. Profile Shortlisted
                          </span>
                        </div>

                        {/* Step 3: Interview */}
                        <div className={styles.stepItem}>
                          <div
                            className={`${styles.stepCircle} ${
                              isInterviewed
                                ? styles.stepCirclePassed
                                : isShortlisted && !isInterviewed
                                ? styles.stepCircleCurrent
                                : styles.stepCirclePending
                            }`}
                          >
                            {isInterviewed ? <FaCheck /> : 3}
                          </div>
                          <span className={`${styles.stepLabel} ${!isInterviewed && !isShortlisted ? styles.stepLabelPending : ""}`}>
                            3. Technical & HR Interview
                          </span>
                        </div>

                        {/* Step 4: Offer */}
                        <div className={styles.stepItem}>
                          <div
                            className={`${styles.stepCircle} ${
                              isSelected
                                ? styles.stepCirclePassed
                                : isInterviewed && !isSelected
                                ? styles.stepCircleCurrent
                                : styles.stepCirclePending
                            }`}
                          >
                            {isSelected ? <FaTrophy /> : 4}
                          </div>
                          <span className={`${styles.stepLabel} ${!isSelected ? styles.stepLabelPending : ""}`}>
                            4. Final Selection & Offer
                          </span>
                        </div>
                      </div>

                      {/* Recruiter Callout / Notes */}
                      {isSelected ? (
                        <div className={`${styles.noteBox} ${styles.noteBoxOffer}`}>
                          <FaTrophy size={18} />
                          <div>
                            <strong>Selection Confirmed:</strong> {app.notes || "Offer letter dispatched by Corporate HR. Please verify your college email."}
                          </div>
                        </div>
                      ) : app.notes ? (
                        <div className={styles.noteBox}>
                          <FaClock size={16} color="#64748b" />
                          <div>
                            <strong>Recruiter Update:</strong> {app.notes}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState message="No placement applications match the selected status filter." />
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: MY PROFILE (EXECUTIVE STUDENT PORTFOLIO) */}
        {/* ======================================================== */}
        {activeTab === "profile" && (
          <div>
            {/* Top Profile Summary Card */}
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "20px",
                padding: "24px 28px",
                marginBottom: "28px",
                boxShadow: "0 2px 10px rgba(15, 23, 42, 0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "20px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                <div
                  style={{
                    width: "68px",
                    height: "68px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #e11d48 0%, #9f1239 100%)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "26px",
                    fontWeight: 800,
                    boxShadow: "0 8px 20px rgba(225, 29, 72, 0.3)"
                  }}
                >
                  {(profileForm.student_name || "V").charAt(0).toUpperCase()}
                </div>

                <div>
                  <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0" }}>
                    {profileForm.student_name}
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>ID: {rollNumber}</span>
                    <span>•</span>
                    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 600 }}>{profileForm.department} (4th Year)</span>
                    <span>•</span>
                    <span style={{ fontSize: "13px", color: "#059669", fontWeight: 700 }}>CGPA: {profileForm.cgpa}</span>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#059669" }}>Profile 100% Completed</span>
                  <FaCheckCircle color="#059669" />
                </div>
                <div style={{ width: "220px", height: "8px", background: "#e2e8f0", borderRadius: "10px", overflow: "hidden" }}>
                  <div style={{ width: "100%", height: "100%", background: "#059669" }}></div>
                </div>
              </div>
            </div>

            {saveSuccessMsg && (
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  color: "#166534",
                  padding: "14px 20px",
                  borderRadius: "12px",
                  marginBottom: "24px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontWeight: 600
                }}
              >
                <FaCheckCircle />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit}>
              <div className={styles.profileLayout}>
                {/* Column 1: Academic Credentials */}
                <div className={styles.profileCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardHeaderIcon}>
                      <FaGraduationCap />
                    </div>
                    <div>
                      <h3 className={styles.cardHeaderTitle}>Academic Qualifications</h3>
                      <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Semester grades and degree specifications</p>
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Full Student Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.student_name}
                      onChange={(e) => setProfileForm({ ...profileForm, student_name: e.target.value })}
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>College Roll Number (Permanent ID)</label>
                    <input
                      type="text"
                      disabled
                      value={rollNumber}
                      className={`${styles.formInput} ${styles.formInputDisabled}`}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Department</label>
                      <input
                        type="text"
                        required
                        value={profileForm.department}
                        onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Academic Year</label>
                      <input
                        type="text"
                        required
                        value={profileForm.year}
                        onChange={(e) => setProfileForm({ ...profileForm, year: e.target.value })}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Overall CGPA</label>
                      <input
                        type="text"
                        value={profileForm.cgpa}
                        onChange={(e) => setProfileForm({ ...profileForm, cgpa: e.target.value })}
                        className={styles.formInput}
                        style={{ fontWeight: 700, color: "#059669" }}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Active Backlogs</label>
                    <input
                      type="number"
                      min="0"
                      value={profileForm.backlogs}
                      onChange={(e) => setProfileForm({ ...profileForm, backlogs: parseInt(e.target.value) || 0 })}
                      className={styles.formInput}
                    />
                  </div>

                  {/* SGPA Semester Grid */}
                  <div style={{ marginTop: "20px" }}>
                    <label className={styles.formLabel}>Semester-wise SGPA (Sem 1 to 8)</label>
                    <div className={styles.sgpaGrid}>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <div key={sem} className={styles.semBox}>
                          <div className={styles.semLabel}>Sem {sem}</div>
                          <input
                            type="text"
                            value={profileForm[`sgpa_sem${sem}`] || ""}
                            onChange={(e) => setProfileForm({ ...profileForm, [`sgpa_sem${sem}`]: e.target.value })}
                            className={styles.semInput}
                            placeholder="SGPA"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Column 2: Career Links & Contact Information */}
                <div className={styles.profileCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardHeaderIcon} style={{ background: "#eff6ff", color: "#2563eb" }}>
                      <FaBriefcase />
                    </div>
                    <div>
                      <h3 className={styles.cardHeaderTitle}>Career Assets & Contacts</h3>
                      <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Digital links and technical skill cloud</p>
                    </div>
                  </div>

                  {/* Resume URL with Test Button */}
                  <div className={styles.formGroup}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <label className={styles.formLabel} style={{ margin: 0 }}>Digital Resume URL</label>
                      {profileForm.resume && (
                        <a
                          href={profileForm.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: "12px", color: "#e11d48", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}
                        >
                          Preview File <FaExternalLinkAlt size={10} />
                        </a>
                      )}
                    </div>
                    <input
                      type="url"
                      value={profileForm.resume}
                      onChange={(e) => setProfileForm({ ...profileForm, resume: e.target.value })}
                      className={styles.formInput}
                      placeholder="https://drive.google.com/..."
                    />
                  </div>

                  {/* LinkedIn & GitHub */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>LinkedIn Profile</label>
                      <input
                        type="url"
                        value={profileForm.linkedin_link}
                        onChange={(e) => setProfileForm({ ...profileForm, linkedin_link: e.target.value })}
                        className={styles.formInput}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>GitHub Profile</label>
                      <input
                        type="url"
                        value={profileForm.github_profile}
                        onChange={(e) => setProfileForm({ ...profileForm, github_profile: e.target.value })}
                        className={styles.formInput}
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>

                  {/* Technical Skills Cloud */}
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Technical Skill Tags</label>
                    <div className={styles.skillsContainer}>
                      {skillsArray.map((skill) => (
                        <span key={skill} className={styles.skillPill}>
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className={styles.removeSkillBtn}
                          >
                            <FaTimes size={10} />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: "8px" }}>
                      <input
                        type="text"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={handleAddSkill}
                        className={styles.formInput}
                        placeholder="Type a skill and press Enter..."
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        style={{
                          padding: "0 16px",
                          background: "#0f172a",
                          color: "#ffffff",
                          borderRadius: "10px",
                          fontWeight: 700,
                          fontSize: "13px"
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Email Address</label>
                      <input
                        type="email"
                        value={profileForm.email_id}
                        onChange={(e) => setProfileForm({ ...profileForm, email_id: e.target.value })}
                        className={styles.formInput}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Phone Number</label>
                      <input
                        type="text"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        className={styles.formInput}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Current City / Address</label>
                    <input
                      type="text"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                      className={styles.formInput}
                      placeholder="e.g. Hyderabad, Telangana"
                    />
                  </div>

                  <button type="submit" className={styles.saveProfileBtn}>
                    Save Academic & Portfolio Details
                  </button>
                </div>
              </div>
            </form>

            {/* Change Password Card */}
            <div style={{ maxWidth: "600px", marginTop: "28px" }}>
              <div className={styles.profileCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardHeaderIcon} style={{ background: "#fef3c7", color: "#d97706" }}>
                    <FaLock />
                  </div>
                  <div>
                    <h3 className={styles.cardHeaderTitle}>Update Portal Credentials</h3>
                    <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Maintain secure access to your student account</p>
                  </div>
                </div>

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

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
                      <label className={styles.formLabel}>Confirm Password</label>
                      <input
                        type="password"
                        required
                        value={passwordForm.confirm_password}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                        className={styles.formInput}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      padding: "10px 22px",
                      background: "#0f172a",
                      color: "#ffffff",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "14px"
                    }}
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Student;

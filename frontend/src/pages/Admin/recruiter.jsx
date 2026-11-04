import React, { useState, useEffect } from "react";
import { getCompanies, createCompany, deleteCompany, getCompany } from "../../services/companyService";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Card from "../../components/common/Card";
import Modal from "../../components/common/Modal";
import SearchBar from "../../components/common/SearchBar";
import Filter from "../../components/common/Filter";
import { FaBuilding, FaMapMarkerAlt, FaLink, FaEnvelope, FaUser, FaPlus, FaChevronLeft } from "react-icons/fa";

import styles from "./recruiter.module.css";

function Companies() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Create Company Modal
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    logo: "",
    industry: "",
    recruiter_name: "",
    recruiter_email: "",
    company_website: "",
    location: "",
    current_status: "Active",
    eligible_departments: "",
    required_cgpa: "",
    allowed_backlogs: 0,
    job_description: "",
    password: ""
  });

  const fetchList = async () => {
    try {
      setLoading(true);
      const data = await getCompanies();
      setCompanies(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch companies from backend database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleCompanyClick = async (id) => {
    try {
      setDetailsLoading(true);
      setSelectedCompanyId(id);
      const data = await getCompany(id);
      setSelectedCompany(data);
    } catch (err) {
      console.error(err);
      alert("Failed to retrieve company details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCompany(formData);
      setIsOpen(false);
      setFormData({
        company_name: "",
        logo: "",
        industry: "",
        recruiter_name: "",
        recruiter_email: "",
        company_website: "",
        location: "",
        current_status: "Active",
        eligible_departments: "",
        required_cgpa: "",
        allowed_backlogs: 0,
        job_description: "",
        password: ""
      });
      fetchList();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to register company.");
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      try {
        await deleteCompany(id);
        if (selectedCompanyId === id) {
          setSelectedCompany(null);
          setSelectedCompanyId(null);
        }
        fetchList();
      } catch (err) {
        console.error(err);
        alert("Failed to delete company.");
      }
    }
  };

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      c.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.industry || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.location || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === "all" || c.current_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loader message="Fetching registered companies..." />;
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  // If a company is selected, show details layout instead of table/cards list
  if (selectedCompany) {
    return (
      <div className={styles.container}>
        <button
          onClick={() => {
            setSelectedCompany(null);
            setSelectedCompanyId(null);
          }}
          className={styles.backButton}
        >
          <FaChevronLeft /> Back to Companies List
        </button>

        <div className={styles.detailsGrid}>
          {/* Company Summary Sidebar */}
          <Card>
            <div className={styles.sidebarHeader}>
              {selectedCompany.logo ? (
                <img
                  src={selectedCompany.logo}
                  alt={selectedCompany.company_name}
                  className={styles.logoImage}
                />
              ) : (
                <div className={styles.logoPlaceholder}>
                  {selectedCompany.company_name[0]}
                </div>
              )}
              <h3 className={styles.sidebarTitle}>
                {selectedCompany.company_name}
              </h3>
              <span className={`${styles.badgeLg} ${selectedCompany.current_status === "Active" ? styles.badgeActive : styles.badgeInactive}`}>
                {selectedCompany.current_status}
              </span>
            </div>

            <div className={styles.sidebarSection}>
              <h4 className={styles.sidebarSectionTitle}>Recruiter Details</h4>
              <div className={styles.sidebarDetailsList}>
                <div><strong>Name:</strong> {selectedCompany.recruiter_name || "-"}</div>
                <div><strong>Email:</strong> {selectedCompany.recruiter_email}</div>
                <div><strong>Industry:</strong> {selectedCompany.industry || "-"}</div>
                <div><strong>Location:</strong> {selectedCompany.location || "-"}</div>
                <div>
                  <strong>Website:</strong>{" "}
                  {selectedCompany.company_website ? (
                    <a href={selectedCompany.company_website} target="_blank" rel="noreferrer" className={styles.websiteLinkInline}>
                      Visit Website
                    </a>
                  ) : "-"}
                </div>
              </div>
            </div>

            <div className={styles.deleteContainer}>
              <button
                onClick={() => handleDelete(selectedCompany.id, selectedCompany.company_name)}
                className={styles.deleteButton}
              >
                Delete Company
              </button>
            </div>
          </Card>

          {/* Job Eligibility & JD Details */}
          <div className={styles.mainDetailsContainer}>
            <Card title="Eligibility & Criteria">
              <div className={styles.criteriaGrid}>
                <div>
                  <span className={styles.criteriaLabel}>Eligible Departments</span>
                  <div className={styles.criteriaValue}>
                    {selectedCompany.eligible_departments || "Open to All"}
                  </div>
                </div>
                <div>
                  <span className={styles.criteriaLabel}>Required CGPA</span>
                  <div className={styles.criteriaValue}>
                    {selectedCompany.required_cgpa || "No Bar"}
                  </div>
                </div>
                <div>
                  <span className={styles.criteriaLabel}>Allowed Backlogs</span>
                  <div className={styles.criteriaValue}>
                    {selectedCompany.allowed_backlogs ?? 0} Max
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Job Description">
              <p className={styles.jobDescription}>
                {selectedCompany.job_description || "No job description details provided."}
              </p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header controls */}
      <div className={styles.headerContainer}>
        <div>
          <h2 className={styles.title}>Registered Companies</h2>
          <p className={styles.subtitle}>Manage recruiter companies and criteria.</p>
        </div>

        <div className={styles.controlsContainer}>
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search company name, industry, location..." />
          <Filter
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: "All Statuses", value: "all" },
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" }
            ]}
          />
          <button
            onClick={() => setIsOpen(true)}
            className={styles.addButton}
          >
            <FaPlus /> Add Company
          </button>
        </div>
      </div>

      {/* Grid of Company Cards */}
      {filteredCompanies.length > 0 ? (
        <div className={styles.gridContainer}>
          {filteredCompanies.map((c) => (
            <Card key={c.id} onClick={() => handleCompanyClick(c.id)}>
              <div className={styles.cardHeader}>
                <div className={styles.avatar}>
                  {c.company_name[0]}
                </div>
                <div className={styles.cardInfo}>
                  <h4 className={styles.companyName}>
                    {c.company_name}
                  </h4>
                  <div className={styles.industry}>{c.industry || "General Industry"}</div>
                  <div className={styles.location}>
                    <FaMapMarkerAlt /> {c.location || "On-site"}
                  </div>
                </div>
              </div>

              <div className={styles.cardDivider}>
                <div className={styles.recruiterInfo}>
                  <FaUser style={{ color: "#9ca3af" }} /> <span>{c.recruiter_name || "HR Manager"}</span>
                </div>
                <div className={styles.recruiterEmail}>
                  <FaEnvelope /> <span>{c.recruiter_email}</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <span className={`${styles.badge} ${c.current_status === "Active" ? styles.badgeActive : styles.badgeInactive}`}>
                  {c.current_status}
                </span>

                {c.company_website && (
                  <a
                    href={c.company_website}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.websiteLink}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FaLink size={10} /> Website
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState message="No companies registered." />
      )}

      {/* Register Company Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Register New Company">
        <form onSubmit={handleCreateSubmit} className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Company Name *</label>
            <input
              type="text"
              required
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={styles.formInput}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Recruiter Name</label>
              <input
                type="text"
                value={formData.recruiter_name}
                onChange={(e) => setFormData({ ...formData, recruiter_name: e.target.value })}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Recruiter Email *</label>
              <input
                type="email"
                required
                value={formData.recruiter_email}
                onChange={(e) => setFormData({ ...formData, recruiter_email: e.target.value })}
                className={styles.formInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Recruiter Password *</label>
            <input
              type="password"
              required
              placeholder="Enter password for recruiter portal login"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={styles.formInput}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Company Website</label>
              <input
                type="text"
                placeholder="https://"
                value={formData.company_website}
                onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                className={styles.formInput}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Status</label>
              <select
                value={formData.current_status}
                onChange={(e) => setFormData({ ...formData, current_status: e.target.value })}
                className={styles.formInput}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className={styles.formSection}>
            <h5 className={styles.formSectionTitle}>Job Criteria Details</h5>
            <div className={styles.formRow3}>
              <div className={styles.formGroup}>
                <label className={styles.criteriaLabel}>Eligible Depts</label>
                <input
                  type="text"
                  placeholder="CSE, ECE"
                  value={formData.eligible_departments}
                  onChange={(e) => setFormData({ ...formData, eligible_departments: e.target.value })}
                  className={styles.formInputSm}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.criteriaLabel}>Min CGPA</label>
                <input
                  type="text"
                  placeholder="7.5"
                  value={formData.required_cgpa}
                  onChange={(e) => setFormData({ ...formData, required_cgpa: e.target.value })}
                  className={styles.formInputSm}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.criteriaLabel}>Max Backlogs</label>
                <input
                  type="number"
                  value={formData.allowed_backlogs}
                  onChange={(e) => setFormData({ ...formData, allowed_backlogs: parseInt(e.target.value) || 0 })}
                  className={styles.formInputSm}
                />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Job Description</label>
            <textarea
              rows="3"
              value={formData.job_description}
              onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
              className={styles.formInput}
            />
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
              Add Company
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Companies;
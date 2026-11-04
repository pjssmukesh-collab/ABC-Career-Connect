import React, { useState, useEffect } from "react";
import {
  getStudentsByDept,
  getStudentsByYear,
  getPlacementPercentage,
  getCompanyWiseHiring,
  getApplicationsPerCompany
} from "../../services/reportService";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Card from "../../components/common/Card";
import Table from "../../components/common/Table";

import styles from "./reports.module.css";

function Reports() {
  const [deptData, setDeptData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [placedStats, setPlacedStats] = useState(null);
  const [companyHiring, setCompanyHiring] = useState([]);
  const [applicationsCount, setApplicationsCount] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const [dept, year, placement, hiring, apps] = await Promise.all([
          getStudentsByDept(),
          getStudentsByYear(),
          getPlacementPercentage(),
          getCompanyWiseHiring(),
          getApplicationsPerCompany()
        ]);
        setDeptData(dept);
        setYearData(year);
        setPlacedStats(placement);
        setCompanyHiring(hiring);
        setApplicationsCount(apps);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Could not generate report summaries from the database.");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <Loader message="Compiling reports stats..." />;
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  // Check if everything is completely empty (no data at all)
  const isDatabaseEmpty =
    deptData.length === 0 &&
    yearData.length === 0 &&
    companyHiring.length === 0 &&
    applicationsCount.length === 0;

  if (isDatabaseEmpty) {
    return (
      <div className={styles.container}>
        <h2 className={styles.titleEmpty}>Report Generation</h2>
        <EmptyState message="No data available to compile reports." />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Title */}
      <div className={styles.headerContainer}>
        <h2 className={styles.title}>Recruitment & Demographics Reports</h2>
        <p className={styles.subtitle}>Data-backed stats aggregated directly from SQLite database.</p>
      </div>

      {/* Highlights Banner Card */}
      {placedStats && (
        <Card className={styles.highlightsCard}>
          <h4 className={styles.highlightsTitle}>Overall Placement Rate</h4>
          <div className={styles.highlightsStats}>
            <span className={styles.highlightsPercentage}>
              {placedStats.placed_percentage}%
            </span>
            <div className={styles.highlightsDetails}>
              <div><strong>Total Students registered:</strong> {placedStats.total_students}</div>
              <div><strong>Placed / Selected Count:</strong> {placedStats.placed_count}</div>
            </div>
          </div>
        </Card>
      )}

      {/* Grid of Report Tables */}
      <div className={styles.gridContainer}>
        {/* Department-wise Student Count */}
        <Card title="Students count by Department">
          {deptData.length > 0 ? (
            <Table
              headers={["Department", "Student Count"]}
              data={deptData}
              renderRow={(row) => (
                <>
                  <td className={styles.tableCellBold}>{row.department}</td>
                  <td className={styles.tableCell}>{row.count} students</td>
                </>
              )}
            />
          ) : (
            <EmptyState message="No students found." />
          )}
        </Card>

        {/* Academic Year Demographics */}
        <Card title="Students count by Academic Year">
          {yearData.length > 0 ? (
            <Table
              headers={["Year", "Student Count"]}
              data={yearData}
              renderRow={(row) => (
                <>
                  <td className={styles.tableCellBold}>{row.year} Year</td>
                  <td className={styles.tableCell}>{row.count} students</td>
                </>
              )}
            />
          ) : (
            <EmptyState message="No students found." />
          )}
        </Card>

        {/* Company-wise hiring selection rate */}
        <Card title="Hires Count per Corporate Partner">
          {companyHiring.length > 0 ? (
            <Table
              headers={["Corporate Company Name", "Hired Count"]}
              data={companyHiring}
              renderRow={(row) => (
                <>
                  <td className={styles.tableCellBold}>{row.company_name}</td>
                  <td className={styles.tableCellGreen}>{row.placed_count} selected</td>
                </>
              )}
            />
          ) : (
            <EmptyState message="No student selections logged." />
          )}
        </Card>

        {/* Company-wise application counters */}
        <Card title="Applications counters by Company">
          {applicationsCount.length > 0 ? (
            <Table
              headers={["Corporate Company Name", "Applications Received"]}
              data={applicationsCount}
              renderRow={(row) => (
                <>
                  <td className={styles.tableCellBold}>{row.company_name}</td>
                  <td className={styles.tableCellBlue}>{row.applications_count} applied</td>
                </>
              )}
            />
          ) : (
            <EmptyState message="No job applications submitted." />
          )}
        </Card>
      </div>
    </div>
  );
}

export default Reports;

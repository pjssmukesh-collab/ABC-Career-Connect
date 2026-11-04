import React, { useState, useEffect } from "react";
import styles from "./dashboard.module.css";
import { getDashboardStats, getRecentActivity } from "../../services/dashboardService";
import Card from "../../components/common/Card";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Table from "../../components/common/Table";
import { FaUsers, FaBuilding, FaUserTie, FaBriefcase, FaRunning, FaFileAlt } from "react-icons/fa";

const Sparkline = ({ color, data }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 200;
  const height = 35;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 10) - 5; 
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block', overflow: 'visible' }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        points={points}
      />
      {data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 10) - 5;
        return <circle key={i} cx={x} cy={y} r="2.5" fill={color} />;
      })}
    </svg>
  );
};

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const statsData = await getDashboardStats();
        const activityData = await getRecentActivity();
        setStats(statsData);
        setActivity(activityData);
        setError(null);
      } catch (err) {
        console.error("Dashboard fetching error:", err);
        setError("Failed to load dashboard metrics. Verify database connectivity.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader message="Fetching overview statistics..." />;
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  const statCards = [
    { 
      label: "TOTAL STUDENTS", 
      value: stats?.total_students, 
      icon: <FaUsers size={24} color="#ef4444" />, 
      color: "#ef4444",
      valueColor: "#ef4444",
      trend: "↑ 12.5% this week",
      sparklineData: [10, 15, 12, 20, 15, 25, 20, 30]
    },
    { 
      label: "TOTAL COMPANIES", 
      value: stats?.total_companies, 
      icon: <FaBuilding size={24} color="#a855f7" />, 
      color: "#a855f7",
      valueColor: "#111827",
      trend: "↑ 8.2% this week",
      sparklineData: [5, 8, 12, 10, 15, 12, 18, 22]
    },
    { 
      label: "TOTAL JOB DRIVES", 
      value: stats?.total_job_drives, 
      icon: <FaBriefcase size={24} color="#3b82f6" />, 
      color: "#3b82f6",
      valueColor: "#111827",
      trend: "↑ 5.6% this week",
      sparklineData: [15, 12, 18, 14, 20, 18, 24, 28]
    },
    { 
      label: "TOTAL APPLICATIONS", 
      value: stats?.total_applications, 
      icon: <FaFileAlt size={24} color="#22c55e" />, 
      color: "#22c55e",
      valueColor: "#111827",
      trend: "↑ 28.4% this week",
      sparklineData: [20, 25, 22, 30, 28, 35, 32, 40]
    },
    { 
      label: "ACTIVE JOB DRIVES", 
      value: stats?.active_job_drives, 
      icon: <FaRunning size={24} color="#f97316" />, 
      color: "#f97316",
      valueColor: "#111827",
      trend: "↑ 15.3% this week",
      sparklineData: [8, 12, 10, 15, 12, 18, 16, 20]
    },
    { 
      label: "ACTIVE RECRUITERS", 
      value: stats?.total_recruiters, 
      icon: <FaUserTie size={24} color="#06b6d4" />, 
      color: "#06b6d4",
      valueColor: "#111827",
      trend: "↑ 9.1% this week",
      sparklineData: [12, 15, 18, 16, 22, 20, 25, 28]
    }
  ];

  const hasRecentStudents = activity?.recent_students && activity.recent_students.length > 0;
  const hasRecentCompanies = activity?.recent_companies && activity.recent_companies.length > 0;
  const hasRecentDrives = activity?.recent_drives && activity.recent_drives.length > 0;
  const hasRecentApplications = activity?.recent_applications && activity.recent_applications.length > 0;

  return (
    <div className={styles.container}>
      {/* Title */}
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>Dashboard Overview</h2>
        <p className={styles.subtitle}>Real-time statistics of placement activities.</p>
      </div>

      <div className={styles.statsGrid}>
        {statCards.map((c, i) => {
          const isHovered = hoveredCard === i;
          return (
            <div 
              key={i}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              className={styles.statCard}
            >
               {/* Icon Circle */}
               <div 
                 className={styles.iconCircle}
                 style={{ backgroundColor: `${c.color}15` }}
               >
                 {React.cloneElement(c.icon, { size: 20 })}
               </div>
               
               {/* Text Container */}
               <div className={styles.textContainer}>
                 <span className={styles.statLabel}>{c.label}</span>
                 <span 
                   className={styles.statValue}
                   style={{ color: c.valueColor || '#1e293b' }}
                 >
                   {c.value ?? 0}
                 </span>
               </div>
            </div>
          );
        })}
      </div>

      {/* Recent Lists Grid */}
      <div className={styles.recentGrid}>
        {/* Recently Added Students */}
        <Card title="Recently Added Students">
          {hasRecentStudents ? (
            <Table
              headers={["Name", "Roll No", "Dept", "Year", "CGPA"]}
              data={activity.recent_students}
              renderRow={(student) => (
                <>
                  <td className={styles.tableCellBold}>{student.student_name}</td>
                  <td className={styles.tableCell}>{student.roll_number}</td>
                  <td className={styles.tableCell}>{student.department}</td>
                  <td className={styles.tableCell}>{student.year}</td>
                  <td className={styles.tableCellStrong}>{student.cgpa || "-"}</td>
                </>
              )}
            />
          ) : (
            <EmptyState message="No students found." />
          )}
        </Card>

        {/* Recently Registered Companies */}
        <Card title="Recently Registered Companies">
          {hasRecentCompanies ? (
            <Table
              headers={["Company Name", "Industry", "Location", "Recruiter", "Status"]}
              data={activity.recent_companies}
              renderRow={(c) => (
                <>
                  <td className={styles.tableCellBold}>{c.company_name}</td>
                  <td className={styles.tableCell}>{c.industry || "-"}</td>
                  <td className={styles.tableCell}>{c.location || "-"}</td>
                  <td className={styles.tableCell}>{c.recruiter_name || "-"}</td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${c.current_status === "Active" ? styles.statusActive : styles.statusInactive}`}>
                      {c.current_status}
                    </span>
                  </td>
                </>
              )}
            />
          ) : (
            <EmptyState message="No companies registered." />
          )}
        </Card>

        {/* Upcoming Job Drives */}
        <Card title="Recently Created Drives">
          {hasRecentDrives ? (
            <Table
              headers={["Company", "Drive Date", "Deadline", "Required CGPA", "Status"]}
              data={activity.recent_drives}
              renderRow={(drive) => (
                <>
                  <td className={styles.tableCellBold}>{drive.company_name}</td>
                  <td className={styles.tableCell}>{drive.drive_date}</td>
                  <td className={styles.tableCell}>{drive.registration_deadline}</td>
                  <td className={styles.tableCellStrong}>{drive.minimum_cgpa || "-"}</td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${drive.drive_status === "Active" ? styles.statusActive : styles.statusRejected}`}>
                      {drive.drive_status}
                    </span>
                  </td>
                </>
              )}
            />
          ) : (
            <EmptyState message="No job drives available." />
          )}
        </Card>

        {/* Recent Applications */}
        <Card title="Recent Applications">
          {hasRecentApplications ? (
            <Table
              headers={["Student", "Company", "Applied Date", "Current Status"]}
              data={activity.recent_applications}
              renderRow={(app) => (
                <>
                  <td className={styles.tableCellBold}>{app.student_name}</td>
                  <td className={styles.tableCell}>{app.company_name}</td>
                  <td className={styles.tableCell}>{app.applied_date}</td>
                  <td className={styles.tableCell}>
                    <span className={`${styles.statusBadge} ${app.current_status === "Selected" || app.current_status === "Offer Released" ? styles.statusActive : app.current_status === "Rejected" ? styles.statusRejected : styles.statusPending}`}>
                      {app.current_status}
                    </span>
                  </td>
                </>
              )}
            />
          ) : (
            <EmptyState message="No applications found." />
          )}
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
import React, { useState, useEffect } from "react";
import { getNotifications } from "../../services/notificationService";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Card from "../../components/common/Card";
import { FaBell, FaUserPlus, FaBuilding, FaCalendarPlus, FaFileUpload } from "react-icons/fa";

import styles from "./notifications.module.css";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        setLoading(true);
        const data = await getNotifications();
        setNotifications(data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load notifications from database feed.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifs();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "student_added":
        return <FaUserPlus color="#C62828" size={16} />;
      case "company_registered":
        return <FaBuilding color="#1d4ed8" size={16} />;
      case "drive_created":
        return <FaCalendarPlus color="#047857" size={16} />;
      case "application_submitted":
        return <FaFileUpload color="#ea580c" size={16} />;
      default:
        return <FaBell color="#4b5563" size={16} />;
    }
  };

  if (loading) return <Loader message="Fetching notifications feed..." />;
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Title */}
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>System Notifications</h2>
        <p className={styles.subtitle}>Feed of placement activities and actions logged in database.</p>
      </div>

      {/* Message List */}
      <Card>
        {notifications.length > 0 ? (
          <div className={styles.listContainer}>
            {notifications.map((n) => (
              <div
                key={n.id}
                className={styles.notificationItem}
              >
                <div className={styles.iconWrapper}>
                  {getIcon(n.type)}
                </div>
                <div className={styles.textContainer}>
                  <p className={styles.messageText}>{n.message}</p>
                  <span className={styles.timestamp}>
                    {n.created_at}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No notifications available." />
        )}
      </Card>
    </div>
  );
}

export default Notifications;

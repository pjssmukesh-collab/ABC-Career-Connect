import React, { useState, useEffect } from "react";
import { getAdminProfile, updateAdminProfile, changeAdminPassword } from "../../services/adminService";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import { FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";

import styles from "./profile.module.css";

function Profile() {
  // We assume logged in admin's email is stored in localStorage after login
  // Fallback to mukesh@gmail.com for testing if not set
  const [emailId, setEmailId] = useState(localStorage.getItem("adminEmail") || "mukesh@gmail.com");
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    email_id: ""
  });

  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getAdminProfile(emailId);
      setAdmin(data);
      setProfileForm({
        name: data.name || "Admin",
        phone: data.phone || "9999999999",
        email_id: data.email_id
      });
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch admin profile details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [emailId]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = await updateAdminProfile(emailId, profileForm.name, profileForm.phone, profileForm.email_id);
      localStorage.setItem("adminEmail", updated.email_id);
      setEmailId(updated.email_id);
      alert("Admin profile details updated successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to update profile details.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert("New password and confirm password do not match.");
      return;
    }
    try {
      await changeAdminPassword(emailId, passwordForm.old_password, passwordForm.new_password);
      setPasswordForm({
        old_password: "",
        new_password: "",
        confirm_password: ""
      });
      alert("Password changed successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Failed to change password. Double check old password.");
    }
  };

  if (loading) return <Loader message="Accessing admin user profile..." />;
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
        <h2 className={styles.title}>Admin Profile Settings</h2>
        <p className={styles.subtitle}>Modify admin details and secure credentials.</p>
      </div>

      <div className={styles.gridContainer}>
        {/* Profile Card */}
        <Card title="Update Profile Details">
          <form onSubmit={handleProfileSubmit} className={styles.form}>
            <div>
              <label className={styles.label}>Full Name</label>
              <div className={styles.inputWrapper}>
                <FaUser className={styles.inputIcon} />
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className={styles.inputField}
                />
              </div>
            </div>

            <div>
              <label className={styles.label}>Email ID (Login ID)</label>
              <div className={styles.inputWrapper}>
                <FaEnvelope className={styles.inputIcon} />
                <input
                  type="email"
                  required
                  value={profileForm.email_id}
                  onChange={(e) => setProfileForm({ ...profileForm, email_id: e.target.value })}
                  className={styles.inputField}
                />
              </div>
            </div>

            <div>
              <label className={styles.label}>Phone Number</label>
              <div className={styles.inputWrapper}>
                <FaPhone className={styles.inputIcon} />
                <input
                  type="text"
                  required
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className={styles.inputField}
                />
              </div>
            </div>

            <div className={styles.submitContainer}>
              <button
                type="submit"
                className={styles.submitButton}
              >
                Save Details
              </button>
            </div>
          </form>
        </Card>

        {/* Change Password Card */}
        <Card title="Change Password">
          <form onSubmit={handlePasswordSubmit} className={styles.form}>
            <div>
              <label className={styles.label}>Old Password</label>
              <div className={styles.inputWrapper}>
                <FaLock className={styles.inputIcon} />
                <input
                  type="password"
                  required
                  value={passwordForm.old_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                  className={styles.inputField}
                />
              </div>
            </div>

            <div>
              <label className={styles.label}>New Password</label>
              <div className={styles.inputWrapper}>
                <FaLock className={styles.inputIcon} />
                <input
                  type="password"
                  required
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  className={styles.inputField}
                />
              </div>
            </div>

            <div>
              <label className={styles.label}>Confirm New Password</label>
              <div className={styles.inputWrapper}>
                <FaLock className={styles.inputIcon} />
                <input
                  type="password"
                  required
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                  className={styles.inputField}
                />
              </div>
            </div>

            <div className={styles.submitContainer}>
              <button
                type="submit"
                className={styles.submitButton}
              >
                Change Password
              </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default Profile;

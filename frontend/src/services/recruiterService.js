import api from "./api";

// Admin methods for recruiters
export const getRecruiters = async () => {
  const res = await api.get("/admin/recruiters");
  return res.data;
};

export const createRecruiter = async (data) => {
  const res = await api.post("/admin/recruiters", data);
  return res.data;
};

export const deleteRecruiter = async (emailId) => {
  const res = await api.delete(`/admin/recruiters/${emailId}`);
  return res.data;
};

// Recruiter Portal methods
export const getRecruiterProfile = async (emailId) => {
  const res = await api.get(`/recruiter/profile?email_id=${emailId}`);
  return res.data;
};

export const updateRecruiterProfile = async (emailId, data) => {
  const res = await api.put(`/recruiter/profile?email_id=${emailId}`, data);
  return res.data;
};

export const changeRecruiterPassword = async (emailId, oldPassword, newPassword) => {
  const res = await api.put(`/recruiter/change-password?email_id=${emailId}`, {
    old_password: oldPassword,
    new_password: newPassword
  });
  return res.data;
};

export const getRecruiterDashboardStats = async (emailId) => {
  const res = await api.get(`/recruiter/dashboard/stats?email_id=${emailId}`);
  return res.data;
};

export const getRecruiterDrives = async (emailId) => {
  const res = await api.get(`/recruiter/drives?email_id=${emailId}`);
  return res.data;
};

export const createRecruiterDrive = async (emailId, data) => {
  const res = await api.post(`/recruiter/drives?email_id=${emailId}`, data);
  return res.data;
};

export const updateRecruiterDrive = async (driveId, data) => {
  const res = await api.put(`/recruiter/drives/${driveId}`, data);
  return res.data;
};

export const closeRecruiterDrive = async (driveId) => {
  const res = await api.post(`/recruiter/drives/${driveId}/close`);
  return res.data;
};

export const deleteRecruiterDrive = async (driveId) => {
  const res = await api.delete(`/recruiter/drives/${driveId}`);
  return res.data;
};

export const getRecruiterApplicants = async (emailId, driveId = null) => {
  const url = driveId 
    ? `/recruiter/applicants?email_id=${emailId}&drive_id=${driveId}`
    : `/recruiter/applicants?email_id=${emailId}`;
  const res = await api.get(url);
  return res.data;
};

export const updateCandidateStatus = async (applicationId, currentStatus, notes = "") => {
  const res = await api.put(`/recruiter/applicants/${applicationId}/status`, {
    current_status: currentStatus,
    notes
  });
  return res.data;
};

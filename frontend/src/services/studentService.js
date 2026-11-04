import api from "./api";

// Admin methods for students
export const getStudents = async () => {
  const res = await api.get("/admin/students");
  return res.data;
};

export const updateStudent = async (rollNumber, data) => {
  const res = await api.put(`/admin/students/${rollNumber}`, data);
  return res.data;
};

export const deleteStudent = async (rollNumber) => {
  const res = await api.delete(`/admin/students/${rollNumber}`);
  return res.data;
};

export const uploadExcel = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/student/upload-excel", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
};

// Student Portal methods
export const getStudentProfile = async (rollNumber) => {
  const res = await api.get(`/student/profile?roll_number=${rollNumber}`);
  return res.data;
};

export const updateStudentProfile = async (rollNumber, data) => {
  const res = await api.put(`/student/profile?roll_number=${rollNumber}`, data);
  return res.data;
};

export const changeStudentPassword = async (rollNumber, oldPassword, newPassword) => {
  const res = await api.put(`/student/change-password?roll_number=${rollNumber}`, {
    old_password: oldPassword,
    new_password: newPassword
  });
  return res.data;
};

export const getStudentDashboardStats = async (rollNumber) => {
  const res = await api.get(`/student/dashboard/stats?roll_number=${rollNumber}`);
  return res.data;
};

export const getStudentDrives = async (rollNumber) => {
  const res = await api.get(`/student/drives?roll_number=${rollNumber}`);
  return res.data;
};

export const applyForDrive = async (rollNumber, driveId, notes = "") => {
  const res = await api.post("/student/apply", {
    roll_number: rollNumber,
    drive_id: driveId,
    notes
  });
  return res.data;
};

export const getStudentApplications = async (rollNumber) => {
  const res = await api.get(`/student/applications?roll_number=${rollNumber}`);
  return res.data;
};

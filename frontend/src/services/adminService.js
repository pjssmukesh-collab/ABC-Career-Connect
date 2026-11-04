import api from "./api";

export const getAdminProfile = async (emailId) => {
  const res = await api.get(`/admin/profile?email_id=${emailId}`);
  return res.data;
};

export const updateAdminProfile = async (emailId, name, phone, newEmailId) => {
  const res = await api.put(`/admin/profile?email_id=${emailId}`, {
    name,
    phone,
    email_id: newEmailId
  });
  return res.data;
};

export const changeAdminPassword = async (emailId, oldPassword, newPassword) => {
  const res = await api.put(`/admin/change-password?email_id=${emailId}`, {
    old_password: oldPassword,
    new_password: newPassword
  });
  return res.data;
};

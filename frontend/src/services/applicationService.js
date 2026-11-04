import api from "./api";

export const getApplications = async () => {
  const res = await api.get("/admin/applications");
  return res.data;
};

export const createApplication = async (data) => {
  const res = await api.post("/admin/applications", data);
  return res.data;
};

export const updateApplicationStatus = async (appId, status) => {
  const res = await api.put(`/admin/applications/${appId}/status`, { current_status: status });
  return res.data;
};

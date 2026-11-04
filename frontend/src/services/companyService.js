import api from "./api";

export const getCompanies = async () => {
  const res = await api.get("/admin/companies");
  return res.data;
};

export const getCompany = async (id) => {
  const res = await api.get(`/admin/companies/${id}`);
  return res.data;
};

export const createCompany = async (data) => {
  const res = await api.post("/admin/companies", data);
  return res.data;
};

export const updateCompany = async (id, data) => {
  const res = await api.put(`/admin/companies/${id}`, data);
  return res.data;
};

export const deleteCompany = async (id) => {
  const res = await api.delete(`/admin/companies/${id}`);
  return res.data;
};

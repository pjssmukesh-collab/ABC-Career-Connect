import api from "./api";

export const getDrives = async () => {
  const res = await api.get("/admin/drives");
  return res.data;
};

export const getDrive = async (id) => {
  const res = await api.get(`/admin/drives/${id}`);
  return res.data;
};

export const createDrive = async (data) => {
  const res = await api.post("/admin/drives", data);
  return res.data;
};

export const updateDrive = async (id, data) => {
  const res = await api.put(`/admin/drives/${id}`, data);
  return res.data;
};

export const closeDrive = async (id) => {
  const res = await api.post(`/admin/drives/${id}/close`);
  return res.data;
};

export const deleteDrive = async (id) => {
  const res = await api.delete(`/admin/drives/${id}`);
  return res.data;
};

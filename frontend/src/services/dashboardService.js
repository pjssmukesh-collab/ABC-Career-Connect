import api from "./api";

export const getDashboardStats = async () => {
  const res = await api.get("/admin/dashboard/stats");
  return res.data;
};

export const getRecentActivity = async () => {
  const res = await api.get("/admin/dashboard/recent-activity");
  return res.data;
};

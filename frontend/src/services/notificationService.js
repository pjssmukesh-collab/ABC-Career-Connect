import api from "./api";

export const getNotifications = async () => {
  const res = await api.get("/admin/notifications");
  return res.data;
};

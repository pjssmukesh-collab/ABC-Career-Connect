import api from "./api";

export const getStudentsByDept = async () => {
  const res = await api.get("/admin/reports/students-by-department");
  return res.data;
};

export const getStudentsByYear = async () => {
  const res = await api.get("/admin/reports/students-by-year");
  return res.data;
};

export const getPlacementPercentage = async () => {
  const res = await api.get("/admin/reports/placement-percentage");
  return res.data;
};

export const getCompanyWiseHiring = async () => {
  const res = await api.get("/admin/reports/company-wise-hiring");
  return res.data;
};

export const getApplicationsPerCompany = async () => {
  const res = await api.get("/admin/reports/applications-per-company");
  return res.data;
};

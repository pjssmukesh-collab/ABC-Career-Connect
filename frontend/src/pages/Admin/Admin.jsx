import { Outlet } from "react-router-dom";
import Header from "../../components/Admin/header";

function Admin() {
  return (
    <div>
      <Header />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Admin;
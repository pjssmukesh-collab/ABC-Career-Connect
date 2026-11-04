import Header from "../components/Header";
import CompanySlider from "../components/CompanySlider";
import LoginCard from "../components/LoginCard";
import "./Login.css";

import { FaBriefcase, FaChartLine, FaUsers } from "react-icons/fa";

function Login() {

  return (
    <main className="login-page">
      <Header />
      <section className="login-page__hero">
        <div className="login-page__content">
          <p className="login-page__eyebrow">ABC Career Connect</p>
          <h2 className="login-page__headline">
            Build Your Career
            <span>With Top Opportunities</span>
          </h2>
          <p className="login-page__lede">
            ABC Career Connect is your gateway to discover exciting career opportunities and grow with the best.
          </p>

          <div className="login-page__feature-list">
            <div className="login-page__feature">
              <span className="login-page__feature-icon">
                <FaBriefcase />
              </span>
              <div>
                <h3>Top Companies</h3>
                <p>Connect with leading recruiters</p>
              </div>
            </div>

            <div className="login-page__feature">
              <span className="login-page__feature-icon">
                <FaUsers />
              </span>
              <div>
                <h3>Diverse Opportunities</h3>
                <p>Explore roles across domains</p>
              </div>
            </div>

            <div className="login-page__feature">
              <span className="login-page__feature-icon">
                <FaChartLine />
              </span>
              <div>
                <h3>Career Growth</h3>
                <p>Kickstart your future with us</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-page__card-area">
          <LoginCard />
        </div>
      </section>

      <CompanySlider />
    </main>
  );
}

export default Login;
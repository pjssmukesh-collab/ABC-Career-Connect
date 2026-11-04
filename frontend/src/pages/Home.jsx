import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import CompanySlider from "../components/CompanySlider";
import {
  FaUserGraduate,
  FaBuilding,
  FaUserShield,
  FaArrowRight,
  FaCheckCircle,
  FaBolt,
  FaChartLine,
  FaBriefcase,
  FaAward
} from "react-icons/fa";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.homeContainer}>
      <Header />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        {/* Announcement Badge */}
        <div className={styles.announcementBadge}>
          <span className="pulse-dot"></span>
          <span>⚡ CAMPUS HIRING SEASON 2026-27 • ACTIVE PORTAL</span>
        </div>

        {/* Main Headline */}
        <h1 className={styles.headline}>
          Where Top Talent Meets <br />
          <span className={styles.headlineGradient}>World-Class Careers.</span>
        </h1>

        {/* Subtitle */}
        <p className={styles.subheadline}>
          The unified next-generation campus placement platform powering corporate drives,
          algorithmic eligibility validation, and transparent hiring journeys for ambitious engineers.
        </p>

        {/* Dual CTA Actions */}
        <div className={styles.heroActions}>
          <Link to="/login" className={styles.primaryCta}>
            <span>Explore Campus Drives</span>
            <FaArrowRight size={13} />
          </Link>
          <Link to="/login" className={styles.secondaryCta}>
            <FaBuilding size={14} color="#64748b" />
            <span>Corporate Recruiter Suite</span>
          </Link>
        </div>

        {/* Key Metrics Ribbon */}
        <div className={styles.metricsRibbon}>
          <div className={styles.metricCard}>
            <div className={styles.metricValue}>98.4%</div>
            <div className={styles.metricLabel}>Placement Success Rate</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricValue}>₹28.5 LPA</div>
            <div className={styles.metricLabel}>Peak Marquee Package</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricValue}>150+</div>
            <div className={styles.metricLabel}>Corporate Hiring Partners</div>
          </div>

          <div className={styles.metricCard}>
            <div className={styles.metricValue}>1,250+</div>
            <div className={styles.metricLabel}>Verified Job Offers</div>
          </div>
        </div>
      </section>

      {/* Three Dominating Portals Section */}
      <section className={styles.portalsSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Ecosystem Architecture</p>
          <h2 className={styles.sectionTitle}>Built for Every Stakeholder</h2>
        </div>

        <div className={styles.portalsGrid}>
          {/* Card 1: Student Portal */}
          <div className={`${styles.portalCard} ${styles.portalCardRuby}`}>
            <div>
              <div className={styles.portalIconWrapper}>
                <FaUserGraduate />
              </div>
              <span className={styles.portalBadge}>Student Suite</span>
              <h3 className={styles.portalTitle}>For Students</h3>
              <p className={styles.portalDescription}>
                Browse active campus drives, check real-time CGPA and department eligibility, submit applications with 1 click, and track your interview rounds.
              </p>

              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <FaCheckCircle className={styles.featureCheck} />
                  <span>Real-time drive announcements</span>
                </li>
                <li className={styles.featureItem}>
                  <FaCheckCircle className={styles.featureCheck} />
                  <span>Automatic CGPA & backlog check</span>
                </li>
                <li className={styles.featureItem}>
                  <FaCheckCircle className={styles.featureCheck} />
                  <span>4-stage live visual application tracker</span>
                </li>
                <li className={styles.featureItem}>
                  <FaCheckCircle className={styles.featureCheck} />
                  <span>Comprehensive academic resume portfolio</span>
                </li>
              </ul>
            </div>

            <Link to="/login" className={styles.portalBtn}>
              <span>Enter Student Portal</span>
              <FaArrowRight size={12} />
            </Link>
          </div>

          {/* Card 2: Recruiter Portal */}
          <div className={`${styles.portalCard} ${styles.portalCardBlue}`}>
            <div>
              <div className={styles.portalIconWrapper}>
                <FaBuilding />
              </div>
              <span className={styles.portalBadge}>Recruiter Suite</span>
              <h3 className={styles.portalTitle}>For Corporate Recruiters</h3>
              <p className={styles.portalDescription}>
                Publish targeted hiring drives, filter candidates by department and performance, review digital resumes, and release offers seamlessly.
              </p>

              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <FaCheckCircle className={styles.featureCheck} />
                  <span>Custom drive creation with criteria rules</span>
                </li>
                <li className={styles.featureItem}>
                  <FaCheckCircle className={styles.featureCheck} />
                  <span>Direct candidate resume & portfolio access</span>
                </li>
                <li className={styles.featureItem}>
                  <FaCheckCircle className={styles.featureCheck} />
                  <span>One-click status progression & shortlisting</span>
                </li>
                <li className={styles.featureItem}>
                  <FaCheckCircle className={styles.featureCheck} />
                  <span>Direct hiring feedback delivery to students</span>
                </li>
              </ul>
            </div>

            <Link to="/login" className={styles.portalBtn}>
              <span>Access Recruiter Suite</span>
              <FaArrowRight size={12} />
            </Link>
          </div>

          {/* Card 3: Admin Portal */}
          <div className={`${styles.portalCard} ${styles.portalCardPurple}`}>
            <div>
              <div className={styles.portalIconWrapper}>
                <FaUserShield />
              </div>
              <span className={styles.portalBadge}>Admin Console</span>
              <h3 className={styles.portalTitle}>For Placement Cell</h3>
              <p className={styles.portalDescription}>
                Maintain institutional records, oversee campus drives across departments, upload bulk excel batches, and generate demographic hiring reports.
              </p>

              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <FaCheckCircle className={styles.featureCheck} />
                  <span>Master student database with Excel import</span>
                </li>
                <li className={styles.featureItem}>
                  <FaCheckCircle className={styles.featureCheck} />
                  <span>Campus-wide drive coordination & control</span>
                </li>
                <li className={styles.featureItem}>
                  <FaCheckCircle className={styles.featureCheck} />
                  <span>Department & year-wise hiring demographics</span>
                </li>
                <li className={styles.featureItem}>
                  <FaCheckCircle className={styles.featureCheck} />
                  <span>Real-time placement rate analytics feed</span>
                </li>
              </ul>
            </div>

            <Link to="/login" className={styles.portalBtn}>
              <span>Open Admin Console</span>
              <FaArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* Corporate Hiring Partners Marquee */}
      <section className={styles.partnersArea}>
        <p className={styles.partnersEyebrow}>
          Trusted by Fortune 500 Tech Giants & Industry Innovators
        </p>
        <CompanySlider />
      </section>
    </div>
  );
}

export default Home;

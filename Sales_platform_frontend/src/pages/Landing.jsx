
import { Link } from "react-router-dom";

const features = [
  {
    icon: "↗",
    title: "Sales Management",
    text: "Manage orders and sales easily.",
  },
  {
    icon: "▦",
    title: "Product Management",
    text: "Manage products, categories and pricing.",
  },
  {
    icon: "◎",
    title: "Customer Management",
    text: "Keep customer information organized.",
  },
  {
    icon: "◫",
    title: "Inventory Management",
    text: "Monitor stock and inventory levels.",
  },
];

function Landing() {
  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          font-family: Arial, Helvetica, sans-serif;
          background: #ffffff;
          color: #172033;
        }

        a {
          text-decoration: none;
        }

        .landing {
          min-height: 100vh;
          background: #ffffff;
        }

        /* ================= NAVBAR ================= */

        .navbar {
          height: 70px;
          padding: 0 7%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #ffffff;
          border-bottom: 1px solid #eeeeee;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .logo {
          color: #172033;
          font-size: 23px;
          font-weight: 700;
        }

        .navbar nav {
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .navbar nav a {
          color: #5f6878;
          font-size: 14px;
          transition: 0.2s;
        }

        .navbar nav a:hover {
          color: #2563eb;
        }

        .nav-btn {
          background: #2563eb;
          color: white !important;
          padding: 10px 18px;
          border-radius: 6px;
        }

        .nav-btn:hover {
          background: #1d4ed8;
        }

        /* ================= HERO ================= */

        .hero {
          min-height: 600px;
          padding: 80px 7%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 70px;
          align-items: center;
          background: #f8fafc;
        }

        .hero-content {
          max-width: 600px;
        }

        .small-title {
          color: #2563eb;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        .hero h1 {
          margin: 18px 0;
          font-size: 58px;
          line-height: 1.1;
          letter-spacing: -2px;
        }

        .hero h1 span {
          color: #2563eb;
        }

        .hero p {
          max-width: 520px;
          color: #667085;
          font-size: 17px;
          line-height: 1.7;
        }

        .hero-buttons {
          display: flex;
          gap: 12px;
          margin-top: 28px;
        }

        .primary-btn,
        .secondary-btn {
          display: inline-block;
          padding: 12px 22px;
          border-radius: 7px;
          font-size: 14px;
          font-weight: 600;
        }

        .primary-btn {
          background: #2563eb;
          color: white;
        }

        .primary-btn:hover {
          background: #1d4ed8;
        }

        .secondary-btn {
          background: white;
          color: #172033;
          border: 1px solid #d9dee8;
        }

        .secondary-btn:hover {
          border-color: #2563eb;
          color: #2563eb;
        }

        /* ================= DASHBOARD ================= */

        .dashboard {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.07);
        }

        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .dashboard-header small,
        .revenue small,
        .dashboard-cards small {
          display: block;
          color: #8a94a6;
          font-size: 12px;
          margin-bottom: 5px;
        }

        .dashboard-header h3 {
          margin: 0;
          font-size: 20px;
        }

        .status {
          color: #16a34a;
        }

        .revenue {
          margin-top: 30px;
        }

        .revenue h2 {
          margin: 5px 0;
          font-size: 32px;
        }

        .revenue span {
          color: #16a34a;
          font-size: 13px;
        }

        /* Chart */

        .chart {
          height: 170px;
          margin-top: 25px;
          position: relative;
          border-bottom: 1px solid #e5e7eb;

          background:
            repeating-linear-gradient(
              to bottom,
              transparent 0,
              transparent 40px,
              #f1f3f5 41px
            );

          overflow: hidden;
        }

        .chart-line {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .chart-line::after {
          content: "";
          position: absolute;
          left: 0;
          top: 20px;
          width: 100%;
          height: 120px;

          background:
            linear-gradient(
              145deg,
              transparent 25%,
              #2563eb 26%,
              #2563eb 27%,
              transparent 28%,

              transparent 45%,
              #2563eb 46%,
              #2563eb 47%,
              transparent 48%,

              transparent 62%,
              #2563eb 63%,
              #2563eb 64%,
              transparent 65%,

              transparent 78%,
              #2563eb 79%,
              #2563eb 80%,
              transparent 81%
            );
        }

        .dashboard-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 20px;
        }

        .dashboard-cards > div {
          background: #f8fafc;
          padding: 14px;
          border-radius: 7px;
        }

        .dashboard-cards strong {
          font-size: 18px;
        }

        /* ================= COMMON SECTION ================= */

        .section-title {
          max-width: 650px;
          margin: 0 auto 50px;
          text-align: center;
        }

        .section-title span,
        .analytics-text > span {
          color: #2563eb;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1.5px;
        }

        .section-title h2 {
          margin: 14px 0;
          font-size: 38px;
        }

        .section-title p {
          color: #667085;
        }

        /* ================= FEATURES ================= */

        .features {
          padding: 90px 7%;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .feature-card {
          padding: 25px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          transition: 0.2s;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          border-color: #bfdbfe;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
        }

        .feature-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eff6ff;
          color: #2563eb;
          border-radius: 8px;
          font-size: 20px;
        }

        .feature-card h3 {
          margin: 18px 0 10px;
          font-size: 17px;
        }

        .feature-card p {
          margin: 0;
          color: #667085;
          font-size: 14px;
          line-height: 1.6;
        }

        /* ================= ANALYTICS ================= */

        .analytics {
          padding: 90px 7%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 70px;
          align-items: center;
          background: #f8fafc;
        }

        .analytics-text h2 {
          font-size: 40px;
          margin: 15px 0;
        }

        .analytics-text p {
          color: #667085;
          line-height: 1.7;
        }

        .analytics-text ul {
          margin-top: 20px;
          padding-left: 20px;
          color: #475467;
          line-height: 2;
        }

        .analytics-box {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          padding: 30px;
        }

        .analytics-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .analytics-top span {
          color: #667085;
        }

        .analytics-top strong {
          font-size: 22px;
        }

        .simple-bars {
          height: 220px;
          display: flex;
          align-items: flex-end;
          gap: 15px;
          margin-top: 30px;
          border-bottom: 1px solid #e5e7eb;
        }

        .simple-bars i {
          flex: 1;
          background: #2563eb;
          border-radius: 5px 5px 0 0;
        }

        .simple-bars i:nth-child(1) {
          height: 35%;
        }

        .simple-bars i:nth-child(2) {
          height: 50%;
        }

        .simple-bars i:nth-child(3) {
          height: 42%;
        }

        .simple-bars i:nth-child(4) {
          height: 70%;
        }

        .simple-bars i:nth-child(5) {
          height: 58%;
        }

        .simple-bars i:nth-child(6) {
          height: 85%;
        }

        /* ================= HOW IT WORKS ================= */

        .steps {
          padding: 90px 7%;
        }

        .step-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 25px;
        }

        .step {
          padding: 25px;
          border-left: 3px solid #2563eb;
          background: #f8fafc;
        }

        .step b {
          color: #2563eb;
          font-size: 14px;
        }

        .step h3 {
          margin: 15px 0 8px;
        }

        .step p {
          color: #667085;
          line-height: 1.6;
          font-size: 14px;
        }

        /* ================= CTA ================= */

        .cta {
          padding: 80px 20px;
          text-align: center;
          background: #172033;
          color: white;
        }

        .cta h2 {
          margin: 0 0 15px;
          font-size: 38px;
        }

        .cta p {
          color: #c5cad4;
          margin-bottom: 28px;
        }

        /* ================= FOOTER ================= */

        footer {
          padding: 50px 7%;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 40px;
          border-top: 1px solid #eeeeee;
        }

        footer strong {
          font-size: 19px;
        }

        footer p {
          color: #667085;
          font-size: 14px;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-links a {
          color: #667085;
          font-size: 14px;
        }

        .footer-links a:hover {
          color: #2563eb;
        }

        footer > small {
          grid-column: 1 / -1;
          padding-top: 20px;
          border-top: 1px solid #eeeeee;
          color: #98a2b3;
        }

        /* ================= TABLET ================= */

        @media (max-width: 1000px) {

          .hero {
            grid-template-columns: 1fr;
            padding: 70px 5%;
          }

          .feature-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .analytics {
            grid-template-columns: 1fr;
            padding: 70px 5%;
          }

          .features,
          .steps {
            padding: 70px 5%;
          }
        }

        /* ================= MOBILE ================= */

        @media (max-width: 600px) {

          .navbar {
            padding: 0 5%;
          }

          .navbar nav {
            gap: 10px;
          }

          .navbar nav a:not(.nav-btn) {
            display: none;
          }

          .hero {
            padding: 55px 5%;
            gap: 40px;
          }

          .hero h1 {
            font-size: 40px;
            letter-spacing: -1px;
          }

          .hero p {
            font-size: 15px;
          }

          .hero-buttons {
            flex-wrap: wrap;
          }

          .dashboard {
            padding: 18px;
          }

          .dashboard-cards {
            grid-template-columns: 1fr;
          }

          .feature-grid,
          .step-grid {
            grid-template-columns: 1fr;
          }

          .section-title h2 {
            font-size: 32px;
          }

          .analytics-text h2 {
            font-size: 32px;
          }

          .cta h2 {
            font-size: 30px;
          }

          footer {
            grid-template-columns: 1fr;
            padding: 45px 5%;
          }

          footer > small {
            grid-column: auto;
          }
        }
      `}</style>

      <div className="landing">

        {/* NAVBAR */}
        <header className="navbar">

          <Link to="/" className="logo">
            SmartSales
          </Link>

          <nav>
            <a href="#home">Home</a>
            <a href="#features">Features</a>
            <a href="#analytics">Analytics</a>

            <Link to="/login">
              Login
            </Link>

            <Link to="/register" className="nav-btn">
              Get Started
            </Link>
          </nav>

        </header>


        {/* HERO */}
        <section className="hero" id="home">

          <div className="hero-content">

            <span className="small-title">
              SMART SALES PLATFORM
            </span>

            <h1>
              Manage Your Sales.
              <br />
              <span>Understand Your Business.</span>
            </h1>

            <p>
              Manage products, customers, orders and inventory
              from one simple business platform.
            </p>

            <div className="hero-buttons">

              <Link to="/register" className="primary-btn">
                Get Started
              </Link>

              <Link to="/login" className="secondary-btn">
                Login
              </Link>

            </div>

          </div>


          {/* DASHBOARD PREVIEW */}
          <div className="dashboard">

            <div className="dashboard-header">

              <div>
                <small>Business Analytics</small>
                <h3>Sales Overview</h3>
              </div>

              <span className="status">
                ●
              </span>

            </div>


            <div className="revenue">

              <small>Total Revenue</small>

              <h2>
                ₹12.8L
              </h2>

              <span>
                +18.6%
              </span>

            </div>


            <div className="chart">
              <div className="chart-line"></div>
            </div>


            <div className="dashboard-cards">

              <div>
                <small>Orders</small>
                <strong>1,284</strong>
              </div>

              <div>
                <small>Products</small>
                <strong>328</strong>
              </div>

              <div>
                <small>Customers</small>
                <strong>5,420</strong>
              </div>

            </div>

          </div>

        </section>


        {/* FEATURES */}
        <section className="features" id="features">

          <div className="section-title">

            <span>FEATURES</span>

            <h2>
              Everything You Need
            </h2>

            <p>
              Simple tools to manage your complete sales operation.
            </p>

          </div>


          <div className="feature-grid">

            {features.map((feature) => (

              <div
                className="feature-card"
                key={feature.title}
              >

                <div className="feature-icon">
                  {feature.icon}
                </div>

                <h3>
                  {feature.title}
                </h3>

                <p>
                  {feature.text}
                </p>

              </div>

            ))}

          </div>

        </section>


        {/* ANALYTICS */}
        <section className="analytics" id="analytics">

          <div className="analytics-text">

            <span>
              BUSINESS ANALYTICS
            </span>

            <h2>
              Understand Your Business
            </h2>

            <p>
              Track sales, revenue, products and customers
              using simple and clear analytics.
            </p>

            <ul>
              <li>Sales overview</li>
              <li>Top products</li>
              <li>Customer insights</li>
              <li>Inventory monitoring</li>
            </ul>

          </div>


          <div className="analytics-box">

            <div className="analytics-top">

              <span>
                Revenue
              </span>

              <strong>
                ₹8.4L
              </strong>

            </div>


            <div className="simple-bars">

              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>
              <i></i>

            </div>

          </div>

        </section>


        {/* HOW IT WORKS */}
        <section className="steps">

          <div className="section-title">

            <span>
              HOW IT WORKS
            </span>

            <h2>
              Simple. Clear. Powerful.
            </h2>

          </div>


          <div className="step-grid">

            <div className="step">

              <b>01</b>

              <h3>
                Add Products
              </h3>

              <p>
                Add and manage your products easily.
              </p>

            </div>


            <div className="step">

              <b>02</b>

              <h3>
                Manage Sales
              </h3>

              <p>
                Manage customers, orders and payments.
              </p>

            </div>


            <div className="step">

              <b>03</b>

              <h3>
                View Analytics
              </h3>

              <p>
                Understand your business using analytics.
              </p>

            </div>

          </div>

        </section>


        {/* CTA */}
        <section className="cta">

          <h2>
            Ready to manage your business smarter?
          </h2>

          <p>
            Bring sales, customers and analytics together.
          </p>

          <Link to="/register" className="primary-btn">
            Get Started
          </Link>

        </section>


        {/* FOOTER */}
        <footer>

          <div>

            <strong>
              SmartSales
            </strong>

            <p>
              Smart Sales & Business Analytics Platform
            </p>

          </div>


          <div className="footer-links">

            <a href="#home">
              Home
            </a>

            <a href="#features">
              Features
            </a>

            <a href="#analytics">
              Analytics
            </a>

            <Link to="/login">
              Login
            </Link>

          </div>


          <small>
            © 2026 SmartSales. All rights reserved.
          </small>

        </footer>

      </div>
    </>
  );
}

export default Landing;
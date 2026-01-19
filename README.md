# 🇮🇳 AadhaarPulse: Demographic & Biometric Analytics

**AadhaarPulse** is a mission-critical dashboard designed for the **Unique Identification Authority of India (UIDAI)** ecosystem. It provides real-time visibility into Aadhaar enrolments, biometric health scores, and inter-state migration patterns using advanced data visualization and predictive analytics.

---

## 📊 Core Capabilities

### 1. **Demographic Intelligence**

* **Enrolment Trending**: Visualizes the daily influx of new enrolments vs. demographic updates.
* **State-wise Penetration**: Interactive heatmap showing saturation levels across Indian states.
* **Digital Readiness**: Analysis of mobile number seeding vs. email linkage penetration.

### 2. **Biometric Health Monitoring**

* **MBU (Mandatory Biometric Update) Tracking**: Monitors the gap between expected and actual biometric updates for age groups 5-7 and 15-17.
* **Failure Analysis**: Categorizes authentication failures to improved biometric capture standards.

### 3. **AI-Powered Forecasting**

* **Predictive Enrolment**: Uses Linear Regression to forecast enrolment demand for the next 7 days.
* **Resource Planning**: Helps enrollment centers allocate staff based on predicted footfall.

### 4. **Security & Governance**

* **Role-Based Access Control (RBAC)**: Distinct views for Analysts, Managers, and Admins.
* **Audit Logging**: Immutable logs of all user activities (Login, Profile Updates).
* **Admin Console**: Centralized user management and role assignment.

---

## 📐 Mathematical Models

The dashboard employs statistical models to derive insights from raw government data.

### **1. Linear Regression (Forecasting)**

To predict future enrolments ($y$) based on time ($x$), we use the least squares method:

$$ y = mx + c $$

Where:

* **$m$ (Slope)**: The rate of growth/decline.
    $$ m = \frac{n(\sum xy) - (\sum x)(\sum y)}{n(\sum x^2) - (\sum x)^2} $$
* **$c$ (Intercept)**: The baseline value.
    $$ c = \frac{\sum y - m(\sum x)}{n} $$
* **$n$**: Number of historical data points (days).

This algorithm runs in real-time within `ForecastingChart.jsx` to predict the next week's trend.

### **2. Digital Readiness Score (DRS)**

A composite index measuring the digital maturity of a state's user base:

$$ DRS = (w_1 \times M_p) + (w_2 \times E_p) + (w_3 \times B_c) $$

Where:

* $M_p$: Mobile Penetration (%)
* $E_p$: Email Linkage (%)
* $B_c$: Biometric Completeness (%)
* Weights: $w_1=0.5, w_2=0.3, w_3=0.2$

---

## 🛠️ Technology Stack

| Component | Technology | Version | Description |
| :--- | :--- | :--- | :--- |
| **Frontend** | React | v19 | Component-based UI Architecture |
| **Build System** | Vite | v6 | Lightning-fast HMR and bundling |
| **Styling** | Tailwind CSS | v4 | Utility-first CSS engine (Zero runtime) |
| **Visualization** | Recharts | v2.15 | Composable React charting library |
| **Backend** | Node.js & Express | v4.18 | RESTful API Layer |
| **Database** | MongoDB Atlas | v7.0 | Cloud-native document store |
| **Authentication** | JWT & Bcrypt | v9.0 | Stateless secure authentication |

---

## 🤝 Team Contribution Plan

This project mimics a collaborative Agile workflow.

* **Rishab**: Frontend Architect (Scaffolding, Routing, Styles)
* **Nikhil**: Backend Lead (API, Database, Auth Logic)
* **Rituraj**: Security Engineer (Login/Signup Pages, Admin Panel)
* **Swaraj**: Data Scientist (Charts, AI Models, Data Scripts)

---

## 📜 License

&copy; 2026 AadhaarPulse Team. Licensed under the MIT License.

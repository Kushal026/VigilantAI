
# VigilantAI – Behavioral Threat Fusion & Smart Login Abuse Detection

## Design & Theme
- Dark cybersecurity dashboard with neon blue/purple accents
- Glassmorphism cards with subtle gradients
- Responsive layout with sidebar navigation

## Pages

### 1. Login Page
- Sleek dark-themed login form with cyber aesthetic
- JWT-based auth via Supabase Auth

### 2. Security Dashboard (Home)
- **Stat Cards**: Total Users, Active Sessions, Suspicious Logins, Threat Alerts
- **Charts**: Login attempts over time, anomaly detection trends, risk score distribution, activity heatmap
- **Tables**: Recent login attempts, flagged users, latest alerts

### 3. User Activity Monitor
- Searchable/filterable table of all user login activity
- Details: IP address, device info, login time, success/failure, location
- Click to drill into individual user history

### 4. Threat Alerts Page
- Live feed of security alerts with severity indicators
- Filter by risk level, date range, alert type
- Each alert shows: user ID, IP, anomaly type, risk score, timestamp

### 5. AI Risk Analysis Page
- Trigger AI-powered analysis of user behavior via Lovable AI (Gemini)
- Displays AI-generated risk assessments, anomaly explanations, and recommendations
- Risk score visualization (0-100 gauge)

### 6. Threat Investigation Panel
- View flagged users with full login history
- AI-generated behavioral anomaly explanations
- Mark threats as resolved, add notes

### 7. Admin Settings
- Role management (admin/analyst roles)
- Alert threshold configuration
- System preferences

## Database (Supabase)
- **profiles**: user metadata
- **user_roles**: role-based access (admin, analyst, user)
- **login_logs**: IP, device, timestamp, success/failure, location
- **alerts**: anomaly type, risk score, user reference, status
- **risk_scores**: per-user risk scores over time

## Data Simulation Engine
- TypeScript module generating synthetic data:
  - Normal login patterns
  - Brute force attack simulations
  - Unusual location/device logins
  - Random failures
- Populates database tables for demo purposes

## AI Threat Detection (Lovable AI Edge Function)
- Edge function that sends user activity patterns to Gemini AI
- AI analyzes and returns: risk score (0-100), anomaly label, explanation
- Rule-based scoring layer for real-time checks (failed login thresholds, unusual times/IPs)

## Alert System
- When risk score exceeds configurable threshold:
  - Dashboard toast notification
  - Alert logged to database
  - Email alert via Lovable Cloud email

## Auth & Security
- Supabase Auth with email/password
- Role-based access via user_roles table with RLS
- Admin-only routes protected client-side and server-side

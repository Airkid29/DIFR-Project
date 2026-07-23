# Complete DFIR-Lab Documentation

## 1. Overview

DFIR-Lab (Digital Forensic & Incident Response) is an all-in-one platform dedicated to digital incident response and digital forensics.

### 1.1 Main Features

- **Incident Management** : Create, track, and resolve incidents with severity classification
- **Evidence Management** : Complete chain-of-custody traceability
- **File Analysis** : YARA analysis + VirusTotal and OTX integrations
- **Threat Intelligence** : Search for IOCs (Indicators of Compromise)
- **Reporting and Export** : Generate forensic audit PDF reports
- **Slack Integration** : Automatic notifications
- **Multi-Factor Authentication (MFA)** : Enhanced security

### 1.2 Tech Stack

| Layer | Technologies |
|-------|--------------|
| Frontend | React 18, TypeScript, Vite |
| Backend | FastAPI (Python 3.11+) |
| Database | PostgreSQL (with SQLAlchemy ORM) |
| Asynchronous Tasks | Celery + Redis |
| File Analysis | YARA Rules |
| Containerization | Docker / Docker Compose |
| Deployment | Render (Backend) + Netlify (Frontend) |

---

## 2. Installation and Local Setup

### 2.1 Prerequisites

- Docker Desktop (for full environment)
- Node.js 20+ (for frontend)
- Python 3.11+ (for backend development)
- Git (optional, to clone the repo)

### 2.2 Full Installation with Docker Compose

Step-by-step to launch DFIR-Lab locally:

1. **Open your terminal** and navigate to the project directory:
   ```powershell
   cd "c:\Users\rachi\Desktop\DIFR Project"
   ```

2. **Start all services** via Docker Compose:
   ```powershell
   docker-compose up --build
   ```
   - This will initialize:
     - PostgreSQL database
     - Redis (for asynchronous tasks)
     - FastAPI backend
     - Celery worker
     - React frontend (if configured)

3. **Verify that services are running**:
   - Backend API: [http://localhost:8000/docs](http://localhost:8000/docs) (Swagger documentation)
   - Frontend: [http://localhost:5173](http://localhost:5173) (if you start frontend separately)

### 2.3 Start Frontend Separately

If you want to launch the frontend in development mode without Docker:

1. Navigate to the frontend folder:
   ```powershell
   cd "c:\Users\rachi\Desktop\DIFR Project\frontend"
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start development server:
   ```powershell
   npm run dev
   ```

### 2.4 Start Backend Separately

For backend development:

1. Navigate to backend folder:
   ```powershell
   cd "c:\Users\rachi\Desktop\DIFR Project\backend"
   ```

2. Create and activate a Python virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\activate
   ```

3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

4. Run migrations (if needed):
   ```powershell
   alembic upgrade head
   ```

5. Start server:
   ```powershell
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

---

## 3. Using the Application: Step-by-Step Guide

### 3.1 Account Creation and Login

1. **Go to the homepage**: `http://localhost:5173`
2. Click **"Register"**
3. Fill out the form:
   - Name / First name
   - Email address
   - Password
4. Click **"Create Account"**
5. Log in with your credentials
6. **Optional**: Enable two-factor authentication (MFA) in your profile settings for enhanced security

### 3.2 Dashboard

The dashboard is the first page you see after logging in. It displays:

- **Quick Actions**:
  - File analysis
  - Create incident
  - Search threat intelligence
- **Key Statistics**:
  - Active incidents
  - Triaged evidence
  - Verified integrity
  - Average triage time
- **Chart**: Incident volume over time
- **Threat Feed**: Latest detected threats with confidence level

**To use the Dashboard**:
1. Click on any quick action card to access the corresponding feature
2. Click on the "View all threats" button to go to the threat intelligence page

### 3.3 Incident Management

#### 3.3.1 Create a New Incident

1. Click on **"Incidents"** in the navigation bar
2. Click the **"+ Log Incident"** button
3. Fill out the form:
   - **Title**: Clear incident name (required)
   - **Description**: Contextual details about the incident
   - **Severity**:
     - `critical`: Major incident requiring immediate intervention
     - `high`: Important incident
     - `medium`: Moderate incident
     - `low`: Minor incident
4. Click **"Create Incident"**

#### 3.3.2 Filter and Search Incidents

- Use the **search bar** to filter by incident title or ID
- Use the **dropdown menu** to filter by severity

#### 3.3.3 Update Incident Status

1. Select an incident from the list
2. In the details panel on the right:
   - Modify **status**:
     - `open`
     - `triage`
     - `resolved`
   - Modify **severity** if needed

#### 3.3.4 View Incident Timeline

1. Select an incident
2. Click the **"View Timeline"** button

### 3.4 Evidence Management

#### 3.4.1 Register New Evidence

1. Click on **"Evidence"** in the navigation bar
2. Click **"+ Register Evidence"**
3. Fill out the form:
   - **Evidence Name**: Descriptive name (required)
   - **Category**:
     - `Disk Image`
     - `RAM Dump`
     - `Log File`
   - **SHA-256 Hash**: Evidence hash (64 hex characters - required)
   - **Location**: Where the evidence is stored (default: "Secure vault")
4. Click **"Register and Audit"**

#### 3.4.2 Transfer Evidence Custody

1. Select an evidence item from the list
2. Click **"Transfer Custody"**
3. Fill out the form:
   - **New Custodian**: Name or ID of the person you're transferring to
   - **Action Taken**: Details about the action performed during the transfer
4. Click **"Confirm Transfer"**

#### 3.4.3 Accept/Reject a Transfer

If evidence is transferred to you:
1. Select the evidence
2. Click **"Accept"** or **"Reject"** as appropriate

#### 3.4.4 Export Evidence Report

1. Select an evidence item
2. Click on:
   - **"PDF"** to generate a local report via frontend
   - **"Server"** to download a backend-generated report

### 3.5 File Analysis

#### 3.5.1 Submit a File for Analysis

1. Click on **"Analysis"** in the navigation bar
2. **Two ways to add a file**:
   - Drag and drop the file into the upload zone
   - Click the zone to select a file from your computer
3. Wait for the analysis to complete (you'll see a progress bar)

#### 3.5.2 Interpret Results

Once analysis is complete, you'll see:

1. **Threat Assessment**:
   - Threat score (0-100)
   - Corresponding severity level
   - Badge indicating analysis type (YARA + Intel)
   - List of matching YARA rules and integrations

2. **Digital Fingerprints**:
   - MD5
   - SHA-1
   - SHA-256

3. **Operational Notes**: Additional details about the analysis

#### 3.5.3 Export Analysis Report

1. After analysis, click **"Export PDF Report"**
2. The downloaded report will contain all information:
   - File details (name, size)
   - Score and severity
   - Fingerprints (hashes)
   - Matching rules
   - Operational notes
   - Chain of custody

### 3.6 Threat Intelligence

1. Click on **"Intel"** in the navigation bar
2. Enter an IOC (Indicator of Compromise): hash, IP, domain, URL, etc.
3. Click **Search**
4. Review results from VirusTotal and OTX (if your API keys are configured)

### 3.7 Settings and Profile

1. Click on **"Profile"** in the navigation bar
2. Here you can:
   - Update your personal information
   - Configure two-factor authentication (MFA)
   - Manage your VirusTotal and OTX API keys
   - Configure Slack integrations
3. Click **"Settings"** for advanced system configurations

---

## 4. Integration Configuration

### 4.1 VirusTotal

1. Create an account on [VirusTotal](https://www.virustotal.com/)
2. Get your API key in your profile settings
3. In DFIR-Lab, go to **Profile > Settings**
4. Enter your VirusTotal API key and save

### 4.2 OTX (AlienVault Open Threat Exchange)

1. Create an account on [AlienVault OTX](https://otx.alienvault.com/)
2. Get your API key
3. In DFIR-Lab, go to **Profile > Settings**
4. Enter your OTX API key and save

### 4.3 Slack

See `docs/SLACK_AND_AVATAR_SETUP.md` for detailed Slack integration setup.

---

## 5. Roles and Permissions

- **Administrator (Admin)**: Access to all features, including Ultra Admin (user management, audits, etc.)
- **Analyst**: Incident and evidence management, analysis
- **Viewer**: Read-only access

---

## 6. Security and Audit

- All actions are logged in audit logs
- Complete chain of custody is maintained for every evidence item
- Passwords are hashed and never stored in clear text
- MFA is recommended for all accounts

---

## 7. Troubleshooting

### 7.1 Connection Issues

- Verify the backend is running at `http://localhost:8000`
- Check backend logs for errors
- Clear your browser cache and try again

### 7.2 File Analysis Fails

- Verify that the Celery worker is running
- Check worker logs
- Ensure Redis is accessible

### 7.3 500 Error (Internal Server Error)

- Check FastAPI backend logs
- Verify that PostgreSQL database is connected
- Check environment variables

---

## 8. Production Deployment

For deployment, see `docs/DEPLOY_RENDER_NETLIFY.md`.

---

## 9. Glossary

| Term | Definition |
|------|------------|
| DFIR | Digital Forensics & Incident Response |
| IOC | Indicator of Compromise |
| Chain of Custody | Complete traceability of digital evidence |
| YARA | Language/tool for malware detection via rules |
| MFA | Multi-Factor Authentication |
| SHA-256 | Cryptographic hash function producing a 256-bit fingerprint |

---

## 10. Updating the Project

To update your installation:

1. Pull latest changes:
   ```bash
   git pull
   ```

2. Restart Docker services:
   ```powershell
   docker-compose down
   docker-compose up --build
   ```

3. Update frontend dependencies:
   ```powershell
   cd frontend
   npm install
   ```

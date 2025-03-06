# **3\. Internal Scan**

## **3[.1 Stakeholder Interviews](https://docs.google.com/document/d/1T2tiRBZpsAS9y0thHW_9sP9k4hazDBnvJu1M4HBx6K0/edit?tab=t.0)**[:](https://docs.google.com/document/d/1T2tiRBZpsAS9y0thHW_9sP9k4hazDBnvJu1M4HBx6K0/edit?tab=t.0) 

Questions for the CEO followed by the Marketing Head/ Finance Head/ HR Head, and IT Head.

\[**Purpose:** To automate and standardise stakeholder interviews for the Internal Scan module, starting with the CEO and followed by stakeholders based on CEO input, defaulting to Marketing, Finance, HR, and IT Heads for initial deployment.

---

### 3.1.1 Overview

The Internal Scan \- Stakeholder Interviews module gathers perspectives from key organisational stakeholders to map the current state of the business. The process begins with the CEO, whose input determines subsequent interviewees, defaulting to the Marketing Head, Finance Head, HR Head, and IT Head unless specified otherwise. This module automates interviews using a Virtual Assistant (VA), delivering consistent, actionable outputs.

---

### 3.1.2 Objectives

* Automate stakeholder interviews, reducing manual effort.  
* Standardise role-specific questions for consistent data collection.  
* Capture and summarise perspectives from the CEO and four default domains (Marketing, Finance, HR, IT).  
* Enable scalability based on CEO-directed stakeholder selection.

---

### 3.1.3 Scope

It focuses on the stakeholder interviews, a subcomponent of the internal scan. The CEO is interviewed first, followed by up to four default stakeholders (Marketing, Finance, HR, and IT Heads), adjustable per CEO guidance. Excludes Internal Data Collection.

---

### 3.1.4 Functional Requirements

#### 3.1.4.1 Inputs

* **Stakeholder Identification**  
  * *Description:* The CEO provides an initial list of stakeholders; and defaults to Marketing, Finance, HR, and IT Heads.  
  * *Format:* Text (manual inputs).  
  * *Source:* CEO response via VA or client onboarding form.  
* **Stakeholder Responses**  
  * *Description:* Answers to standardised questions (7-15 per role).  
  * *Format:* Avatar-based chat/ chatbot.  
  * *Source:* VA interaction with stakeholders.

#### 3.1.4.2 Process

* **Stakeholder Onboarding**  
  * VA starts with the CEO, asking: "Who else should we speak to for a complete perspective?"  
  * Default sequence: CEO → Marketing → Finance → HR → IT (configurable if CEO specifies others).  
* **Question Delivery**  
  * VA delivers role-specific, open-ended questions ([see attached](https://docs.google.com/spreadsheets/d/1rLXd3hDWedUvMPt0FCG-kvFsnHn7DCIl2bUsfIn8Br0/edit?gid=0#gid=0)).  
  * *Question Count:* Nearly 10 standardised per role, adjustable depending on the flow of conversation.  
  * Final question per role: "Is there anything else you’d like us to consider?"  
  * VA adapts follow-ups (e.g., "Can you elaborate?") for clarity if client stakeholder response is unclear to VA.  
* **Response Collection**  
  * VA records responses in text or audio (auto-transcribed).  
  * Flags conflicting perspectives (e.g., "Marketing sees potential; Finance sees low margins").

#### 3.1.4.3 Outputs

* **Compiled Answers Stored**  
  * *Description:* Role-based response summary (e.g., CEO \> Q1 \> Answer).  
  * *Format:* Text (structured document).  
  * *Details:* Key insights highlighted.  
* **Insight Summary**  
  * *Description:* High-level summary of perspectives and conflicts.  
  * *Format:* Text (bullet points, max 1 page).  
  * *Details:* AI-generated, consultant-validated.

---

### 3.1.5 Non-Functional Requirements

* **Scalability:** Supports five stakeholders initially, extensible per CEO input.  
* **Usability:** Simple chat/voice interface (minimal training).  
* **Security:** Encrypted response storage.

---

### 3.1.6 Technical Specifications

* **Platform:** Web-based stakeholder interview part of VinScan suite.  
* **AI Components:**  
  * LLM for question delivery/response parsing.  
  * Transcription of avatar-based audio chat.  
  * Summarisation.  
* **Storage:** Store responses in the database with role-based access.  
* **Integration:** Links to Internal Data Collection and Reporting modules.

---

### 3.1.7 User Workflow

1. **CEO Interview:** VA asks the CEO questions, and identifies additional stakeholders.  
2. **Default Interviews:** VA proceeds with Marketing, Finance, HR, and IT unless redirected.  
3. **Data Capture:** Responses are recorded (text/audio) and transcribed if needed.  
4. **Processing:** AI compiles and summarises outputs.  
5. **Delivery:** Results are stored in the system for further processing

---

### 3.1.8 Assumptions

* CEO is available first and provides stakeholder guidance.  
* Default stakeholders (4 domains) suffice for initial deployment.  
* Online access for all interviewees.

---

### 3.1.9 Risks & Mitigations

* **Risk:** The CEO omits key stakeholders.  
  * *Mitigation:* Default to 4 domains; VA prompts for confirmation.  
* **Risk:** Vague responses.  
  * *Mitigation:* VA seeks clarification.  
* **Risk:** Technical delays.  
  * *Mitigation:* Offline recording option with manual upload.

---

### 3.1.10 Deliverables

* Compiled response document with interviews of all stakeholders organised for easy retrieval of important information(text).  
* Insight summary (text).

## **3.2 Internal Data Collection**: 

Sales, finance, marketing, and customer satisfaction data upload and analysis.

Give the client an interface to collect the necessary document and files (pdf, pptx, excel,csv, images and other possible documents a firm can upload) Client can get an option to add text if he wants to explain about what documents he has uploaded.


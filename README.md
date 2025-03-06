# VinScan - Professional Consulting Framework

VinScan is a comprehensive web-based consulting framework that helps organizations analyze their internal operations, market position, and competitive landscape. The application features modules for client onboarding, internal scans, market analysis, competitor benchmarking, and strategic recommendations.

## Features

- Professional consulting firm-style UI/UX
- Client onboarding and profile management
- Automated stakeholder interviews using Google Gemini API
- Market and competitor analysis tools
- Strategic recommendation generation
- Interactive data visualizations

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Google Gemini API key

## Project Structure

```
vinscan-app/
├── client/             # React frontend
├── server/             # Node.js backend
├── documentation/      # Project documentation
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/vinscan
   GEMINI_API_KEY=your-gemini-api-key-here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`.

## Usage

1. Client Signup
   - Navigate to the homepage
   - Fill in the required information (name, position, website URL, email, social media links)
   - Submit the form to proceed to the next steps

2. Internal Scan
   - Complete stakeholder interviews through the chatbot interface
   - Upload relevant documents for analysis

3. Market Analysis
   - Use provided templates for secondary research
   - Input market data and trends

4. Competitor Analysis
   - Map digital presence of competitors
   - Generate competitive benchmarking reports

5. Strategic Recommendations
   - Review automatically generated insights
   - Export final reports in professional formats

## Development

- Backend API runs on `http://localhost:5000`
- Frontend development server runs on `http://localhost:3000`
- MongoDB should be running locally on default port `27017`

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
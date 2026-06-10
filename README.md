# Multi-Agent Research Engine

An AI-powered research platform that orchestrates multiple specialized agents to search, analyze, synthesize, and critique information on any topic. The system automates the complete research workflow, transforming a simple query into a structured, high-quality research report.

---

## Overview

Multi-Agent Research Engine leverages a team of AI agents working together in a coordinated pipeline:

**Search Agent → Reader Agent → Writer Agent → Critic Agent**

Each agent performs a dedicated task and passes its output to the next stage, ensuring the final report is grounded in reliable sources, enriched with detailed context, and reviewed for quality before delivery.

---

## Features

- Multi-Agent Architecture — Four specialized AI agents collaborate to perform end-to-end research.
- Web-Powered Research — Retrieves fresh information from the internet using Tavily Search.
- Content Extraction — Scrapes and processes relevant web pages for deeper analysis.
- Automated Report Generation — Produces comprehensive research reports in Markdown format.
- AI Critique & Review — Evaluates report quality, completeness, and clarity.
- Modern Web Interface — Responsive React frontend with a clean user experience.
- FastAPI Backend — High-performance API serving the research pipeline.
- Real-Time Status Tracking — Displays progress across all agent stages.
- Deployable Architecture — Frontend hosted on Vercel and backend hosted on Render.

---

## System Architecture

```text
User Query
    │
    ▼
Search Agent
    │
    ▼
Reader Agent
    │
    ▼
Writer Agent
    │
    ▼
Critic Agent
    │
    ▼
Final Research Report
```

---

## Tech Stack

| Layer | Technology |
|---------|------------|
| Frontend | React.js, Tailwind CSS |
| Backend | FastAPI |
| Agent Framework | LangChain |
| LLM Provider | Mistral |
| Search Engine | Tavily |
| Web Scraping | BeautifulSoup |
| Deployment | Vercel + Render |
| Environment Management | Python Dotenv |

---

## Project Structure

```text
multi-agent-research-engine/
│
├── backend/
│   ├── main.py
│   ├── pipeline.py
│   ├── agents.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── .env
│
└── README.md
```

---

## How It Works

### 1. Search Agent

The Search Agent uses Tavily Search to gather the most relevant and up-to-date information related to the user's query.

**Responsibilities**
- Perform web searches
- Retrieve source URLs
- Collect summaries and metadata

---

### 2. Reader Agent

The Reader Agent extracts content from the most relevant sources and prepares detailed context for report generation.

**Responsibilities**
- Scrape webpage content
- Remove irrelevant information
- Extract meaningful insights

---

### 3. Writer Agent

The Writer Agent synthesizes search results and extracted content into a coherent research report.

**Responsibilities**
- Organize information logically
- Generate structured Markdown reports
- Create summaries and key findings

---

### 4. Critic Agent

The Critic Agent independently reviews the generated report.

**Responsibilities**
- Assess accuracy
- Evaluate completeness
- Identify weaknesses
- Suggest improvements

---

## Future Improvements

- PDF export support
- Citation generation
- Multi-source content aggregation
- Research history tracking
- User authentication
- Streaming responses
- Multi-model support (OpenAI, Claude, Gemini)
- Agent memory and context retention

---

## Author

**Ankita Ghosh**

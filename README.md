# Donna, Your personal AI Assistant

Donna is a  AI-driven platform designed to streamline your career workflow. From analyzing documents and generating insights to managing emails and visualizing data with Mermaid diagrams, Donna is your all-in-one career productivity hub.

##  Getting Started

### Prerequisites

- **Node.js**: Version 18.x or higher
- **pnpm**: Recommended package manager

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd donna
   ```

2. **Install dependencies**:

   ```bash
   pnpm install
   ```

3. **Environment Setup**:
   Copy the example environment file and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
   _Note: Open `.env` and provide your API keys for OpenAI, Groq, Supabase, and Resend._

### Running the Project

1. **Start the development server**:
   ```bash
   pnpm dev
   ```
2. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **AI Chat**: Powered by OpenAI and Groq for blazing-fast responses.
- **Knowledge Base**: Integrated with Supabase for document storage and RAG (Retrieval-Augmented Generation).
- **Interactive Diagrams**: Dynamic Mermaid.js rendering for visualizing complex systems.
- **Email Integration**: Automated email sending via Resend and Gmail integration.
- **Document Analysis**: Supports PDF, DOCX, and XLSX parsing.

##  Environment Variables

| Variable                            | Description                                    |
| :---------------------------------- | :--------------------------------------------- |
| `OPENAI_API_KEY`                    | Your OpenAI secret key.                        |
| `GROQ_API_KEY`                      | API key for Groq's high-speed LLM inference.   |
| `NEXT_PUBLIC_SUPABASE_URL`          | Your Supabase project URL.                     |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`     | Supabase anonymous key for client-side access. |
| `SUPABASE_SERVICE_ROLE_KEY`         | Service role key for admin-level operations.   |
| `RESEND_API_KEY`                    | API key for sending emails via Resend.         |

## Scripts

- `pnpm dev`: Runs the app in development mode.
- `pnpm build`: Builds the application for production.
- `pnpm start`: Starts the production server.
- `pnpm lint`: Runs ESLint to check for code issues.
- `pnpm format`: Formats code using Prettier.

---

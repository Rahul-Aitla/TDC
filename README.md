# TDC Matchmaker Portal
### AI-Powered Operations Hub for Matrimonial Matchmaking

The **TDC Matchmaker Portal** is a high-performance, CRM-style internal tool designed for matrimonial operations teams. It streamlines the complex process of customer management and matchmaking by combining deterministic compatibility logic with advanced AI reasoning.

---

## 🚀 Short Description
Built with **Next.js 15**, **React 19**, and **Tailwind CSS**, this portal provides a seamless experience for matchmakers to:
- **Manage Customers**: Advanced filtering and search for large customer databases.
- **AI Matchmaking**: Leverage Google Gemini AI to generate deep compatibility insights, human-centric reasoning, and professional introduction emails.
- **Operations Pipeline**: Track the status of matches from generation to feedback.
- **Detailed Analytics**: Breakdown compatibility across Goals, Lifestyle, Family, Career, and Location.

---

## 📋 Prerequisites & Requirements
Before you begin, ensure you have the following installed:
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Google Gemini API Key**: Required for AI-powered match analysis features.

---

## 🛠️ Installation Guide

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd TDC/my-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Environment Variables**:
   Create a `.env.local` file in the root directory and add your API keys:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

---

## ⚡ Quick Start

1. **Start the development server**:
   ```bash
   npm run dev
   ```
2. **Open the portal**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.
3. **Login**:
   The portal currently uses a mock authentication flow (redirects to `/dashboard`).

---

## 🏗️ Project Structure
- `src/app`: Next.js App Router (Layouts, Pages, API Routes).
- `src/features`: Modular feature-based components (Matching, Interaction).
- `src/components/ui`: Reusable UI components powered by Radix UI.
- `src/lib`: Core utility functions and shared logic.
- `src/types`: TypeScript interfaces and global types.

---

## 🛡️ Security & Performance
- **TypeScript**: Full type safety across the application.
- **Lucide Icons**: Optimized SVG icon set.
- **Geist Font**: Modern typography for maximum readability.
- **AI Constraints**: Strict prompt engineering to ensure professional, factual AI outputs.

---
*Created with ❤️ by Rahul*
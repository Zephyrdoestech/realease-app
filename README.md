# 🇵🇭 RealEase: Trust-Centric Real Estate Platform

> **Sinulog: Proptech Hackathon 2026** — *Proptech Innovation Track*  
> **Team:** Builders (CIT-U)

**RealEase** is a mobile-first property platform engineered to solve the "Trust Deficit" in the Philippine real estate market. We replace chaotic marketplaces with a verified, secure, and hyper-localized home-buying experience.

---

## 🚀 Key Features

*   **🛡️ Multi-Tier Verification:** Automated checks for Agents (PRC ID) and Listings (Land Title/TCT).
*   **📍 Pinoy-Context Search:** Filters for "Flood-Free," "Near MRT/LRT," and "Walking distance to Mall."
*   **🚫 Anti-Scam Chat:** Unverified agents cannot solicit payments.
*   **💰 GCash Integration:** "Quick Reserve" feature to securely hold earnest money in escrow.

---

## 🛠️ Tech Stack

**Monorepo Structure** using strict **TypeScript**.

| Component | Technology |
| :--- | :--- |
| **Mobile App** | React Native + Expo (SDK 50+) |
| **Backend API** | Node.js + Express |
| **Database** | PostgreSQL + TypeORM/Supabase |
| **Styling** | NativeWind (TailwindCSS) |
| **Maps** | React Native Maps |

---

## ⚡ Getting Started

Follow these steps to run the project locally.

### 1. Prerequisites
*   Node.js (v18+)
*   PostgreSQL (Local or Supabase URL)
*   Expo Go App (on your phone)

### 2. Setup the Backend (Server)
Open your terminal and navigate to the backend folder:

```bash
cd realease-backend
npm install
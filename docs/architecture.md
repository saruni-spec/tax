# System Architecture: WhatsApp WebView Integration

This document outlines the technical architecture for the KRA WhatsApp platform. The system shifts from native WhatsApp modules to a **Webview-based architecture**, allowing for complex tax filing workflows.

---

## 1. Architectural Overview

The application follows a **Backend-for-Frontend (BFF)** pattern. It is a stateless Next.js application. The primary objective is to provide a rich user interface within WhatsApp while ensuring that all sensitive logic, API keys, and data integrations happen securely on the server side.

### 2. Infrastructure Diagram

![alt text](<mermaid-diagram-AGaLmLVbGmYd3wTNGIpsg-low(2).png>)

## 3. Component Descriptions

### A. Public Internet Layer

- **WhatsApp Mobile App**: The entry point for the taxpayer. The application is loaded via a swhatsapp webviews.

### B. DMZ / Edge Layer

- **Load Balancer (KRA Subdomain)**: KRA provides a dedicated subdomain (e.g., `whatsapp.kra.go.ke`). This layer handles SSL termination and ensures that only secure HTTPS traffic (Port 443) reaches the application server.

### C. Application Layer (The Service)

- **Next.js Server (Dockerized)**
- **Frontend UI**: Served to the WhatsApp WebView.
- **BFF (Server Actions)**: Acts as a secure proxy. When a user submits a tax return or invoice, the request is sent to a Server Action. This action injects the necessary **KRA API Keys** and **Bearer Tokens** before forwarding the request to KRA services.

### D. Core Services Layer

- **Upstream APIs (eTIMS / PesaFlow)**: The core systems that process tax data. The application remains stateless; it fetches and pushes data to these endpoints in real-time.
- **Auth Service**: Used by the BFF to verify taxpayer sessions and manage authentication tokens.

---

## 4. Key Security Features

- **Credential Isolation**: No API keys, secret tokens, or upstream URLs are ever exposed to the client (WebView). All sensitive communication happens server-to-server within the VPC.
- **Statelessness**: The application does not maintain a local database of taxpayer records.

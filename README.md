# Dash48 + World Skills #48

Dash48 is a web dashboard for industrial environments, built with **React 19 + Vite**, that centralizes the creation, tracking, and history of industrial block orders, and provides quick access to equipment monitoring dashboards.

---

## Context

Dash48 was created to streamline order flow and production monitoring in the Smart 4.0 N2 plant, integrating with inventory and production control systems. It allows operators to create custom orders, track their status in real time, and view industrial indicators.

---

## ⚙️ Main Features

- 🛒 **Store:** Create block orders, choosing color, blades, and stock position.
- ✅ **Confirmation:** Review and confirm orders before sending to the backend.
- 📊 **Dashboards:** Quick access to Camera, Actuator Axes, UR Robot, and OEE panels.
- 📜 **History:** (In development) View past orders.
- 🔎 **Tracking:** (In development) See real-time order status.

---

## 🗂️ Project Structure

```
src/
├── assets/         # Images and styles
├── components/     # Header, Modal, Toast
├── pages/          # index.jsx, loja.jsx, ConfirmarPedido.jsx, etc.
├── services/       # REST API integration
├── App.jsx         # Main routes
└── index.css       # Global styles
```

---

##  Technologies

- React 19
- Vite
- Bootstrap 5
- React Router DOM
- use-local-storage
- REST APIs (Runs on the Smart 4.0 N2 plant)

---

##  How to Run

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the project:
   ```sh
   npm run dev
   ```
3. Access: [http://localhost:5173](http://localhost:5173)

---

## 🔗 Notes

- Theme preference is saved in the browser (localStorage).
- Dashboards and history can be expanded as needed.
- Backend must be available for REST integration.

---
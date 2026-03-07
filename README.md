# Multi-Way Currency Converter 💱

A fast, beautifully designed, offline-first currency converter built for travelers, digital nomads, and global teams. It allows users to view and edit multiple currencies simultaneously, updating all exchange rates in real-time as you type.

## 🌟 Key Features

* **Multi-Way Real-Time Conversion:** Edit any currency on the screen, and all others update instantly.
* **Live Exchange Rates:** Fetches up-to-date daily conversion rates via a free API.
* **Smart Numeric Keyboard:** A custom built-in numeric pad designed specifically for rapid mobile input, completely replacing the clunky native device keyboard.
* **Offline Support & PWA:** Installable directly to your phone's home screen. Works flawlessly offline using the last cached exchange rates.
* **Personalized Experience:** Add, remove, and drag-and-drop to reorder currencies. Your layout preferences are automatically saved locally.
* **Dark/Light Mode:** Full theme support based on system preferences with a manual toggle.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (No heavy frameworks).
* **Styling:** Tailwind CSS (via CDN) for a clean, modern, and highly responsive UI.
* **Storage:** LocalStorage for user preferences and Service Workers for PWA offline capabilities.
* **API:** [ER-API](https://www.exchangerate-api.com/) for live currency data.

## 🚀 Getting Started

Since this is a client-side only application, no build steps or backend servers are required.

1. Clone the repository:
   ```bash
   git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
Open index.html in any modern web browser.

To test PWA installation features locally, serve the directory via a local web server (e.g., using Python's http.server or Node's http-server).

📱 Mobile Installation
Navigate to the application URL on your mobile device (Safari for iOS, Chrome for Android) and tap "Share" -> "Add to Home Screen" or follow the browser prompt to install it as a native-feeling app.

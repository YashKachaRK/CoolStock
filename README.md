# CoolStock

CoolStock is a comprehensive inventory, order, and invoice management web application built specifically for the owner of the **coolproduct** company. It streamlines daily operations by providing a centralized platform for managing stock, tracking orders, generating invoices, and overseeing the sales team.

## 🚀 Key Features

*   **Role-Based Access Control:** Secure authentication and authorization with distinct roles for Admin and Sales users.
*   **Admin Dashboard:**
    *   Overview of business metrics with interactive charts (using Chart.js).
    *   Manage Products (Add, Update, Delete).
    *   Manage Stock Updates.
    *   Manage Salesmen (Users).
    *   View and track all Orders.
*   **Sales Dashboard:**
    *   View available Inventory.
    *   Create new Orders.
    *   View Order Details.
*   **Invoice Generation:** Automated PDF invoice generation for orders (powered by jsPDF).
*   **Modern UI:** Responsive and modern user interface styled with Tailwind CSS.

## 🛠️ Technology Stack

*   **Frontend Library:** React (v19)
*   **Build Tool:** Vite
*   **Routing:** React Router DOM
*   **Styling:** Tailwind CSS
*   **Charts:** Chart.js & react-chartjs-2
*   **PDF Generation:** jsPDF
*   **Icons:** Lucide React

## 💻 Setup and Installation

Follow these steps to set up the project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YashKachaRK/CoolStock.git
    cd CoolStock
    ```

2.  **Install dependencies:**
    Make sure you have Node.js installed. Run the following command to install all required packages:
    ```bash
    npm install
    ```

3.  **Run the development server:**
    Start the Vite development server:
    ```bash
    npm run dev
    ```
    The application will be accessible in your browser (usually at `http://localhost:5173`).

4.  **Build for production:**
    To create an optimized production build:
    ```bash
    npm run build
    ```

## 👥 Project Team

This project was developed by:
*   **Rutvik Shiyal**
*   **Yash Kacha**
*   **Gracy Pandya**

# **Pharmacy Inventory and POS System**

This project is designed to manage products, track inventory levels, manage suppliers, and support point-of-sale operations for small businesses such as pharmacies. It provides a practical solution for monitoring stock, recording sales, and maintaining up-to-date product and supplier information.

The system supports **role-based access** with JWT authentication, distinguishing between admin and regular staff. Core features include:

* **Product Management:** Add, update, delete (archive) products, search by SKU or name, and view inventory summaries.
* **Sales Management:** Record bulk sales and retrieve sales reports (daily, weekly, monthly, annual, or custom date ranges). Admin-only access is enforced for reporting endpoints.
* **Supplier Management:** Add, update, delete, and list suppliers.
* **User Authentication:** JWT-based login for staff/admin accounts.
* **Profile Management:** Verify admin privileges.

The backend is built with **Node.js** and **Express**, using **PostgreSQL** for data storage. Middleware ensures authentication (`authenticateToken`) and admin authorization (`authorizeAdmin`) where necessary.

---

## **Project Structure**

* **Controllers:** Handle business logic for products, sales, and suppliers.
* **Routers:** Define API endpoints.
* **Middleware:** Handle authentication and admin authorization.
* **Models:** Database table representations for products, sales, and suppliers.
* **Database:** PostgreSQL for storing products, sales, and supplier data.

---

## **API Overview**

### **Products**

| Method | Endpoint            | Description                     |
| ------ | ------------------- | ------------------------------- |
| POST   | `/products/`        | Add a new product (admin/staff) |
| PUT    | `/products/:id`     | Update product details          |
| DELETE | `/products/:id`     | Archive a product               |
| GET    | `/products/search`  | Search product by SKU or name   |
| GET    | `/products/`        | Get all products                |
| GET    | `/products/summary` | Get inventory summary           |

### **Sales**

| Method | Endpoint                           | Description                          |
| ------ | ---------------------------------- | ------------------------------------ |
| POST   | `/sales/bulk`                      | Record multiple sales                |
| GET    | `/sales/daily/:date`               | Get daily sales (admin only)         |
| GET    | `/sales/weekly`                    | Get weekly sales (admin only)        |
| GET    | `/sales/monthly/:month/:year`      | Get monthly sales (admin only)       |
| GET    | `/sales/annual/:year`              | Get annual sales (admin only)        |
| GET    | `/sales/range/:startDate/:endDate` | Get sales by date range (admin only) |

### **Suppliers**

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| POST   | `/suppliers/`    | Add a new supplier |
| PUT    | `/suppliers/:id` | Update supplier    |
| DELETE | `/suppliers/:id` | Delete supplier    |
| GET    | `/suppliers/`    | List all suppliers |

### **Authentication & Profile**

| Method | Endpoint      | Description                       |
| ------ | ------------- | --------------------------------- |
| POST   | `/auth/login` | Login using username and password |
| GET    | `/profile/`   | Verify if logged-in user is admin |

---

## **Middleware**

* **authenticateToken:** Verifies JWT from `Authorization` header. Denies access if token is invalid or missing.
* **authorizeAdmin:** Grants access only if the logged-in user matches the admin username from `.env`.

---

## **How to Run / Test**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/FireFlyDeveloper/Pharmacy-POS.git
   cd Pharmacy-POS
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up PostgreSQL database:**

   * Create a database for the project.
   * Update `.env` with your database credentials.

4. **Start the backend server:**

   ```bash
   npm start
   ```

5. **Test API endpoints using Postman:**

   * Import a Postman collection or manually create requests.
   * Include the `Authorization: Bearer <token>` header for protected endpoints.
   * Test product, sales, and supplier operations.
   * Admin-only endpoints should be tested using admin credentials.

6. **Verify system functionality:**

   * CRUD operations for products and suppliers.
   * Bulk sales recording and sales reporting.
   * JWT authentication and role-based access.

💼 Smart Inventory & Expense System

A modern Inventory & Expense Management App built with Flask (Python) and React.  
Designed to help businesses manage products, sales, expenses, and view visual reports — all in one place.

> 🔗 Live Repo: [https://github.com/edwin463/Smart-Inventory-System](https://github.com/edwin463/Smart-Inventory-System)

---

Tech Stack

| Frontend | Backend | Database | Auth | Charts |
|----------|---------|----------|------|--------|
| React + MUI | Flask + SQLAlchemy | SQLite | JWT (JSON Web Tokens) | Chart.js |

---

Key Features

✅ Inventory Management
- Add, update, and delete products  
- Track stock levels by category and supplier  
- View detailed product info  

✅ Sales Tracking 
- Record product sales with stock auto-update  
- Sales history by product  
- Total revenue tracking  

✅ Expense Logging
- Track business expenses by category  
- View and update costs  
- Delete old records as needed  

✅ Profit & Reports 
- Real-time profit = Revenue - Expenses  
- Visual reports using Chart.js  
- Filter by daily, weekly, monthly trends  

✅ User Authentication
- JWT login/logout  
- Protected routes and access control  

---

## 📁 Project Structure

phase-5/
├── client/ # React Frontend
│ ├── src/
│ ├── public/
│ └── package.json
├── server/ # Flask Backend
│ ├── models/
│ ├── routes/
│ └── app.py
├── Pipfile
├── README.md

yaml
Copy
Edit

---

🛠️ Local Setup Instructions

✅ Backend (Flask API)

1. Navigate to the backend folder:
   ```bash
   cd server
Install dependencies:

bash
Copy
Edit
pipenv install
Run the Flask server:

bash
Copy
Edit
pipenv run flask run
✅ Frontend (React App)
Navigate to the client folder:

bash
Copy
Edit
cd client
Install React dependencies:

bash
Copy
Edit
npm install
Start the frontend:

bash
Copy
Edit
npm start
🌟 Future Enhancements
SMS/WhatsApp alerts for low stock or high spending

AI-powered sales forecasting

Automated supplier restocking

OCR for receipt scanning

Integration with M-Pesa / bank APIs

Reward system for efficient stock tracking

👨‍💻 Developer
Edwin Karuri Njoroge
Innovation Consultant & Software Developer
📍 Nairobi, Kenya
🔗 GitHub: @edwin463
🔗 LinkedIn: edwin-eliud-4782792b9

📜 License
This project is licensed under the MIT License

"# UrlShortenerApp" 
# **URL Shortener Microservice**  
*A Full-Stack URL Shortener with Analytics*  

**Live Demo**: [Frontend](http://localhost:3000) | [Backend API](http://localhost:5000)  

---

## **📌 Features**  
 **Shorten URLs** with custom expiration (default: 30 mins)  
 **Custom shortcodes** (alphanumeric, 4-10 chars)  
 **Analytics Dashboard** with click tracking (timestamp, referrer, location)  
 **Concurrent URL shortening** (up to 5 URLs at once)  
 **Responsive Material-UI Frontend**  
 **RESTful API** with proper error handling  

---

## **⚙️ Tech Stack**  
| **Frontend**       | **Backend**       | **Database** | **DevOps**       |  
|--------------------|-------------------|-------------|------------------|  
| React.js           | Node.js/Express   | MongoDB     | Axios (HTTP)     |  
| Material-UI        | Mongoose (ODM)    |             | CORS middleware  |  
| React Router       | geoip-lite        |             | Custom Logger    |  

---

##  Quick Start**  

### **1. Clone the Repository**  
```bash
git clone https://github.com/your-username/url-shortener.git
cd url-shortener
```

### **2. Set Up Backend**  
```bash
cd backend
npm install
npm start  # Runs on http://localhost:5000
```

### **3. Set Up Frontend**  
```bash
cd ../frontend
npm install
npm start  # Runs on http://localhost:3000
```

### **4. Start MongoDB**  
Ensure MongoDB is running locally:  
```bash
sudo systemctl start mongod  # Linux/macOS
```

---

## **🔍 API Endpoints**  
| **Method** | **Endpoint**            | **Description**                     |  
|------------|-------------------------|-------------------------------------|  
| `POST`     | `/shorturls`            | Create a shortened URL              |  
| `GET`      | `/:shortcode`           | Redirect to original URL            |  
| `GET`      | `/shorturls/:shortcode` | Get analytics for a shortcode       |  
| `GET`      | `/shorturls`            | List all shortened URLs (for stats) |  

**Example Request (Create Short URL):**  
```bash
curl -X POST http://localhost:5000/shorturls \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","validity":60,"shortcode":"test123"}'
```

---

## **📂 Project Structure**  
```
url-shortener/  
├── backend/           # Node.js + Express API  
│   ├── config/        # DB configuration  
│   ├── controllers/   # API logic  
│   ├── models/        # MongoDB schemas  
│   ├── routes/        # API endpoints  
│   └── app.js         # Server entry point  
│  
├── frontend/          # React.js UI  
│   ├── src/  
│   │   ├── pages/     # Next.js pages  
│   │   ├── api.js     # Axios API calls  
│   │   └── App.js     # Main React component  
│   └── ...  
│  
└── README.md          # You are here!  
```

---

## **🔧 Debugging Tips**  
- **500 Server Error?**  
  - Check MongoDB connection (`backend/config/db.js`).  
  - Validate request body format (URL, validity, shortcode).  
- **CORS Issues?**  
  - Ensure `app.use(cors())` is enabled in `backend/app.js`.  
- **Shortcode not working?**  
  - Verify it’s alphanumeric (4-10 chars).  

---

## **📜 License**  
MIT © [Pucchakayala Rajesh](https://github.com/Raj-techs)  

--- 

**🌟 Star this repo if you found it useful!**  
**🐛 Report issues [here](https://github.com/Raj-techs/url-shortener/).**  

--- 

### **Screenshots**  
| **Shortener Page** | **Analytics Dashboard** |  
|--------------------|------------------------|  
| ![Shortener](<img width="1917" height="862" alt="image" src="https://github.com/user-attachments/assets/6578d610-bf78-4a26-be2f-41f8f3146886" />) |
![Analytics](<img width="1919" height="865" alt="image" src="https://github.com/user-attachments/assets/8419c0f4-edeb-46b5-83b8-53fec0622c0d" />) |  




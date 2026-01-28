# 🏠 Living Room Finder

A modern, full-stack room rental platform built with **React**, **Node.js**, **Express**, and **MongoDB**. This application connects room seekers with room owners, featuring advanced search, Google Maps integration, reviews, and real-time availability management.

---

## ✨ Features

### 🔐 **Authentication & Authorization**
- User registration with role selection (Seeker/Owner)
- JWT-based secure authentication
- Role-based access control
- Protected routes for authenticated users

### 🏠 **Room Management (Owner)**
- **Create Room**: Multi-step form with validation
- **Update Room**: Edit all room details including media
- **Delete Room**: Remove listings with automatic media cleanup
- **Availability Toggle**: Quick status updates (Available/Booked/Under Maintenance)
- **Dashboard**: Manage all your listings in one place

### 🗺️ **Google Maps Integration**
- **Interactive Map Picker**: Click to select location or use current GPS location
- **Manual Coordinate Entry**: Enter latitude/longitude directly
- **Live Location Preview**: See map preview while creating/editing rooms
- **Precise Location Display**: Show exact coordinates on room details page
- **"Open in Google Maps" Button**: Direct navigation to the location

### 🔍 **Search & Filter**
- Search by keyword, category, city, and price range
- Real-time filtering
- Only shows available and approved rooms
- Responsive grid layout

### ⭐ **Review System**
- Rate rooms (1-5 stars)
- Leave detailed comments
- Update existing reviews
- Average rating calculation
- Owners cannot review their own rooms

### 📱 **Contact Features**
- Direct phone call button
- WhatsApp integration
- Visit request system
- Owner contact information

### 🖼️ **Media Management**
- Multiple image uploads (Cloudinary)
- Video walkthrough support
- Image gallery with thumbnails
- Automatic old media deletion on update

### 🎨 **Modern UI/UX**
- Premium glassmorphism design
- Smooth animations and transitions
- Fully responsive (Mobile, Tablet, Desktop)
- Toast notifications for user feedback
- Loading states and skeletons

---

## 🚀 Tech Stack

### **Frontend**
- React 18
- React Router DOM
- Axios
- Lucide React (Icons)
- React Hot Toast
- TailwindCSS

### **Backend**
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Cloudinary (Media Storage)
- Multer (File Upload)
- Bcrypt (Password Hashing)

---

## 📦 Installation

### **Prerequisites**
- Node.js (v16+)
- MongoDB
- Cloudinary Account

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/living-room-finder.git
cd living-room-finder
```

### **2. Backend Setup**
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
NODE_ENV=development

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM_NAME=SmartRoom
SMTP_FROM_EMAIL=noreply@smartroom.com
```

Start the backend server:
```bash
npm run dev
```

### **3. Frontend Setup**
```bash
cd client
npm install
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

---

## 📖 Usage Guide

### **For Room Seekers:**
1. **Register** as a Seeker
2. **Browse Rooms** on the homepage or Rooms page
3. **Filter** by location, category, or price
4. **View Details** including photos, videos, and map location
5. **Contact Owner** via phone or WhatsApp
6. **Request Visit** to schedule a viewing
7. **Leave Reviews** after visiting

### **For Room Owners:**
1. **Register** as an Owner
2. Go to **Dashboard** → **Create Room**
3. Fill in room details:
   - **Step 1**: Basic info (title, price, description, contact)
   - **Step 2**: Location (address, city, map picker)
   - **Step 3**: Media (images, videos) and house rules
4. **Pick Location from Map**:
   - Click "Pick Location from Map" button
   - Use 📍 button to get current GPS location
   - Or manually enter latitude/longitude
   - Confirm location
5. **Manage Rooms** from Dashboard:
   - Edit room details
   - Toggle availability status
   - Delete listings
   - View reviews

### **Map Location Picker:**
- **Option 1**: Click the 📍 button to use your current GPS location
- **Option 2**: Click "Pick Location from Map" and manually enter coordinates
- **Option 3**: Right-click on Google Maps → "What's here?" → Copy coordinates

---

## 🗂️ Project Structure

```
living-room-finder/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context (Auth)
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Global styles
│   └── package.json
│
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── repositories/  # Database operations
│   │   ├── middlewares/   # Auth, error handling
│   │   └── utils/         # Helper functions
│   ├── .env               # Environment variables
│   └── package.json
│
└── README.md
```

---

## 🔑 API Endpoints

### **Authentication**
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user

### **Rooms**
- `GET /api/v1/rooms` - Get all rooms (with filters)
- `GET /api/v1/rooms/:id` - Get room details
- `POST /api/v1/rooms` - Create room (Owner only)
- `PUT /api/v1/rooms/:id` - Update room (Owner only)
- `DELETE /api/v1/rooms/:id` - Delete room (Owner only)
- `PATCH /api/v1/rooms/:id/status` - Update availability status
- `PUT /api/v1/rooms/review` - Add/Update review

---

## 🎯 Key Features Explained

### **1. Interactive Map Picker**
The map picker allows owners to set precise room locations:
- Uses browser's Geolocation API for current location
- Manual coordinate entry with real-time map preview
- Stores both latitude/longitude and address
- Displays precise coordinates on room details page

### **2. Multi-Step Room Creation**
Organized form flow for better UX:
- **Step 1**: Basic information and contact details
- **Step 2**: Location with map picker and facilities
- **Step 3**: Media uploads and house rules

### **3. Smart Media Management**
- Uploads to Cloudinary for optimized delivery
- Automatically deletes old media when updating
- Supports multiple images and videos
- Image preview before upload

### **4. Review System**
- Prevents owners from reviewing their own rooms
- Allows users to update their reviews
- Calculates average ratings automatically
- Displays review count and individual ratings

---

## 🛡️ Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Environment variable protection

---

## 🎨 Design Philosophy

- **Modern & Premium**: Glassmorphism, gradients, and smooth animations
- **User-Centric**: Intuitive navigation and clear call-to-actions
- **Responsive**: Mobile-first design approach
- **Accessible**: Semantic HTML and ARIA labels
- **Performance**: Optimized images and lazy loading

---

## 🐛 Known Issues & Future Enhancements

### **Future Features:**
- [ ] Advanced search with map view
- [ ] Booking system with calendar
- [ ] Payment integration
- [ ] Chat system between seekers and owners
- [ ] Email notifications
- [ ] Favorite/Wishlist functionality
- [ ] Admin dashboard for approval system
- [ ] Advanced analytics for owners

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

Built with ❤️ by **Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Google Maps for location services
- Cloudinary for media hosting
- Lucide React for beautiful icons
- TailwindCSS for styling utilities

---

**Happy Room Hunting! 🏡**

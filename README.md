# Skyroute-app

SkyRoute is a full-stack travel platform that allows users to explore destinations, organize them by categories, and interact through ratings and comments. Users can also save their favorite places for quick access later.

---

## Features

- Browse destinations by categories.
- Add and manage places related to categories.
- Rate and comment on places.
- Save favorite places.
- Authentication with JWT.
- Organized full-stack architecture.

---

## Built With

### Frontend
<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" height="30"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" height="30"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" height="30"/>
</div>

### Backend
<div align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" height="30"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" height="30"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" height="30"/>
</div>

---

## ⚙️ Installation

### Backend Setup

1. Go to the backend folder:
```console
cd BackEnd
```
2. Create `.env` file:
```bash
JWT_SECRET=your_secret_signature_for_JWT  
DB_PASSWORD=your_mysql_password  
PORT=8080  
```

4. Run the backend:
```console
mvn spring-boot:run
```

### Frontend Setup

1. Go to the frontend folder:

```console
cd FrontEnd
```

3. Install dependencies:
```console
npm install
```

3. Create `.env` file:
```bash
VITE_API_URL=http://localhost:8080/api  
VITE_IMG_URL=http://localhost:8080  
```

5. Run the frontend:

npm run dev

---

## Project Structure

SkyRoute/  
│  
├── FrontEnd/ # React application  
├── BackEnd/ # Spring Boot API  
│  
└── README.md  

---

## Authors

- GitHub: https://github.com/Aldo-Solares
- GitHub: https://github.com/Emilio-806
  
---

## 📄 License

This project is licensed under the MIT License.



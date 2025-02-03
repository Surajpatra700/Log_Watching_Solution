  ```markdown
# Real-Time Log Viewer  

A simple real-time log viewer using **Node.js**, **Express**, and **Socket.io**.

## Installation  

1. **Clone the repository**  
   ```sh
   git clone <repo-url>
   cd <repo-name>
   ```

2. **Install dependencies**  
   ```sh
   npm install socket.io fs http express
   ```

3. **Install Nodemon for real-time debugging**  
   ```sh
   npm install --save-dev nodemon
   ```

## Running the Server  

Start the backend server:  
```sh
npm run dev  # Runs using nodemon  
```
Or, manually start it:  
```sh
node server.js
```

## Project Structure  

```
root  
│_ public/  
│   ├─ index.html  
│_ .gitignore  
│_ logfile.log  
│_ package-lock.json  
│_ package.json  
│_ server.js  # Backend Server  
```

## Usage  

- Open **`http://localhost:5000`** in a browser.  
- Logs will be displayed and updated in real time.  

---

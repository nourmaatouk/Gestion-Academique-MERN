const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuration des services
const services = {
  auth: 'http://localhost:3001',
  users: 'http://localhost:3002',
  courses: 'http://localhost:3003',
  grades: 'http://localhost:3004'
};

// Fonction pour forwarder les requêtes
const forwardRequest = (req, res, serviceUrl) => {
  const options = {
    hostname: 'localhost',
    port: serviceUrl.split(':')[2],
    path: req.originalUrl,
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': req.headers.authorization || ''
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    let data = '';
    proxyRes.on('data', (chunk) => data += chunk);
    proxyRes.on('end', () => {
      try {
        const jsonData = data ? JSON.parse(data) : {};
        res.status(proxyRes.statusCode).json(jsonData);
      } catch (e) {
        res.status(500).json({ error: 'Invalid JSON response' });
      }
    });
  });

  proxyReq.on('error', (err) => {
    res.status(502).json({ error: 'Service unavailable', service: serviceUrl });
  });

  if (req.body && Object.keys(req.body).length > 0) {
    proxyReq.write(JSON.stringify(req.body));
  }
  
  proxyReq.end();
};

// ✅ ROUTES COMPLÈTES POUR TOUS LES TESTS

// AUTH
app.post('/api/auth/register', (req, res) => forwardRequest(req, res, services.auth));
app.post('/api/auth/login', (req, res) => forwardRequest(req, res, services.auth));
app.get('/api/auth/verify', (req, res) => forwardRequest(req, res, services.auth));

// USERS - Profile routes MUST come before :id routes
app.get('/api/users/students/profile', (req, res) => forwardRequest(req, res, services.users));
app.get('/api/users/teachers/profile', (req, res) => forwardRequest(req, res, services.users));

app.get('/api/users/students', (req, res) => forwardRequest(req, res, services.users));
app.post('/api/users/students', (req, res) => forwardRequest(req, res, services.users));
app.get('/api/users/students/:id', (req, res) => forwardRequest(req, res, services.users));
app.patch('/api/users/students/:id', (req, res) => forwardRequest(req, res, services.users));
app.delete('/api/users/students/:id', (req, res) => forwardRequest(req, res, services.users));

app.get('/api/users/teachers', (req, res) => forwardRequest(req, res, services.users));
app.post('/api/users/teachers', (req, res) => forwardRequest(req, res, services.users));
app.get('/api/users/teachers/:id', (req, res) => forwardRequest(req, res, services.users));
app.patch('/api/users/teachers/:id', (req, res) => forwardRequest(req, res, services.users));
app.delete('/api/users/teachers/:id', (req, res) => forwardRequest(req, res, services.users));

// COURSES
app.get('/api/courses/courses', (req, res) => forwardRequest(req, res, services.courses));
app.post('/api/courses/courses', (req, res) => forwardRequest(req, res, services.courses));
app.get('/api/courses/courses/:id', (req, res) => forwardRequest(req, res, services.courses));
app.patch('/api/courses/courses/:id', (req, res) => forwardRequest(req, res, services.courses));
app.delete('/api/courses/courses/:id', (req, res) => forwardRequest(req, res, services.courses));

app.get('/api/courses/departments', (req, res) => forwardRequest(req, res, services.courses));
app.post('/api/courses/departments', (req, res) => forwardRequest(req, res, services.courses));
app.patch('/api/courses/departments/:id', (req, res) => forwardRequest(req, res, services.courses));
app.delete('/api/courses/departments/:id', (req, res) => forwardRequest(req, res, services.courses));

app.get('/api/courses/enrollments', (req, res) => forwardRequest(req, res, services.courses));
app.post('/api/courses/enrollments', (req, res) => forwardRequest(req, res, services.courses));
app.get('/api/courses/enrollments/student/:studentId', (req, res) => forwardRequest(req, res, services.courses));
app.get('/api/courses/enrollments/course/:courseId', (req, res) => forwardRequest(req, res, services.courses));
app.patch('/api/courses/enrollments/:enrollmentId', (req, res) => forwardRequest(req, res, services.courses));
app.delete('/api/courses/enrollments/:enrollmentId', (req, res) => forwardRequest(req, res, services.courses));

app.get('/api/courses/assignments', (req, res) => forwardRequest(req, res, services.courses));
app.post('/api/courses/assignments', (req, res) => forwardRequest(req, res, services.courses));
app.get('/api/courses/assignments/teacher/:teacherId', (req, res) => forwardRequest(req, res, services.courses));
app.patch('/api/courses/assignments/:id', (req, res) => forwardRequest(req, res, services.courses));
app.delete('/api/courses/assignments/:id', (req, res) => forwardRequest(req, res, services.courses));

// GRADES
app.patch('/api/grades/update', (req, res) => forwardRequest(req, res, services.grades));
app.get('/api/grades/student/:studentId', (req, res) => forwardRequest(req, res, services.grades));
app.get('/api/grades/course/:courseId', (req, res) => forwardRequest(req, res, services.grades));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'API Gateway with all routes',
    services: Object.keys(services),
    routes: [
      'GET  /api/health',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET  /api/users/students',
      'POST /api/users/students',
      'POST /api/courses/courses',
      'POST /api/courses/assignments',
      'PATCH /api/courses/enrollments/:id',
      'PATCH /api/grades/update'
    ]
  });
});

// Route catch-all
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    tip: 'Use GET /api/health to see all available routes'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Gateway with ALL routes on port ${PORT}`);
  console.log('✅ Toutes les routes de test sont configurées!');
});
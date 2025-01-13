import 'dotenv/config'; 
import express from 'express'; 
import cors from 'cors'; 
import bodyParser from 'body-parser'; 
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

const __dirname = path.dirname(new URL(import.meta.url).pathname).slice(1);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname, 'public')))

// Catch-all route for debugging purposes
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`); // Log the HTTP method and URL
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Import routes
import contactRoutes from './routes/contactRoutes.js';
app.use('/api/phonebooks', contactRoutes(PORT));

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Default export of the app instance
export default app;

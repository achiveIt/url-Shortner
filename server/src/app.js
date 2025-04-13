import express from 'express'
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoute.js';
import bodyParser from 'body-parser';
import linkRoutes from './routes/linkRoute.js'
import redirectRoutes from './routes/redirectRoute.js'
import qrRoutes from './routes/qrRoute.js';
import analyticsRoutes from './routes/analyticsRoute.js'
import cors from 'cors'

const app = express();
const corsOptions = {
    origin: 'https://url-shortner-rouge-six.vercel.app/',
    methods: ['GET', 'POST', 'PUT', 'PATCH'], 
    credentials: true,               
  };

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json({limit:"16kb"}));


app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/', redirectRoutes);
app.use('/api/qr', qrRoutes);
app.use('/api/analytics', analyticsRoutes);

export {app}
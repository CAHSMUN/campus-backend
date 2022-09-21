// const dotenv = require('dotenv');
// dotenv.config();

const express = require('express');
var cors = require('cors');
const app = express();
const mongoose = require('mongoose');

// dev purposes
mongoose.set('debug', true);

const authRoute = require('./routes/auth');
const delegatesRoute = require('./routes/delegates');
const sponsorsRoute = require('./routes/sponsors');
const committeesRoute = require('./routes/committees');
const schoolsRoute = require('./routes/schools');
const secretariatRoute = require('./routes/secretariat');
const exportRoute = require('./routes/export');
const endpointRoute = require('./routes/endpoint')

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

// set app settings
app.options('*', cors());
app.use(cors());
app.use(express.json());

// connect routes
app.use('/auth', authRoute);
app.use('/delegates', delegatesRoute);
app.use('/sponsors', sponsorsRoute);
app.use('/committees', committeesRoute);
app.use('/schools', schoolsRoute);
app.use('/secretariat', secretariatRoute);
app.use('/export', exportRoute);
app.use('/listener', endpointRoute);

// start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}! (CORS-enabled)`)
});
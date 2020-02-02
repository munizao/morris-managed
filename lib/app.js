const cors = require('cors');
const cookieParser = require('cookie-parser');
const Competency = require('./models/Competency');
const Dance = require('./models/Dance');
const DancePerformance = require('./models/DancePerformance');
const Dancer = require('./models/Dancer');
const Gig = require('./models/Gig');
const Team = require('./models/Team');

const express = require('express');
const app = express();

app.use(cors({ credentials: true, origin:['http://localhost:7891', 'https://jolly-torvalds-850581.netlify.com/'] })); //TODO: add deployed site as origin
app.use(express.json());
app.use(cookieParser());
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/competencies', require('./routes/crud')(Competency));
app.use('/api/v1/dances', require('./routes/crud')(Dance));
app.use('/api/v1/dance-performances', require('./routes/crud')(DancePerformance));
app.use('/api/v1/dancers', require('./routes/crud')(Dancer));
app.use('/api/v1/gigs', require('./routes/crud')(Gig));
app.use('/api/v1/teams', require('./routes/crud')(Team));


app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;

const Competency = require('./models/Competency');
const Dance = require('./models/Dance');
const DancePerformance = require('./models/DancePerformance');
const Dancer = require('./models/Dancer');
const Gig = require('./models/Gig');


const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/v1/competencies', require('./routes/crud')(Competency, 'dance'));
app.use('/api/v1/dances', require('./routes/crud')(Dance));
app.use('/api/v1/dance-performances', require('./routes/crud')(DancePerformance, 'dance dancers'));
app.use('/api/v1/dancers', require('./routes/crud')(Dancer, 'competencies'));
app.use('/api/v1/gigs', require('./routes/crud')(Gig, 'dancePerformances dancers'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;

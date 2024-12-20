const express = require('express');
const app = express();
const hospitalRoutes = require('./router/hospitalRoutes'); 


app.use(express.json()); 


app.use('/api/hospitals', hospitalRoutes);


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

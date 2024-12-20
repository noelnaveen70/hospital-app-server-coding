const express = require('express');
const fs = require('fs').promises; 
const path = require('path');

const router = express.Router();


const dataPath = path.join(__dirname, '../bacis.json');


const readData = async () => {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data); 
  } catch (error) {
    throw new Error('Error reading the data from file');
  }
};


const writeData = async (data) => {
  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    throw new Error('Error writing data to file');
  }
};


router.get('/', async (req, res) => {
  try {
    const hospitals = await readData();
    res.json(hospitals); 
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.get('/:name', async (req, res) => {
  try {
    const hospitals = await readData();
    const hospital = hospitals.find(h => h.hospital_name.toLowerCase() === req.params.name.toLowerCase());
    if (hospital) {
      res.json(hospital); 
    } else {
      res.status(404).send('Hospital not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.post('/', async (req, res) => {
  try {
    const hospitals = await readData();
    const newHospital = req.body; 
    hospitals.push(newHospital); 
    await writeData(hospitals); 
    res.status(201).json(newHospital); 
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.put('/:name', async (req, res) => {
  try {
    const hospitals = await readData();
    const hospitalIndex = hospitals.findIndex(h => h.hospital_name.toLowerCase() === req.params.name.toLowerCase());

    if (hospitalIndex !== -1) {
      const updatedHospital = req.body;
      hospitals[hospitalIndex] = { ...hospitals[hospitalIndex], ...updatedHospital }; 
      await writeData(hospitals);
      res.json(hospitals[hospitalIndex]); 
    } else {
      res.status(404).send('Hospital not found');
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});


router.delete('/:name', async (req, res) => {
  try {
    let hospitals = await readData();
    hospitals = hospitals.filter(h => h.hospital_name.toLowerCase() !== req.params.name.toLowerCase());

    if (hospitals.length === 0) {
      res.status(404).send('Hospital not found');
    } else {
      await writeData(hospitals);
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;

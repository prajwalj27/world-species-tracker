const { google } = require('googleapis');
const express = require('express');
require('dotenv').config();
const app = express();

let sheets;

const setup = async () => {
  const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets'] });

  sheets = google.sheets({ version: 'v4', auth });
}

app.use(express.json());


app.get('/species', async (req, res) => {
	const rangeSpecies = `Sheet1!A2:J`;

	const response = await Promise.all([
		sheets.spreadsheets.values.get({
			spreadsheetId: process.env.SHEET_ID,
			range: rangeSpecies,
		}),
	]);

	const speciesResponse = response[0].data.values;
	var speciesData = speciesResponse.map(function(x) { 
	  return { 
		_id: x[0],
		name: x[1], 
		scientificName: x[2], 
		conservationStatus: x[3],
		population: x[4],
		height: x[5],
		weight: x[6],
		length: x[7], 
		places: x[8],
		description: x[9] 
	  }; 
	});
	// for (let i = 0; i < speciesData.length; i++) {
	// 	if (speciesData[i].conservationStatus.toLowerCase() === 'vulnerable')
	// 		console.log(speciesData[i].name)
	// }
	res.send(speciesData);
});


app.get('/', (req, res) => {
	res.send('Successful response.');
});
app.listen(process.env.PORT || 8000, () => {
	setup();
	console.log(`Server is listening on port ${process.env.PORT || 8000}`);
});
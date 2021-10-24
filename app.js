const { google } = require('googleapis');
const express = require('express');
const ejs = require('ejs');
const app = express();


require('dotenv').config();
app.set("view engine", "ejs");

let sheets;

const setup = async () => {
	const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets'] });

	sheets = google.sheets({ version: 'v4', auth });
}

const getData = async () => {
	const rangeSpecies = `Sheet1!A2:K`;
	try {
		const response = await Promise.all([
			sheets.spreadsheets.values.get({
				spreadsheetId: process.env.SHEET_ID,
				range: rangeSpecies,
			}),
		]);

		const speciesResponse = response[0].data.values;
		var speciesData = speciesResponse.map(function (x) {
			return {
				_id: x[0],
				name: x[1],
				scientificName: x[2],
				conservationStatus: x[3],
				order: x[4],
				population: x[5],
				height: x[6],
				weight: x[7],
				length: x[8],
				places: x[9],
				description: x[10]
			};
		});
		return speciesData;
	} catch (e) {
		console.log(e);
	}


}

app.use(express.json());
app.use(express.static('public'));

app.get('/vulnerable', (req, res) => {
	const status = 'vulnerable';
	let selectedData = [];

	const data = getData();
	data.then((result) => {
		for (let i = 0; i < result.length; i++) {
			if (result[i].conservationStatus) {
				if (result[i].conservationStatus.toLowerCase() === status) {
					selectedData[i] = result[i];
				}
			}
		}
		res.render("explore", { result: selectedData, status: "Vulnerable" });
	})
});

app.get('/endangered', (req, res) => {
	const status = 'endangered';
	let selectedData = [];

	const data = getData();
	data.then((result) => {
		for (let i = 0; i < result.length; i++) {
			if (result[i].conservationStatus) {
				if (result[i].conservationStatus.toLowerCase() === status) {
					selectedData[i] = result[i];
				}
			}
		}
		res.render("explore", { result: selectedData, status: "Endangered" });
	})
});

app.get('/near-threatened', (req, res) => {
	const status = 'near threatened';
	let selectedData = [];

	const data = getData();
	data.then((result) => {
		for (let i = 0; i < result.length; i++) {
			if (result[i].conservationStatus) {
				if (result[i].conservationStatus.toLowerCase() === status) {
					selectedData[i] = result[i];
				}
			}
		}
		res.render("explore", { result: selectedData, status: "Near Threatened" });
	})
});

app.get('/least-concern', (req, res) => {
	const status = 'least concern';
	let selectedData = [];

	const data = getData();
	data.then((result) => {
		for (let i = 0; i < result.length; i++) {
			if (result[i].conservationStatus) {
				if (result[i].conservationStatus.toLowerCase() === status) {
					selectedData[i] = result[i];
				}
			}
		}
		res.render("explore", { result: selectedData, status: "Least Concern" });
	})
});

app.get('/critically-endangered', (req, res) => {
	const status = 'critically endangered'
	let selectedData = [];

	const data = getData();
	data.then((result) => {
		for (let i = 0; i < result.length; i++) {
			if (result[i].conservationStatus) {
				if (result[i].conservationStatus.toLowerCase() === status) {
					selectedData[i] = result[i];
				}
			}
		}
		res.render("explore", { result: selectedData, status: "Critically Endangered" });
	})
});

app.get('/explore', (req, res) => {
	const data = getData();
	data.then(function (result) {
		res.render("explore", { result: result, status: "All" });
	})
});

app.get('/:id', (req, res) => {
	const data = getData();
	data.then(function (result) {
		res.render("info", { result: result, _id: req.params.id });
	})
});

app.get("/", (req, res) => {
	res.render("index");
});


app.listen(process.env.PORT || 8080, () => {
	setup();
	console.log(`Server is listening on port ${process.env.PORT || 8080}`);
});
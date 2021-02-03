import express from 'express'
import { sequelize } from './sequelize'

import { IndexRouter } from './controllers/v0/index.router'

import bodyParser from 'body-parser'

import { V0MODELS } from './controllers/v0/model.index'

(async () => {
	// import all models
  await sequelize.addModels(V0MODELS);
  // this will allow us to make sure that our database is in
  // sync with out expected models within sequelize
  // if sequelize and our data stores are not currently aligned
  // then we'll have some issues when we're trying to provide that
  // interface between what our data looks like in the table and
  // what our data looks like within our objects.
  // migrations work in order of time: look the
  // name of the file in the migrations folder


	// if you want sequelize to automatically create the table (or modify it as needed) according to your model definition, you can use the sync method, as below. It will automatically sync all models.
	await sequelize.sync();

	const app = express();
	const port = process.env.PORT || 8080 // default port to listen

	// app.use() function is used to mount the specified middleware function(s) at the path which is being specified.
	// app.use(path, callback)
	app.use(bodyParser.json())

	//CORS Should be restricted
	app.use(function (req, res, next) {
		res.header('Access-Control-Allow-Origin', 'http://localhost:8100')
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept, Authorization'
		)
		next()
	})

	// it tells our application will use this IndexRouter when
	// it encounters the base endpoint /api/v0/
	// the IndexRouter will have the additional code to execute
	// when we reach this endpoint
	app.use('/api/v0/', IndexRouter)

	// Root URI call: returns this answer showing how to start the requests.
	app.get('/', async (req, res) => {
		res.send('/api/v0/')
	})

	// Start the Server
	app.listen(port, () => {
		console.log(`server running http://localhost:${port}`)
		console.log(`press CTRL+C to stop server`)
	})
})()

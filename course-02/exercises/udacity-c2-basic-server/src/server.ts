import express, { Router, Request, Response } from 'express'
import bodyParser from 'body-parser'

import { Car, cars as cars_list } from './cars'
import { RSA_NO_PADDING } from 'constants'
;(async () => {
	let cars: Car[] = cars_list

	//Create an express applicaiton
	const app = express()
	//default port to listen
	const port = 8082

	//use middleware so post bodies
	//are accessable as req.body.{{variable}}
	app.use(bodyParser.json())

	// Root URI call
	// the app intercept a get request at root level ("/")
	// uses a function to understand how to handle this request.
	// it takes two inputs: one of the type Request and another of the
	// type response

	app.get('/', (req: Request, res: Response) => {
		// we use the response object to return a status of 200
		// and send a message to the client
		res.status(200).send('Welcome to the Cloud!')
	})

	// Get a greeting to a specific person
	// to demonstrate routing parameters
	// > try it {{host}}/persons/:the_name
	app.get('/persons/:name', (req: Request, res: Response) => {
		//we can access to this parameter by simpling destructing the received parameter
		//it just unpack the variables in req.params into the name variable
		let { name } = req.params

		if (!name) {
			return res.status(400).send(`name is required`)
		}

		return res.status(200).send(`Welcome to the Cloud, ${name}!`)
	})

	// just another way to to do.
	// just add in postman another request format as:
	// http://localhost:8082/persons/?name=Marcelo
	// Get a greeting to a specific person to demonstrate req.query
	// > try it {{host}}/persons?name=the_name
	app.get('/persons/', (req: Request, res: Response) => {
		let { name } = req.query

		if (!name) {
			return res.status(400).send(`name is required`)
		}

		return res.status(200).send(`Welcome to the Cloud, ${name}!`)
	})

	// Post a greeting to a specific person
	// to demonstrate req.body
	// > try it by posting {"name": "the_name" } as
	// an application/json body to {{host}}/persons
	app.post('/persons', async (req: Request, res: Response) => {
		const { name } = req.body

		if (!name) {
			return res.status(400).send(`name is required`)
		}

		return res.status(200).send(`Welcome to the Cloud, ${name}!`)
	})

	// @TODO Add an endpoint to GET a list of cars
	// it should be filterable by make with a query paramater
	app.get('/cars/', (req: Request, res: Response) => {
		// destruct our query parameters
		const { make } = req.query
		let cars_list = cars

		// if we have an otional query parameter, filter by it
		if (make) {
			cars_list = cars.filter((car) => car.make === make)
		}

		return res.status(200).send(cars_list)
	})

	// @TODO Add an endpoint to get a specific car
	// it should require id
	// it should fail gracefully if no matching car is found
	app.get('/cars/:id', (req: Request, res: Response) => {
		const { id } = req.params

		if (id < 0 || id > cars.length || !id) {
			return res
				.status(400)
				.send('Please, add a valida id between 0 and ' + cars.length)
		} else {
			//another way to do without using filter.
			return res.status(200).send(cars[id])
		}
	})

	/// @TODO Add an endpoint to post a new car to our list
	// it should require id, type, model, and cost
	app.post('/cars', (req: Request, res: Response) => {
		// destruct our body payload for our variables
		const { make, type, model, cost } = req.body

		if (!make || !type || !model || !cost) {
			return res.status(400).send('please, send all parameters')
		} else {
			const addNewCar = {
				make: make,
				type: type,
				model: model,
				cost: cost,
				id: cars.length,
			}
			cars.push(addNewCar)
			return res.status(201).send(addNewCar)
		}
	})

	// Start the Server
	app.listen(port, () => {
		console.log(`server running http://localhost:${port}`)
		console.log(`press CTRL+C to stop server`)
	})
})()

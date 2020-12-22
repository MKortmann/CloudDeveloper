export const config = {
	"dev": {
			"username": process.env.POSTGRESS_USERNAME,
			"password": process.env.POSTGRESS_PASSWORD,
			"database": process.env.POSTGRESS_DATABASE,
			"host": process.env.POSTGRESS_HOST,
			"dialect": "postgress",
			"aws_region": process.env.AWS_REGION,
			"aws_profile": process.env.AWS_PROFILE,
			"aws_media_bucket": process.env.AWS_MEDIA_BUCKET,
			"version": 'v4'
	}
	// dev: {
	// 	username: 'dbkudagram',
	// 	password: 'szyjlowyJxK3PSsXVR1L',
	// 	database: 'dbkudagram',
	// 	host: 'dbkudagram.c1mqxrxl899w.eu-central-1.rds.amazonaws.com',
	// 	dialect: 'postgres',
	// 	aws_region: 'eu-central-1',
	// 	aws_profile: 'default',
	// 	aws_media_bucket: 'dbkudagram-dev',
	// 	version: 'v4'
	// },
	// prod: {
	// 	username: '',
	// 	password: '',
	// 	database: 'udagram_prod',
	// 	host: '',
	// 	dialect: 'postgres',
	// },
}

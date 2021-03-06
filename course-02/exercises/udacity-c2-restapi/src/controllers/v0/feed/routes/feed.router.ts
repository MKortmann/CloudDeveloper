import { Router, Request, Response } from 'express';
import { FeedItem } from '../models/FeedItem';
import { requireAuth } from '../../users/routes/auth.router';
import * as AWS from '../../../../aws';

const router: Router = Router();

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    // we get our items from the database using sequelize.
    // findAndCountAll method is a convenience method that combines findAll and count.
    const items = await FeedItem.findAndCountAll({order: [['id', 'ASC']]});
    console.log(items);
    // then we map our data in the db with the signedURL
    items.rows.map((item) => {
            if(item.url) {
                //this is taking our key of the database (item.url)
                //and try to get an url from S3 so we can access that
                //resource directly from our client.
                item.url = AWS.getGetSignedUrl(item.url);
            }
    });

    console.log(items);

    res.send(items);
});

//@TODO
//Add an endpoint to GET a specific resource by Primary Key
//We will use the SQL interface to find that record
//We will do some validation to make sure that there is an
//id present, and return that to the user in a sensible data payload.
router.get('/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const item = await FeedItem.findByPk(id);

    if(!item) {
        return res.status(400).send(`The id is not valid or there is no item with this id`);
    }

    res.status(200).send(item);

})

// update a specific resource that exist already in the database, let's use SQL Eyes to help us accomplish this task
router.patch('/:id',
    requireAuth,
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const caption = req.body.caption;
        const url = req.body.url;

        let item = await FeedItem.findByPk(id);

        // check Caption is valid
        if (!caption) {
            return res.status(400).send({ message: 'Caption is missing or malformed' });
        }

        // // check Filename is valid
        if (!url) {
            return res.status(400).send({ message: 'File url is required' });
        }

        const objToReplace = {
            caption,
            url
        }

        const patchItem = await item.update(objToReplace, {where: { id: id}});

        res.status(200).send(patchItem)
});


// Get a signed url to put a new item in the bucket - so, as soon as I get this url, I can upload a item to the bucket without authorization. This link will be valid in my case, that I set, to 5*60 = 5 minutes.
router.get('/signed-url/:fileName',

    async (req: Request, res: Response) => {
    let { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({url: url});
});

// Post meta data and the filename after a file is uploaded
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
// requireAuth means that it will be a protect endpoint
router.post('/',
    requireAuth,
    async (req: Request, res: Response) => {
    const caption = req.body.caption;
    const fileName = req.body.url;

    // check Caption is valid
    if (!caption) {
        return res.status(400).send({ message: 'Caption is required or malformed' });
    }

    // check Filename is valid
    if (!fileName) {
        return res.status(400).send({ message: 'File url is required' });
    }

    const item = await new FeedItem({
            caption: caption,
            url: fileName
    });

    const saved_item = await item.save();

    // here we use our sequlize interface to save our item
    saved_item.url = AWS.getGetSignedUrl(saved_item.url);
    res.status(201).send(saved_item);
});

export const FeedRouter: Router = router;
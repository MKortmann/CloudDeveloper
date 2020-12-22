import { Router, Request, Response } from 'express';
import { FeedItem } from '../models/FeedItem';
import { requireAuth } from '../../users/routes/auth.router';
import * as AWS from '../../../../aws';

const router: Router = Router();

// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
    items.rows.map((item) => {
            if(item.url) {
                //this is taking our key of the databas e (item.url)
                //and try to get an url from S3 so we can access that
                //resource directly from our client.
                item.url = AWS.getGetSignedUrl(item.url);
            }
    });
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
            return res.status(400).send({ message: 'Caption is required or malformed' });
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


// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName',
    requireAuth,
    async (req: Request, res: Response) => {
    let { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({url: url});
});

// Post meta data and the filename after a file is uploaded
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
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

    saved_item.url = AWS.getGetSignedUrl(saved_item.url);
    res.status(201).send(saved_item);
});

export const FeedRouter: Router = router;
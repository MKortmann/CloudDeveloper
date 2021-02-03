import { Router, Request, Response } from 'express';
import { FeedRouter } from './feed/routes/feed.router';
import { UserRouter } from './users/routes/user.router';

// router is imported from express
const router: Router = Router();

// we say the router that if the path is: /feed, use the FeedRouter
router.use('/feed', FeedRouter);
// we say the router if the path is: /users, use the UserRouter
router.use('/users', UserRouter);

// and if it is '/', send `V0`
// so, it is in fact: '/api/v0/' because we call the IndexRouter as this: 	app.use('/api/v0/', IndexRouter)
router.get('/', async (req: Request, res: Response) => {
    res.send(`V0`);
});

export const IndexRouter: Router = router;
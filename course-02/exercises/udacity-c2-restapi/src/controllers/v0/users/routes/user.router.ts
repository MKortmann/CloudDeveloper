import { Router, Request, Response } from 'express';

import { User } from '../models/User';
import { AuthRouter, requireAuth } from './auth.router';

const router: Router = Router();

router.use('/auth', AuthRouter);

// we do not need the method below because it is implemented in the '/auth'
router.get('/', async (req: Request, res: Response) => {
    res.send('auth')
});

router.get('/:email', async (req: Request, res: Response) => {
    let { email } = req.params;
    console.log(`id is: ${email}`)
    const user = await User.findOne({
        where: {
            email: email
        }
    });
    res.status(200).send({user: user, message: 'returning user'});
});

export const UserRouter: Router = router;
import { Request, Response } from 'express';
import { app } from './src/configs/app';

const PORT = process.env.PORT;

app.get('/', (req: Request, res: Response) => {
    res.send(`Express + TypeScript Server started running at ${new Date()}`);
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});
import { Request, Response } from 'express';
import app from './src/configs/app';
import Logger from './src/utils/Logger';

const PORT = process.env.PORT;

app.listen(PORT, () => {
    Logger.info(`App listening on port ${PORT}`);
});
import http from 'http'
import dotenv from 'dotenv'
dotenv.config();

import app from './app';

const server=http.createServer(app);

server.listen(process.env.PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${process.env.PORT}`)
})
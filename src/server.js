import http from 'http';

import app from './app.js';

const PORT = 3000;

export const bootstrap = ()=>{
    const server = http.createServer(app);

    server.listen(PORT,()=>{
        console.log(`Server is running on http:localhost:${PORT}`);
    })
}
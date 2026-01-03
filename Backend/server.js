
const http = require('http');
const fs = require('fs');
const path = require('path');
const { StringDecoder } = require('string_decoder');

const server = http.createServer(async (req, res) => {
    console.log(`${req.method} ${req.url}`);
    
    if (req.url === '/' && req.method === 'GET') {
        
        const filePath = path.join(__dirname, '..', 'Frontend', 'index.html');
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Server Error: Cannot find index.html. Looking at: ' + filePath);
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }
    
    else if (req.url === '/api/payment' && req.method === 'POST') {
        const decoder = new StringDecoder('utf-8');
        let buffer = '';
        
        req.on('data', (data) => {
            buffer += decoder.write(data);
        });
        
        req.on('end', () => {
            buffer += decoder.end();
            
            try {
                const body = JSON.parse(buffer);
                console.log('Received:', body);
                
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'  
                });
                res.end(JSON.stringify({ 
                    success: true, 
                    message: 'Payment would be processed here',
                    receivedData: body 
                }));
                
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
    }
    
    
    else if (req.url === '/favicon.ico') {
        res.writeHead(204);  
        res.end();
    }
    
   
    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(3000, () => {
    console.log('Pure Node.js server learning on http://localhost:3000');
    console.log('Try:');
    console.log('  GET  http://localhost:3000/');
    console.log('  POST http://localhost:3000/api/payment');
    
   
});
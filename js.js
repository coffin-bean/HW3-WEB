const http = require('http');
const fs = require('fs').promises;
const url = require('url');
const querystring = require('querystring');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    const { pathname, query } = url.parse(req.url, true);

    if (req.method === 'GET' && pathname === '/') {
        try {
            const files = await fs.readdir('.');
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end(files.join('\n'));
        } catch (err) {
            res.statusCode = 500;
            res.end(`Error: ${err.message}`);
        }
    } else if (req.method === 'GET' && pathname !== '/') {
        try {
            const content = await fs.readFile(pathname.slice(1), 'utf-8');
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            res.end(content);
        } catch (err) {
            res.statusCode = 404;
            res.end(`File not found: ${pathname.slice(1)}`);
        }
    } else if (req.method === 'HEAD' && pathname !== '/') {
        try {
            const stat = await fs.stat(pathname.slice(1));
            res.setHeader('Content-Length', stat.size);
            res.end();
        } catch (err) {
            res.statusCode = 404;
            res.end(`File not found: ${pathname.slice(1)}`);
        }
    } else if (req.method === 'PUT' && pathname !== '/') {
        try {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                await fs.writeFile(pathname.slice(1), body);
                res.statusCode = 200;
                res.end();
            });
        } catch (err) {
            res.statusCode = 500;
            res.end(`Error: ${err.message}`);
        }
    } else if (req.method === 'PATCH' && pathname !== '/') {
        try {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                await fs.appendFile(pathname.slice(1), body);
                res.statusCode = 200;
                res.end();
            });
        } catch (err) {
            res.statusCode = 500;
            res.end(`Error: ${err.message}`);
        }
    } else if (req.method === 'DELETE' && pathname !== '/') {
        try {
            await fs.unlink(pathname.slice(1));
            res.statusCode = 200;
            res.end();
        } catch (err) {
            res.statusCode = 404;
            res.end(`File not found: ${pathname.slice(1)}`);
        }
    } else {
        res.statusCode = 400;
        res.end('Unsupported request');
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

/*
В этом примере я использую модули http, fs.promises, url и querystring.
Я также использую методы HTTP-запросов и пути запросов для определения конечных точек.
Каждый обработчик конечной точки выполняет операции чтения или записи файлов на сервере,
а затем отправляет соответствующий ответ клиенту.
 */

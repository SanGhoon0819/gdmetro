import http from 'node:http';import fs from 'node:fs';import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.join(path.dirname(fileURLToPath(import.meta.url)),'dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.xml':'application/xml','.txt':'text/plain'};
http.createServer((req,res)=>{let file;try{const p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);file=path.resolve(root,'.'+p);if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);return res.end()}if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');if(!fs.existsSync(file)){res.writeHead(404,{'Content-Type':types['.html']});return res.end(fs.readFileSync(path.join(root,'404.html')))}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff'});fs.createReadStream(file).pipe(res)}catch{res.writeHead(400);res.end()}}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173'));


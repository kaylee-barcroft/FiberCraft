#!/usr/bin/env node

const http = require('http')
const fs = require('node:fs');
const { createHmac, randomUUID } = require('node:crypto');

const secret = 'abcdefg';
const hash = (str) => createHmac('sha256', secret).update(str).digest('hex');

let users
fs.readFile('passwd.db', 'utf-8', (err, data) => {
	  if (err) {
		  console.error(err);
		  return;
	  }
	  users = JSON.parse(data)
  })


const dancers = {}

const authenticate = (auth = '') => {
	const [ user, pass ] = atob(auth.slice(6)).split(':')
	return !!user && !!pass && users[user] === hash(pass + user)
}

const handleRequest = (req, res) => {
  const [path, query] = req.url.split('?')
  
  if([ 'POST', 'PUT', 'DELETE' ].includes(req.method)) { //not a get
	//if(!authenticate(req.headers.authorization)) {
	//res.writeHead(401, {
	//	"WWW-Authenticate": "Basic realm='placeholder'"
	//})
	//res.end()
	//} else {
      let uid = query && query.match(/uid=([0-9a-f-]+)/)
	console.log(uid)
      if(req.method === 'DELETE') {
        if(!!uid && uid[1]) { //if there IS a uid
			if(!!dancers[uid[1]]) {
          delete dancers[uid[1]]
          res.writeHead(200).end()
        }} else { //if we couldn't find it
          res.writeHead(400).end()
        }
      } else {
        let body = ''
        req.on('data', (data) => {
          body += data
        })
        req.on('end', () => {
          try {
            const params = JSON.parse(body)
            if(!uid && req.method == 'POST') {
              uid = randomUUID()
              dancers[uid] = params
              res.writeHead(201).end(uid)
            } else if(uid && req.method == 'PUT') {
				if(!!dancers[uid[1]]) {
				dancers[uid[1]] = params
                res.writeHead(200).end()
              } else {
                res.writeHead(404).end()
              }
            } else {
              res.writeHead(400).end()
            }
          } catch {
            res.writeHead(400).end()
          }
        })
      }
    
  } else { // GET method
//TODO: what if there's a UID in the url? grab just that
	let uid = query && query.match(/uid=([0-9a-f-]+)/)
	if(!!uid && uid[1]) {
        const uidValue = uid[1];
        
        if(dancers[uidValue]) { 
            res.writeHead(200, {
                "Content-Type": "application/json"
            });
            res.write(JSON.stringify(dancers[uidValue]));
            res.end();  // Don't forget to end the response
        } else {
            // Handle case where UID doesn't exist
            res.writeHead(404);
            res.end();
        }
    } else { // no UID, return everything
		res.writeHead(200, {
		  "Content-Type": "application/json"
		})
		res.write(JSON.stringify(dancers))
		res.end()
		}
	}
}

const server = http.createServer(handleRequest)
server.listen(3000, '127.0.0.1')

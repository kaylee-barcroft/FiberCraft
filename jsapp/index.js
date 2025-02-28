#!/usr/bin/env node

const http = require('http')
const fs = require('node:fs');
const { createHmac } = require('node:crypto');

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


const dancers = []

const authenticate = (auth = '') => {
	const [ user, pass ] = atob(auth.slice(6)).split(':')
	return !!user && !!pass && users[user] === hash(pass + user)
}

const handleRequest = (req, res) => {
  const [path, query] = req.url.split('?')
  
  if(req.method == "POST") { //POST rules
	if(!authenticate(req.headers.authorization)) {
	res.writeHead(401, {
		"WWW-Authenticate": "Basic realm='placeholder'"
	})
	res.end()
	} else {
 	let body = ''
	req.on('data', (data) => {
		body += data
	})
	
	req.on('end', () => {
		try {
			const params = JSON.parse(body)
			dancers.push(params)
			kbyePost(res)
		} catch {
			res.writeHead(400)
			res.end('Bad Request')
		}
		})
	}
  } else if(req.method == "GET") { //GET rules
	if(query) { // if there are query params... act accordingly
	  const params = Object.fromEntries(query.split('&').map(
		(param) => param.split('=')
	  ))
	  
	  if (params.name) { // matching parameter name (narrowed parameters)
	   const filteredDancers = dancers.filter(dancer => { // create results
          return (params.name && dancer.name === params.name)
        })
		if(filteredDancers.length > 0) {
			kbye(res, filteredDancers); // return results (narrow)
		} else {noMatch(res)} // 404 if no match found
		
	  } else {
        // Return filtered results by any parameter (expand parameters)
        const filteredDancers = dancers.filter(dancer => { // create results
          return Object.keys(params).some(key => dancer[key] === params[key]);
      })
		
	    if(filteredDancers.length > 0) {
		  kbye(res, filteredDancers) //return results (broad)
	    } else {noMatch(res)} //404 if no match found
	  } 	
	} else { // if there's no query
		kbye(res, dancers)
	}
  } else { //not GET or POST method
		res.writeHead(501)
		res.write(JSON.stringify("Not implemented yet"))
		res.end()
	}
  }
  
  const kbyePost = (res) => {
  res.writeHead(201, {
	"Content-Type": "application/json"
  })
  res.write(JSON.stringify(dancers))
  res.end()
}

  const kbye = (res, data) => {
  res.writeHead(200, {
    "Content-Type": "application/json"
  });
  res.write(JSON.stringify(data));
  res.end();
};

const noMatch = (res) => {
	res.writeHead(404, { "Content-Type": "application/json" })
	res.write(JSON.stringify({ error: "No matching data found" }))
    res.end()
}

const server = http.createServer(handleRequest)
server.listen(3000, '127.0.0.1')

# PupperFit

## A simple pdf http server.

### How it works

Creates a http server that can generate complex pdf pages with full html5/css3 and javascript functionality with lower memory and time.

#### Installation
```bash
    yarn install pupperfit;
    // or 
    npm install pupperfit;
```

#### Running
```bash
    node index.js // Makes it be online on localhost:3001
```

#### Creating pdf 
Do a simple http request with your preferred http client to http://localhost:3001 containing the desired html page.
```bash
    curl -X POST http://localhost:3001 
   -H "Content-Type: text/plain"
   -d 'Hello world :)'  
```



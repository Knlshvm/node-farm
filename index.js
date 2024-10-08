

const fs = require("fs");
const http = require("http");
const url = require("url");

const replaceTemplate = require("./modules/replaceTemplate");
// const { json } = require("stream/consumers");
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const dataObject = JSON.parse(data);



//Blocking, synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);
// const textOut =`This is what we know about the avocado: ${textIn}. \nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// console.log("File Written !");

//Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
//   console.log(data);
// });
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2, "line 19");
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3)=> {
//         console.log(data3);
//         fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//             console.log("Your file has been written");
//         })
//     })
//   });
// });
// console.log("file written");

//server

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //overview page
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "content-type": "text/html",
    });
    const cardsHtml = dataObject.map((el) => replaceTemplate(tempCard, el)).join("");
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    //product page
  }  else if (pathname === "/product") {
    const product = dataObject.find((p) => p.id === Number(query.id));
    if (product) {
      const output = replaceTemplate(tempProduct, product);
      res.writeHead(200, {
        "content-type": "text/html",
      });
      res.end(output);
    } else {
      res.writeHead(404, {
        "content-type": "text/html",
      });
      res.end("<h1>Product not found</h1>");
    }
  
 
    //api page
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "content-type": "application/json",
    });
    res.end(`<h1>${data} </h1>`);
  } else {
    res.writeHead(404, {
      "content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end(`<h1>page not found</h1>`);
  }

  // res.end("hello from the server");
  console.log(req.url);
});
server.listen("8000", "127.0.0.1", () => {
  console.log(
    `connection successful listening on server ${server.address().port}`
  );
});

const axios = require("axios");
const http = require("http");
const url = require("url");
const fs = require("fs");

let readHTML = (title, data, titleData) => {
  let template = fs.readFileSync("template.html", "utf8").toString();
  template = template.replace("{{title}}", title).replace("{{data}}", data).replace("{{id}}", titleData.id).replace("{{nombre}}", titleData.nombre).replace("{{contacto}}", titleData.contacto);
  return template;
};

let showProveedores = async (res) => {
  let data = await axios.get("https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json");
  res.write(readHTML("Listado de Proveedores", JSON.stringify(data.data), { id: "idproveedor", nombre: "nombrecompania", contacto: "nombrecontacto" }));
};

let showClientes = async (res) => {
  let data = await axios.get("https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json");
  res.write(readHTML("Listado de Clientes", JSON.stringify(data.data), { id: "idCliente", nombre: "NombreCompania", contacto: "NombreContacto" }));
};

let unknown = async (res) => {
  res.write(
    '<!DOCTYPE html> <html lang="en"> <head> <meta charset="UTF-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <title>Ruta inválida</title> </head> <body> <h2>Por favor ingresa a una de las siguientes rutas:</h2> <h3><a href="http://localhost:8081/api/proveedores">Lista de proveedores</a></h3> <h3><a href="http://localhost:8081/api/clientes">Lista de clientes</a></h3> </body> </html>'
  );
};

http
  .createServer(async (req, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    if (url.parse(req.url, true).path == "/api/proveedores") await showProveedores(res);
    else if (url.parse(req.url, true).path == "/api/clientes") await showClientes(res);
    else unknown(res);
    res.end();
  })
  .listen(8081);

const express = require("express")
const { Server: HttpServer } = require("http")
const moment = require("moment")
const { Server: IOServer } = require("socket.io")
const fs = require("fs")

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)


app.set('view engine', 'ejs');

app.use(express.static('./public'))

app.use(express.static("public"))





httpServer.listen(8080, () => {
    console.log('Servidor corriendo en http://localhost:8080');
})

const productos = [
    { title: "Ropa", price: 56, thumbnail: "http:bla"},
    { title: "Shampo", price: 100, thumbnail: "http:bla"}
 ];



io.on('connection', function(socket) {
    console.log('Un cliente se ha conectado');

    // ASYNC MENSAJES -----------------------------------------------------------------------
    fs.readFile("./mensajes.txt", "utf-8", (error, contenido) => {
        if(error){

            console.log(error)

        } else {
            let objetoJson = JSON.parse(contenido)
            console.log(objetoJson)
            socket.emit('messages', objetoJson);

            //Agregar Nuevo mensaje
            socket.on('new-message',data => {
            objetoJson.push(data);

            let objetoString = JSON.stringify(objetoJson, null, objetoJson.length);

            fs.writeFile("./mensajes.txt", objetoString, error => {

                if(error) {

                    console.log(error)

                }else{

                    console.log("GUARDADO")
                }


            })


            io.sockets.emit('messages', objetoJson);
            });

        }

    })
    // -----------------------------------------------------------------------

    // ASYNC PRODUCTOS ------------------------------------------------------

    

    /* socket.emit('productos', productos);
    
    //Agregar Nuevo producto
    socket.on('new-productos',data => {
        productos.push(data);
        io.sockets.emit('productos', productos);
    }); */
   
    app.get("/prueba", (req, res) => {

        
        res.render("index.ejs", {productos: productos})
    
    })

    socket.on('new-productos',data => {
        productos.push(data);


        
        io.sockets.emit('productos', productos);
    });
    
});
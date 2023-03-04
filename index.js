var Express = require("express");
var bodyParser = require("body-parser");
const {request, response } = require("express");
var cors = require('cors');
var mysql = require('mysql');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');


dotenv.config();


const buildPath = path.join(__dirname, 'build');
const port = process.env.PORT;

// Creacion conexion a la base de datoscl

var connection =mysql.createConnection({
   host: process.env.HOST,
   user: process.env.MYSQL_USER,
   password: process.env.MYSQL_PASSWORD,
   database: process.env.MYSQL_DATABASE
});


//Creacion instancia de Express
var app = Express();

//Habilita el parseo de las url
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

// Se habilita el puerto del servidor
app.listen(port,()=>{  

        connection.connect(function(err){

            try{
                
                if(err) throw err;
                console.log("Connected to DB");

            }catch(err){

                console.log("No se pudo conectar a la BD.");
                console.log("Error entro en catch: " + err);
        
            }
        
    
        });
   
});


//Get de clientes para dropdown clientes
app.get('/api/clientes/cmblst',(request,response)=> {

    var query = `SELECT ID_CLIENTE idcliente,PRIMER_NOMBRE nombercliente FROM CLIENTES`;

    connection.query(query,function(err, rows,fields){
   
            if(err){

                 response.send('Failed');
                 console.log(err);
            }


        response.send(rows);

    });

});

//Get de tipos de tareas para dropdown tipo tareas
app.get('/api/tipotareas/cmblst',(request,response)=> {

    var query = `SELECT ID_TIPO_TAREA idtipotarea,TIPO_TAREA tipotarea FROM TIPO_TAREA`;
    connection.query(query,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.send(rows);

    });

});

app.get('/api/tareas/grdlst',(request,response)=> {

    var query = `SELECT
                     T.ID_TAREA idtarea
                    ,C.PRIMER_NOMBRE nombrecliente
	                ,TT.TIPO_TAREA tipotarea
	                ,T.FECHA_INICIO fechainicio
	                ,T.PRECIO_TAREA  precio
                    ,COMENTARIO comentario                   
                 FROM CLIENTES C 
	             JOIN TAREAS T 
		            ON C.ID_CLIENTE=T.ID_CLIENTE
                 JOIN TIPO_TAREA TT
		            ON T.ID_TIPO_TAREA=TT.ID_TIPO_TAREA`;

    connection.query(query,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.send(rows);

    });

});

//Agregar nueva tarea
app.post('/api/tareas',(request,response)=> {


    var query = `INSERT INTO TAREAS(ID_TIPO_TAREA,
                                    ID_CLIENTE,
                                    FECHA_INICIO,
                                    FECHA_FIN,
                                    PRECIO_TAREA,
                                    COMENTARIO
                                    ) VALUES(?,?,?,?,?,?);`;
    var values =  [   
        request.body['idtipotarea'],
        request.body['idcliente'],
        request.body['fechainicio'],
        request.body['fechafin'],
        request.body['precio'],
        request.body['comentario']
    ];
    
    connection.query(query,values,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.json('Task Added Success!');

    });

});


// Actualizar tarea existente
app.put('/api/tareas',(request,response)=> {

    var query = `
         UPDATE TAREAS
         SET
            ID_TIPO_TAREA = ?,
            ID_CLIENTE = ?,
            FECHA_INICIO = ?,
            FECHA_FIN = ?,
            PRECIO_TAREA = ?,
            COMENTARIO=?
         WHERE ID_TAREA = ?`;
   
    var values =  [
        request.body['idtipotarea'],
        request.body['idcliente'],
        request.body['fechainicio'],
        request.body['fechafin'],
        request.body['precio'],
        request.body['comentario'],
        request.body['idtarea']
    ];

            connection.query(query,values,function(err, rows,fields){

                    if(err){

                        response.send('Failed');
                        console.log(err);
                    }
                response.json('Task Updataed Successfully!');

            });
});


app.get('*',(request,response)=>{

    response.sendFile(path.join(buildPath,'index.html'));
});














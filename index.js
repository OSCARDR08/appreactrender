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

    var query = `SELECT ID_CLIENTE idcliente
                        ,PRIMER_NOMBRE nombrecliente 
                 FROM CLIENTES`;

    connection.query(query,function(err, rows,fields){
   
            if(err){

                 response.send('Failed');
                 console.log(err);
            }

        response.json(rows);

    });

});


//Get de empleados para dropdown empleados
app.get('/api/empleados/cmblst',(request,response)=>{

    let query =`SELECT ID_EMPLEADO    idemple
                       ,PRIMER_NOMBRE nomemple 
                FROM EMPLEADOS`;

    connection.query(query,function(err, rows,fields){

        if(err){

            console.log('Error');
            response.send('Failed');
        }

       response.json(rows);

    });

});

//Get de tipos de tareas para dropdown tipo tareas
app.get('/api/tipotareas/cmblst',(request,response)=> {

    var query = `SELECT ID_TIPO_TAREA idtipotarea
                       ,TIPO_TAREA tipotarea 
                 FROM TIPO_TAREA`;
    
    connection.query(query,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.json(rows);

    });

});

//Get de tareas para llenar grid
app.get('/api/tareas/grdlst',(request,response)=> {

    var query = `SELECT
                     T.ID_TAREA idtarea
                    ,C.PRIMER_NOMBRE nombrecliente
	                ,TT.TIPO_TAREA tipotarea
	                ,DATE_FORMAT(T.FECHA_INICIO,'%Y-%m-%d') fechainicio
                    ,DATE_FORMAT(T.FECHA_FIN,'%Y-%m-%d') fechafin
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
        response.json(rows);

    });

});

//Get de tareas para llenar grid con filtro
app.get('/api/tareas/grdlst/:id',(request,response)=> {

    var query = `SELECT
                     T.ID_TAREA idtarea
                    ,C.PRIMER_NOMBRE nombrecliente
	                ,TT.TIPO_TAREA tipotarea
	                ,DATE_FORMAT(T.FECHA_INICIO,'%Y-%m-%d') fechainicio
                    ,DATE_FORMAT(T.FECHA_FIN,'%Y-%m-%d') fechafin
	                ,T.PRECIO_TAREA  precio
                    ,COMENTARIO comentario                   
                 FROM CLIENTES C 
	             JOIN TAREAS T 
		            ON C.ID_CLIENTE=T.ID_CLIENTE
                 JOIN TIPO_TAREA TT
		            ON T.ID_TIPO_TAREA=TT.ID_TIPO_TAREA
                 WHERE T.ID_TAREA =?`;

    var values = [request.params.id];

    connection.query(query,values,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }

        response.json(rows);

    });

});


//Get asignaciones de empleados a tareas grid

app.get('/api/asignaemple/grdlst',(request,response)=>{

    let query = `SELECT  A.ID_TAREA  idtarea
                        ,A.ID_EMPLEADO idemple                       
                        ,E.PRIMER_NOMBRE nombre      
                        ,HORAS_TRABAJADAS horas
                        ,PRECIO_HORA precio
                        ,(HORAS_TRABAJADAS*PRECIO_HORA) pago
                         FROM EMPLEADOS_TAREAS A 
                      JOIN EMPLEADOS E 
                          ON A.ID_EMPLEADO=E.ID_EMPLEADO`;

    connection.query(query,(err,rows,fields)=>{

                if(err){
                    console.log(err);
                    response.send('failed');
                }

                response.json(rows);

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


//Post de insercion nuevo empleado tarea
app.post('/api/asignaemple',(request,response)=> {


    var query = `insert into EMPLEADOS_TAREAS values(?,?,?,?)`;
    var values =  [   
        request.body['idemple'],
        request.body['idtarea'],
        request.body['horas'],
        request.body['precio']     
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
app.put('/api/tareas/:id',(request,response)=> {

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
        request.params.id
    ];

            connection.query(query,values,function(err, rows,fields){

                    if(err){
                        response.send('Failed');
                        console.log(err);
                    }
                response.json('Task Updataed Successfully!');

            });
});


// Actualizar tarea existente
app.put('/api/tareas/:id',(request,response)=> {

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
        request.params.id
    ];

            connection.query(query,values,function(err, rows,fields){

                    if(err){
                        response.send('Failed');
                        console.log(err);
                    }
                response.json('Task Updataed Successfully!');

            });
});

// Actualizar asignacion de empleados
app.put('/api/asignaemple/:idtarea/:idemple',(request,response)=> {

    var query = `UPDATE  EMPLEADOS_TAREAS 
                    SET  HORAS_TRABAJADAS = ?
                        ,PRECIO_HORA=?
                 WHERE ID_EMPLEADO=? 
                     AND ID_TAREA=?`;
   
    var values =  [
        request.body['horas'],
        request.body['precio'], 
        request.params.idtarea,
        request.params.idemple               
    ];

            connection.query(query,values,function(err, rows,fields){

                    if(err){
                        response.send('Failed');
                        console.log(err);
                    }
                response.json('Employee Updataed Successfully!');

            });
});


app.get('*',(request,response)=>{

    response.sendFile(path.join(buildPath,'index.html'));
});














var Express = require("express");
var bodyParser = require("body-parser");
const {request, response } = require("express");
var cors = require('cors');
var mysql = require('mysql');
const path = require('path');

const buildPath = path.join(__dirname, 'build')
const port = process.env.PORT || 3001;

// Creacion conexion a la base de datos

var connection =mysql.createConnection({
   host:'mysql-1wof:3306',
   user:'mysql',
   password:'evPeMzBLuSA69qIJjRbNJS5G0XE4ZOwp',
   database:'mysql'
});


//Creacion instancia de Express
var app = Express();

//Habilita el parseo de las url
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cors());

var fileUpload = require('express-fileupload');
var fs = require('fs');
app.use(fileUpload());
app.use('/Photos', Express.static(__dirname+'/Photos'));

// Se habilita el puerto del servidor
app.listen(port,()=>{

    connection.connect(function(err){
        if(err) throw err;
        console.log("Connected to DB");

    });
});



app.get('*', (request,response)=>{
    response.sendFile(path.join(buildPath, 'index.html'))
});


app.get('/api/department',(request,response)=> {


    var query = `SELECT * FROM DEPARTMENT`;
    connection.query(query,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.send(rows);

    });

});

app.post('/api/department',(request,response)=> {


    var query = `INSERT INTO DEPARTMENT(DEPARTMENTNAME) values (?)`;
    var values =  [
        request.body['DepartmentName']
    ];

    connection.query(query,values,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.json('Added Success!');

    });

});

app.put('/api/department',(request,response)=> {


    var query = `UPDATE DEPARTMENT SET DepartmentName=? WHERE DepartmentId=?`;
   
    var values =  [
        request.body['DepartmentName'],
          request.body['DepartmentId']
    ];

    connection.query(query,values,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.json('Updataed Successfully!');

    });

});


app.delete('/api/department/:id',(request,response)=> {

    var query = `DELETE FROM DEPARTMENT WHERE DepartmentId=?`;
   
    var values =  [        
        parseInt(request.params.id)    
    ];

    connection.query(query,values,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.json('Deleted Successfully!');

    });

});



app.get('/api/employee',(request,response)=> {


    var query = `SELECT * FROM EMPLOYEE`;
    connection.query(query,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.send(rows);

    });

});

app.post('/api/employee',(request,response)=> {


    var query = `INSERT INTO EMPLOYEE(EmployeeName,Department,DateOfJoining,PhotoFileName) 
     values(?,?,?,?)`;
    var values =  [
        request.body['EmployeeName'],
        request.body['Department'],
        request.body['DateOfJoining'],
        request.body['PhotoFileName']
    ];

    connection.query(query,values,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.json('Added Success!');

    });

});

app.put('/api/employee',(request,response)=> {


    var query = `UPDATE EMPLOYEE 
                 SET EmployeeName=?,
                     Department =?,
                     DateOfJoining=?,
                     PhotoFileName=? 
                WHERE EmployeeId=?`;
   
    var values =  [
        request.body['EmployeeName'],
        request.body['Department'],
        request.body['DateOfJoining'],
        request.body['PhotoFileName'],
        request.body['EmployeeId']
    ];

    connection.query(query,values,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.json('Updataed Successfully! ' + request.body['EmployeeId'] );

    });

});


app.delete('/api/employee/:id',(request,response)=> {

    var query = `DELETE FROM EMPLOYEE WHERE EmployeeId=?`;
   
    var values =  [        
        parseInt(request.params.id)    
    ];
    
    connection.query(query,values,function(err, rows,fields){

            if(err){

                 response.send('Failed');
                 console.log(err);
            }
        response.json('Deleted Successfully!');

    });

});


app.post('/api/employee/savefile',(request,response)=> {

    fs.writeFile("./Photos/" + request.files.file.name,
                               request.files.file.data, 
                               function(err){

                                    if(err){

                                    return console.log(err);
                                    }

                                response.json(request.files.file.name); 
               })

})











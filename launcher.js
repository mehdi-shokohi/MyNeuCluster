var MyHttpBuilder=require("./MyHttpBuilder")

// Optional MiddleWares
var compression  = require('compression')
var bodyParser   = require('body-parser')




var option = {
            servicePath : __dirname+'/MyFrameWork/service' ,
            serviceTag : 'service2030'
            }

let ControllerPath = __dirname+"/MyFrameWork/api_2030";
var http_server = new MyHttpBuilder(2030,option,ControllerPath,3);//Set Port and Controller Path Folder Name. and Cluster Instance Number
var x=0;

//Use Middleware For Router Of Http Server
http_server.getRouter().use(bodyParser.json());
http_server.getRouter().use(compression())
//Run Server
http_server.run();


// Event hook in Pre Route . This Function will Run Before Process Of any middleware and route .
// In This Sample xx variable Added To req , that is Accessible In Any Controller .

http_server.on('pre_route', req=>{
  req.xx={alpha:++x}
})



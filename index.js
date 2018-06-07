var Express = require('express');
var multer = require('multer');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var cors = require('cors');
var app = Express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
var Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "./Images");
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({
    storage: Storage
}).array("file", 3);
app.post("/api/upload", function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            console.log(err);
            return res.end("Something went wrong!");
        }
        
        return res.status(200).json({
            success:true,
            path:"http://localhost:3000/api/file?file="+req.files[0].filename
        });
    });
});


app.post("/api/login", function(req, res) {
    console.log(req.body.username);
    if(req.body.username == "ravi" && req.body.password == "123@123"){
        res.status(200).json({
            success:true,
            msg:"logged in "
        });
    }else{
        res.status(401).json({
            success:false,
            msg:"Invalid credentials "
        });
    }
});


app.get('/api/file' , (req,res)=>{

    console.log(req.query.file);
    if(req.query.file){
        var filePath = path.join(__dirname, '/Images/'+req.query.file);
        var stat = fs.statSync(filePath);

        res.writeHead(200, {
            
            'Content-Length': stat.size
        });

        var readStream = fs.createReadStream(filePath);
        // We replaced all the event handlers with a simple call to readStream.pipe()
        readStream.pipe(res);
    }else{
        res.status(404).json({
            success:false,
            error : "File not found or invalid filename"
        })
    }

    
});


app.listen(3000, function(a) {
    console.log("Listening to port 3000");
});
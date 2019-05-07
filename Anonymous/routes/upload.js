var express = require('express');
var router = express.Router();



var mysql = require('dao/dbConnect.js');
var client = mysql.connect();

var folder_creation = function(folder){
    try {
        fs.accessSync(folder);
    } catch (e) {
        fs.mkdirSync(folder);
    }
};

var outtestFolder = './storage/';
var publicFolder = './storage/public/';
var privateFolder = './storage/private/';
var anonymousFolder = './storage/anonymous/';

folder_creation(publicFolder);
folder_creation(privateFolder);
folder_creation(anonymousFolder);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, outtestFolder);    
    },
    filename: function (req, file, cb) {
        //var external = path.extname(file.originalname);
        //cb(null, file.fieldname + '-' + Date.now() + external);
        file_name = file.originalname;
        //console.log(file_name);
        cb(null, file.originalname);
    }
});

var upload = multer({storage: storage});

var moveFile = (file, dir2)=>{
    var f = path.basename(file);
    var dest = path.resolve(dir2, f);

    fs.rename(file, dest, (err)=>{
    if(err) throw err;
    else console.log('Successfully moved');

  });
};

router.post('/upload', upload.single('file'),function (req, res, next) {
    if(have_logined==true){
        var original = './storage'+'/' + file_name;
        var moved = './storage';
        if (req.body.type == 'public') {  
            console.log('public');
            moved = moved + '/public/';
        }
        else if (req.body.type == 'private'){
            console.log('private');
            moved = moved + '/private/';
        }
        //console.log(original);
        //console.log(moved);
        moveFile(original, moved);

        var full_path =moved+file_name;
		var type = req.body.type;
		var uploader = 'administrator'; //hardcode
		var tag1 = 'movie'; //hardcode
		var tag2 = 'music'; //hardcode
		var tag3 = 'fantastic'; //hardcode
		mysql.Upload(client,file_name,uploader,type,tag1,tag2,tag3,function(result){
			console.log(result);
		});
	}else{
		var original = './storage'+'/' + file_name; 
		var moved = './storage/anonymous/';

		moveFile(original, moved);
		var full_path = moved+file_name;

		mysql.UploadForAnonymous(client,file_name,full_path,function(result){
			console.log(result);
			res.send(result);
		});



	}
});


/* GET home page. */
router.get('/upload', function(req, res, next) {
  res.render('upload', { title: 'Anonymous Files'});
});

router.get('/', function(req, res, next) {
  res.render('upload', { title: 'Anonymous Files'});
});

module.exports = router;
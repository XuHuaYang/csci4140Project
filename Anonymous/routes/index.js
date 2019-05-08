var express = require('express');
var router = express.Router();

var fs = require('fs');
var multer = require('multer');
var path = require('path');
var crypto = require('crypto');
var md5 = require('md5');
var moment = require('moment');
var lodash = require('lodash');

var mysql = require('dao/dbConnect.js');
var client = mysql.connect();

/*Start of upload*/
var extract_code = null;

var folder_creation = function(folder){
    try {
        fs.accessSync(folder);
    } catch (e) {
        fs.mkdirSync(folder);
    }
};

var outtestFolder = './public/storage/';
var publicFolder = './public/storage/public/';
var privateFolder = './public/storage/private/';
var anonymousFolder = './public/storage/anonymous/';

folder_creation(outtestFolder);
folder_creation(publicFolder);
folder_creation(privateFolder);
folder_creation(anonymousFolder);

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, outtestFolder);    
    },
    filename: function (req, file, cb) {
        req.session.file_name = file.originalname;
        req.session.file_extend = path.extname(file.originalname);

        console.log(req.session.file_name);
        cb(null, file.originalname);
    }
});

var upload = multer({storage: storage});

var moveFile = (file, dir2, base)=>{
    var dest = path.resolve(dir2, base);
    fs.rename(file, dest, (err)=>{
    if(err) throw err;
    else console.log('Successfully moved');

  });
};



router.get('/', function(req, res, next) {
    res.render("preIndex");
})
.post('/',function(req,res){
    req.session.loginState = 0;
    req.session.RegisterState = 0;
    req.session.username = null;
    req.session.have_logined = false;
    req.session.file_name = '';
    req.session.file_extend = '';
    res.redirect('/index');
});

router
.get('/index', function(req, res, next) {

    var tempData = [];
    var tempAnonyousData = [];

    // loginState = loginState;
    //username = req.session.username;
    if(req.session.loginState == 0 || req.session.loginState == 1){
        mysql.Display(client,function(result){
        tempAnonyousData = JSON.parse(JSON.stringify(result));
        console.log(tempAnonyousData);
        res.render('index', { title: 'Anonymous Files',data:tempAnonyousData,page:0,loginState:req.session.loginState,username:req.session.username});
        });
    }else{
        mysql.DisplayUser(client,req.session.username,function(result){
            tempData = JSON.parse(JSON.stringify(result));;
            console.log(tempData);
            res.render('index', { title: 'Anonymous Files',data:tempData,page:0,loginState:req.session.loginState,username:req.session.username});
        });
    }
})
.post('/index',function(req,res){
    req.session.loginState = 0;
    req.session.RegisterState = 0;
    req.session.username = null;
    req.session.have_logined = false;
    res.redirect('/index');
});


router.get('/upload', function(req, res, next) {
    if(extract_code != null){
        extract_code = null;
    }
  res.render('upload', { title: 'Anonymous Files',extract_code:extract_code,loginState:req.session.loginState,username:req.session.username});
})
.post('/upload', upload.single('file'),function (req, res, next) {
	if (req.body.logoutPost == 1) {
		req.session.loginState = 0;
    	req.session.RegisterState = 0;
   	 	req.session.username = null;
    	req.session.have_logined = false;
    	res.redirect('/index');
	} else {
	    if(req.session.have_logined==true){
	        var original = './public/storage'+'/' + req.session.file_name;
	        var moved = './public/storage';
	        var upload_type = 'public';
	        if (req.body.type == 'public') {  
	            console.log('public');
	            upload_type = '/storage/public/';
	            moved = moved + '/public/';
	        }
	        else if (req.body.type == 'private'){
	            console.log('private');
	            upload_type = '/storage/private/';
	            moved = moved + '/private/';
	        }

	        var id = crypto.createHash('sha256').update(Date()+req.session.file_name).digest('hex');

	        var new_file_name = id + req.session.file_extend;
	        //console.log(new_file_name);

	        moveFile(original, moved, new_file_name);

	        var full_path =upload_type+new_file_name;
	        console.log(full_path);
	        var type = req.body.type;

	        var uploader = req.session.username; 

	        var tag1 = req.body.tag1;
	        var tag2 = req.body.tag2;
	        var tag3 = req.body.tag3; 
	        mysql.Upload(client,id, req.body.fileName,uploader,type,full_path,tag1,tag2,tag3,function(result){
	            console.log(result);
	            extract_code = null;
	            res.render('upload', { title: 'Anonymous Files',extract_code:extract_code,loginState:req.session.loginState,username:req.session.username});
	        });
	    }else{
	        var original = './public/storage'+'/' + req.session.file_name; 
	        var moved = './public/storage/anonymous/';
	        console.log(original);
	        console.log(moved);

	        var extract_code = md5(Date()+req.session.file_name);
	        var new_file_name = extract_code + req.session.file_extend;

	        moveFile(original, moved, new_file_name);

	        var full_path = '/storage/anonymous/'+new_file_name;

	        var tag1 = req.body.tag1;
	        var tag2 = req.body.tag2;
	        var tag3 = req.body.tag3; 

	        mysql.UploadForAnonymous(client,extract_code,req.body.fileName,full_path,req.body.type,tag1,tag2,tag3,function(result){
	            console.log(result);
	            extract_code = result;
	            res.render('upload', { title: 'Anonymous Files',extract_code:extract_code,loginState:req.session.loginState,username:req.session.username});
	        });
	    }
	}
});


/*Start of Search Page */
router.get('/search',function(req,res,next){
    var searchResult = [];
    res.render('search', { title: 'Anonymous Files',page:0,data:searchResult,loginState:req.session.loginState,username:req.session.username});
})
.post('/search', function(req,res,next){
	if (req.body.logoutPost == 1) {
		req.session.loginState = 0;
	    req.session.RegisterState = 0;
	    req.session.username = null;
	    req.session.have_logined = false;
	    res.redirect('/index');
	} else {
	    //var searchOption = req.body.option;
	    var search_content = req.body.search_content;
	    mysql.Search(client,search_content,req.session.username,req.session.loginState,function(result){
	        var searchResult = JSON.parse(JSON.stringify(result));;
	        console.log(searchResult);
	        res.render('search', { title: 'Anonymous Files',page:0,data:searchResult,loginState:req.session.loginState,username:req.session.username});
	    });
	}
});


router
.get('/login', function(req, res, next) {
    req.loginState = req.session.loginState;
    res.render('login',req);
})
.post('/login',function(req,res)
{
    var client = mysql.connect();
    mysql.Login(client,req.body.username,
        function(result){
            console.log(result.length);
            if(result.length == 1){
                console.log(result[0].pass);
                var md5 = crypto.createHash('md5');
                md5.update(req.body.password);
                var pass = md5.digest('hex');
                if(pass == result[0].pass){//login sucess
                    req.session.username = req.body.username;
                    req.session.loginState = 2;
                    req.session.have_logined = true;
                    res.redirect('/index');
                }
                else{//login fail
                    req.session.loginState = 1;
                    res.redirect('login');
                }
            }
            else{ //login fail
                req.session.loginState = 1;
                res.redirect('login');
            }
        });
});


router
.get('/register', function(req, res, next) {
    req.RegisterState = req.session.RegisterState;
    res.render('register',req);
})
.post('/register',function(req,res)
{
    var md5 = crypto.createHash('md5');
    md5.update(req.body.password);
    var pass = md5.digest('hex');
    var client = mysql.connect();
    mysql.Register(client,req.body.username,pass,
        function(err){
            if(err){
                req.session.RegisterState = 1;
                res.redirect('/register');
            }
            else{
                req.session.RegisterState = 2;
                res.redirect('/login');
            }
        });
});
/**/

/*start of file pool */
router
.get('/filepool', function(req, res, next) {

	var tempData = [];


    // loginState = loginState;
    //username = req.session.username;
    if(req.session.loginState == 0 || req.session.loginState == 1){
        mysql.Display(client,function(result){
        tempAnonyousData = JSON.parse(JSON.stringify(result));
        console.log(tempAnonyousData);
        res.render('filepool', { title: 'Anonymous Files',data:tempAnonyousData,page:0,loginState:req.session.loginState,username:req.session.username});
        });
    }else{
        mysql.DisplayFilePool(client,req.session.username,function(result){
            tempData = JSON.parse(JSON.stringify(result));;
            console.log(tempData);
            res.render('filepool', { title: 'Anonymous Files',data:tempData,page:0,loginState:req.session.loginState,username:req.session.username});
        });
    }
})
.post('/filepool',function(req,res){
    req.session.loginState = 0;
    req.session.RegisterState = 0;
    req.session.username = null;
    req.session.have_logined = false;
    res.redirect('/index');
});

module.exports = router;


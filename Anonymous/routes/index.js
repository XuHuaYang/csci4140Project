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

var have_logined=false;
var loginState = 0; // 0 - not login , 1 - login fail, 2 - login success, can require the username.
var RegisterState = 0; // 0 - not register , 1 - register fail, 2 - register success, can require the username.
var username = null;

/*Start of upload*/
var file_name = '';
var file_extend = '';

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
        file_extend = path.extname(file.originalname);

        console.log(file_name);
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

router.post('/upload', upload.single('file'),function (req, res, next) {
	if (req.body.logoutPost == 1) {
		loginState = 0;
    	RegisterState = 0;
   	 	username = null;
    	have_logined = false;
    	res.redirect('/');
	} else {
	    if(have_logined==true){
	        var original = './public/storage'+'/' + file_name;
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

	        var id = crypto.createHash('sha256').update(Date()+file_name).digest('hex');

	        var new_file_name = id + file_extend;
	        //console.log(new_file_name);

	        moveFile(original, moved, new_file_name);

	        var full_path =upload_type+new_file_name;
	        console.log(full_path);
	        var type = req.body.type;

	        var uploader = username; 

	        var tag1 = req.body.tag1;
	        var tag2 = req.body.tag2;
	        var tag3 = req.body.tag3; 
	        mysql.Upload(client,id, req.body.fileName,uploader,type,full_path,tag1,tag2,tag3,function(result){
	            console.log(result);
	            extract_code = null;
	            res.render('upload', { title: 'Anonymous Files',extract_code:extract_code,loginState:loginState,username:username});
	        });
	    }else{
	        var original = './public/storage'+'/' + file_name; 
	        var moved = './public/storage/anonymous/';
	        console.log(original);
	        console.log(moved);

	        var extract_code = md5(Date()+file_name);
	        var new_file_name = extract_code + file_extend;

	        moveFile(original, moved, new_file_name);

	        var full_path = '/storage/anonymous/'+new_file_name;

	        var tag1 = req.body.tag1;
	        var tag2 = req.body.tag2;
	        var tag3 = req.body.tag3; 

	        mysql.UploadForAnonymous(client,extract_code,req.body.fileName,full_path,req.body.type,tag1,tag2,tag3,function(result){
	            console.log(result);
	            extract_code = result;
	            res.render('upload', { title: 'Anonymous Files',extract_code:extract_code,loginState:loginState,username:username});
	        });
	    }
	}
});

router.get('/upload', function(req, res, next) {
	if(extract_code != null){
		extract_code = null;
	}
  res.render('upload', { title: 'Anonymous Files',extract_code:extract_code,loginState:loginState,username:username});
});
/*End of up load*/

/* GET home page. */

router
.get('/', function(req, res, next) {

	var tempData = [];
	var tempAnonyousData = [];


    // loginState = loginState;
    //username = req.session.username;
    if(loginState == 0 || loginState == 1){
        mysql.Display(client,function(result){
        tempAnonyousData = JSON.parse(JSON.stringify(result));
        console.log(tempAnonyousData);
        res.render('index', { title: 'Anonymous Files',data:tempAnonyousData,page:0,loginState:loginState,username:username});
        });
    }else{
        mysql.DisplayUser(client,username,function(result){
            tempData = JSON.parse(JSON.stringify(result));;
            console.log(tempData);
            res.render('index', { title: 'Anonymous Files',data:tempData,page:0,loginState:loginState,username:username});
        });
    }
})
.post('/',function(req,res){
    loginState = 0;
    RegisterState = 0;
    username = null;
    have_logined = false;
    res.redirect('/');
});

/*End of Get home page.*/

/*Start of Search Page */
var searchResult = [];
router.post('/search', function(req,res,next){
	if (req.body.logoutPost == 1) {
		loginState = 0;
	    RegisterState = 0;
	    username = null;
	    have_logined = false;
	    res.redirect('/');
	} else {
	    //var searchOption = req.body.option;
	    var search_content = req.body.search_content;
	    mysql.Search(client,search_content,username,loginState,function(result){
	        searchResult = JSON.parse(JSON.stringify(result));;
	        console.log(searchResult);
	        res.render('search', { title: 'Anonymous Files',page:0,data:searchResult,loginState:loginState,username:username});
	    });
	}
});

router.get('/search',function(req,res,next){
	if(searchResult.length > 0){
		searchResult = [];
	}
	res.render('search', { title: 'Anonymous Files',page:0,data:searchResult,loginState:loginState,username:username});
});

/*End of search page */
router
.get('/login', function(req, res, next) {
    req.loginState = loginState;
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
                    username = req.body.username;
                    loginState = 2;
                    have_logined = true;
                    res.redirect('/');
                }
                else{//login fail
                    loginState = 1;
                    res.redirect('login');
                }
            }
            else{ //login fail
                loginState = 1;
                res.redirect('login');
            }
        });
});
/*Start of login page */

/*End of login*/

/*Start of register*/
router
.get('/register', function(req, res, next) {
    req.RegisterState = RegisterState;
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
                RegisterState = 1;
                res.redirect('/register');
            }
            else{
                RegisterState = 2;
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
    if(loginState == 0 || loginState == 1){
        mysql.Display(client,function(result){
        tempAnonyousData = JSON.parse(JSON.stringify(result));
        console.log(tempAnonyousData);
        res.render('filepool', { title: 'Anonymous Files',data:tempAnonyousData,page:0,loginState:loginState,username:username});
        });
    }else{
        mysql.DisplayFilePool(client,username,function(result){
            tempData = JSON.parse(JSON.stringify(result));;
            console.log(tempData);
            res.render('filepool', { title: 'Anonymous Files',data:tempData,page:0,loginState:loginState,username:username});
        });
    }
})
.post('/filepool',function(req,res){
    loginState = 0;
    RegisterState = 0;
    username = null;
    have_logined = false;
    res.redirect('/');
});

module.exports = router;


Anonymous Files:
1.basic fuctions:
	1)User management:login,register
		anonymous user can see public files on netdisc
		logged user can see all files on netdisc.May use mysql to manage.
	2)Upload:only logged in user can upload private files,specify the upload mode, use mysql database to manage file names.
	3)Download:all public files can download
	4)Share:specify the share code when you want to share a public anonymous file, the code will expire after a day.
	6)Search:anonymous  user can only search public files,logged in users can search his private files and public files
	7)Client Side: interface using webpage 
	8)Server Side:using express framework and rendering using ejs,  store the data on server,connect to mysql database to manage files and user accounts

Steps to build project:

​	Set sql server information in /dao/dbConnect.js, change the mysql database information in function connectServer() to your database.

​	Then create sql table in mysql database according to the sql statement in /Anonymous/sql table.txt

​	in /Anonymous folder run a.sh or command "npm start" 

​	open the website using https, connection using http is forbidden.

​	https://localhost:3000

​	Then using ngrok to expose your local url:

​		To expose a https url, you have to login first.

​		#./ngrok authtoken Your Tunnel Authtoken

​		or you can run login.sh in Anonymous\ngrok folder

​		Then run:  ./ngrok http https://localhost:3000 to expose your local url, it will generate a url to let others to get access to it.

​		Then the establish is finished.
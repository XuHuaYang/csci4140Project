匿名网盘：

1.用户权限管理：登录，注册，非登陆用户可以看到Public文件

2.上传(Public,Private)：deduplication  

3.删除

4.下载：点击文件名下载，只能下载public文件

5.分享：private文件需要分享才能下载，需要输入提取码

6.站内搜索，登陆，

7.wpf做UI，找个服务器搭网站和储存文件，mysql的数据库管理

incognito netdisc:
1.basic fuctions:
	1)User management:login,register
		anonymous user can see public files on netdisc
		logged user can see all files on netdisc.May use mysql to manage.
	2)Upload:only logged in user can upload files,specify the upload mode,using deduplication to reduce storage(optional). May use mysql to manage file names.
	3)Download:all public files can download,private files need share code for other users to download
	4)Delete:related to deduplication
	5)Share:specify the share code when you want to share a private file, the code can be used only once.
	6)Search:anonymous  user can only search public files,logged in users can search his private files and public files
	7)Client Side:windows platform,may use wpf to generate UI
	8)Server Side:deploy the backend and store the data,connect to remote mysql database

Steps to build project:

​	Set sql server information in /dao/connect.js

​	run a.sh or npm start

​	open the website using https, connect using http is forbidden.

​	https://localhost:3000


# 微智2014前端开发工作流

> 使用 [grunt-init][]创建基于seajs和less的前端开发工作流程.

[grunt-init]: http://gruntjs.com/project-scaffolding

## 什么是前端工作流
随着web的日益发展，前端的工作越来越繁多，使用的工具也越来越多

目前一个基本的web开发流程类似下面的结构

```
1、建立项目，梳理目录结构

2、coding...

3、发布
```

看起来很简单的流程，但是如果仔细考虑，就会碰到很多问题

```
1、线上资源和开发资源的更新问题，如何保证客户端载入的永远是线上最新的版本，而不使用缓存。

2、前端资源的压缩和打包，太繁杂，又要压缩js，又要压缩css，还要压缩图片。

3、如果项目太大，如何形成良好的团队开发模式。
```

## 解决模块化问题

##### 1、使用seajs模块化开发js

[seajs][]遵循CMD规范，书写规则类似与nodejs，关于[seajs][]的东西，这里不阐述，有兴趣的可以去seajs的官网查询

###### [点击去查看seajs文档][] 

[seajs]: http://seajs.org/docs/
[点击去查看seajs文档]: http://seajs.org/docs/

##### 2、使用less开发css

[less][]是一款css的预处理语言，他有独立的运算能力，而且具有混合，变量等动态语言的特性，使用less可以快速开发css

#######[点击去查看less文档][]

[less]:http://www.lesscss.net/
[点击去查看less文档]:http://www.lesscss.net/

以上这些就解决了模块化的问题，但这些只是开发时的规范，下面看工作流能够做什么。

## 使用工作流

##### 1、将seajs的模块打包，压缩

seajs开发的都是模块化的东西，如果一个网页的功能很多，那么就可能出现需要加入大量js的问题，为了解决这个问题，我们可以将seajs的模块打包，减少对服务器的请求

##### 2、将less文件打包成css文件

less文件开发的东西不能直接在线上使用，所以需要将less文件打包成css文件使用

##### 3、压缩图片，将css文件中的图标文件转为base-64的编码转储

Base64是网络上最常见的用于传输8Bit字节代码的编码方式之一，浏览器将会把Base64编码解析为图片，这一切都在客户端进行，将图片保存到css中，一是能进行缓存，第二也可以减少网页对服务器的请求

##### 4、内嵌资源文件到html中

什么是内嵌资源，内嵌资源就是将一些css文件、js文件、图片嵌入到html页面中，去避免为了一些可能只有一两句的文件去请求服务器资源，将小文件嵌入到html中，看示例就能很清楚：

```
	<!doctype html>
	<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>Document</title>
		<link rel="stylesheet" href="../css/style.css?__inline=true" />
	</head>
	<body>
		<div id="logo"></div>
		<div>
			<img src="../img/house_01.png?__inline=true" alt="" />
		</div>
		<script src="../js/sea.js"></script>
		<script src="../js/rootConfig.js?__inline=true"></script>
		<script>
			seajs.use('app');
		</script>
	</body>
	</html>
```

使用工作流打包后：

```
	<!doctype html>
	<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<title>Document</title>
		<style>
	html,body{margin:0;padding:0}div#logo{background:url(data:image/png;base64,...) 0 0 no-repeat;background-color:#00f;height:60px}
	</style>
	</head>
	<body>
		<div id="logo"></div>
		<div>
			<img src="data:image/png;base64,..." alt="" />
		</div>
		<script src="../js/sea.js"></script>
		<script>
	seajs.config({alias:{jquery:"lib/jquery",app:"dist/app/app",requires:"dist/requires/requires",include:"dist/include/include",plugins:"dist/plugins/plugins"},charset:"utf-8",map:[[/^(.*\.(?:css|js))(.*)$/i,"$1?v=0.1.0"]]});
	</script>
		<script>
			seajs.use('app');
		</script>
	</body>
	</html>
```
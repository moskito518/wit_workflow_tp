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

######[点击去查看less文档][]

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

可以看到，将一些小资源内嵌到html中，可以减少很多服务器的请求操作

##### 5、资源替换

在我们上线的时候可能有很多问题，新的资源需要更新，那么html页面中就需要手动更新文件的缓存，一般的方法是给更新的资源添加时间戳。


```
<img src="logo.png?t=7defa41">
```

但是这样也有问题，当你更新了html模版，而没有更新资源文件，那么新的用户在访问网站时，就会形成缓存，而如果你先更新了资源文件，没有更新html模版，那么老用户在此期间访问网站，还是会加入缓存，所以一般大型网站在更新时，都加班到半夜，挑相对人少的时候去更新。

那么我们看看工作流是怎么解决的，计算出文件的hash值，将新文件重命名，在文件名中加入hash值，这样你更新资源时，不会覆盖原来的旧文件，然后将html中对资源的引用地址改为新的地址，这样就可以防止新用户产生缓存。

看示例：

```
<img src="logo.png">
```

```
<img src="7defa41.logo.png">
```

ok,现在大家应该能知道，工作流是怎么处理前端的工作的了，下面就看看怎么开始搭建你的工作流

## 搭建工作流

###配置环境

首先你需要一个node.js的环境

1、安装nodejs[window 安装地址](http://nodejs.org/)，mac 推荐通过brew安装```brew install node```

2、安装 grunt-cli ```npm install -g grunt-cli```

3、安装 grunt-init ```npm install -g grunt-init```

4、克隆本仓库到本地, windows克隆到：```%USERPROFILE%\.grunt-init\``` mac克隆到```~/.grunt-init/``` 如果没有```.grunt-init```目录可用```mkdir .grunt-init```命令创建

5、打开命令行，新建你的项目文件夹```mkdir yourProject```

6、进入文件夹，在命令行输入，```grunt-init wit_workflow```

7、回答相对的问题后，你的工作流就创建完成了

### 打开项目

初始化完成后你将获得下面这样结构的项目

```
└── dev
    ├── img
	|   └── logo.png
    ├── js
	│   └──sea.js
	│   └──rootConfig.js
	│   └──yourProjectName.cmd.json
    │   └── src
	│       └── app
	│           └── app.js
	│       └── include
	│           └── include.js
	│       └── plugins
	│           └── plugins.js
	│       └── requires
	│           └── requires.js
    ├── less
	|   └── frameworks
	|       └── frameworks.less
	|   └── style.less	
	├── html
	|   └── index.html
└── Gruntfile.js
└── package.json
└── yourProjectName.wit.json
```

如果不使用less,将生成这样的目录

```
└── dev
    ├── img
	|   └── logo.png
    ├── js
	│   └──sea.js
	│   └──rootConfig.js
	│   └──yourProjectName.cmd.json
    │   └── src
	│       └── app
	│           └── app.js
	│       └── include
	│           └── include.js
	│       └── plugins
	│           └── plugins.js
	│       └── requires
	│           └── requires.js
    ├── css
	|   └──src
	|      └── frameworks
	|          └── frameworks.less
	|      └── style.less	
	├── html
	|   └── index.html
└── Gruntfile.js
└── package.json
└── yourProjectName.wit.json
```

1.html文件存放在html文件中。

2.seajs的模块存放在```js/src```目录中，```app```代表模块，html中可以use，不能require，```include```目录代表最基本的引用文件，比较底层的东西请写在这里，可以被require，```plugins```项目中自己开发的插件，可能被多此引用，此文件夹下的东西都不打包，```requires```表示app模块中所需的引用，只能被app中的模块require

3.less文件夹放less文件，打包后会自动生成css目录，和less目录同级

4.不使用less时,开发css时使用import将模块引入，在终端中输入```grunt dev```将会打开监听模式，将```css->src```目录下的所有css合并到```css->dist->style.css```中，在html中只引入此文件。

### 开发项目

在package.json同级目录执行

```npm install```

完成后请修改根目录下node_modules->grunt-usemin->lib->fileprocessor.js

在

```
  css: [
    [
      /(?:src=|url\(\s*)['"]?([^'"\)(\?|#)]+)['"]?\s*\)?/gm,
      'Update the CSS to reference our revved images'
    ]
  ],  
```

后添加

```
    less: [
  	  [
        /(?:src=|url\(\s*)['"]?([^'"\)(\?|#)]+)['"]?\s*\)?/gm,
        'Update the CSS to reference our revved images'
  	  ]
    ],
```

以开启对less文件的支持

开发时请注意：

所有seajs的模块都需要别名，别名配置在dev/js/rootConfig.js中配置，配置完成后请同步更新同目录下的json文件，这里配置的时打包发布时所需的模块别名，此文件只包含依赖的模块，不需要配置app文件夹中的模块

可以查看[example](https://github.com/moskito518/wit_workflow_example)，学习怎么配置这些文件

#### 监听文件改变，编译less

因为less不能直接使用，所以请在开发的时候打开less的编译开关，我们建议将所有css文件合并到style.css文件中，所以目前只会生成一个style.css文件，如果需要配置，请手动修改Gruntfile.js中针对less的配置

```grunt watch```

开启对less文件的监听

### 打包项目

开发完成以后，需要发布项目，在Gruntfile.js的同级目录执行

```grunt release```

将在dev的同级目录生成release文件夹，里面包含所有线上的资源，目录结构类似于dev目录，js/src目录被删除，会多生成dist(线上js主目录)代替src，debug目录用来调试

完成后就可以将release目录中的东西，同步到服务器中了。


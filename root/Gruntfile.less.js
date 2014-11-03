/*
 * Grunt File Concat CMD
 * */
module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        spm: grunt.file.readJSON('dev/js/{%= name%}.cmd.json'),
        //提取依赖
        transport: {
            options: {
                paths: ['release/js'],
                alias: "<%= spm.alias%>"
            },
            app: {
                options: {
                    idleading: 'dist/app/'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'release/js/src/app/',
                        src: '*.js',
                        filter: 'isFile',
                        dest: 'release/js/.build/app/',
                        ext: '.js'
                    }
                ]
            },
            plugins: {
                options: {
                    idleading: 'dist/plugins/'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'release/js/src/plugins/',
                        src: '*.js',
                        filter: 'isFile',
                        dest: 'release/js/.build/plugins/',
                        ext: '.js'
                    }
                ]
            },
            include: {
                options: {
                    idleading: 'dist/include/'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'release/js/src/include/',
                        src: '*.js',
                        filter: 'isFile',
                        dest: 'release/js/.build/include/',
                        ext: '.js'
                    }
                ]
            },
            requires: {
                options: {
                    idleading: 'dist/requires/'
                },
                files: [
                    {
                        expand: true,
                        cwd: 'release/js/src/requires/',
                        src: '*.js',
                        filter: 'isFile',
                        dest: 'release/js/.build/requires/',
                        ext: '.js'
                    }
                ]
            }
        },
        //合并文件
        concat: {
            options: {
                paths: ['./release/js'],
                include: 'all'
            },
            app: {
                files: [
                   {
                       expand: true,
                       cwd: 'release/js/.build/app',
                       src: ['*.js'],
                       dest: 'release/js/.build/app',
                       ext: '.js'
                   }
                ]
            }
        },
        //复制debug文件
        //压缩文件
        uglify: {
            options: {
                beautify: {
                    //中文ascii化，非常有用！防止中文乱码的神配置
                    ascii_only: true
                }
            },
            plugins: {
                files: [
                    {
                        expand: true,
                        cwd: 'release/js/.build/plugins/',
                        src: ['*.js'],
                        dest: 'release/js/dist/plugins/',
                        ext: '.js'
                    }
                ]
            },
            include: {
                files: [
                    {
                        expand: true,
                        cwd: 'release/js/.build/include/',
                        src: ['*.js'],
                        dest: 'release/js/dist/include/',
                        ext: '.js'
                    }
                ]
            },
            requires: {
                files: [
                    {
                        expand: true,
                        cwd: 'release/js/.build/requires/',
                        src: ['*.js'],
                        dest: 'release/js/dist/requires/',
                        ext: '.js'
                    }
                ]
            },
            app: { //按源文件目录结构压缩JS文件
                files: [
                    {
                        expand: true,
                        cwd: 'release/js/.build/app',
                        src: ['*.js'],
                        dest: 'release/js/dist/app',
                        ext: '.js'
                    }
                ]
            }
        },
        //编译less文件到lessCss文件夹
        less: {
			dev: {
                options: {
                    paths: ["css"],
                    cleancss: false
                },
                files: {
                    "css/style.css": "less/style.less"
                }
            },
			release: {
				options: {
					paths: ["release/css"],
					cleancss: false
				},
				files: {
					"release/css/style.css": "release/less/style.less"
				}
			}
		},
        //复制debug文件
        copy: {
            debug:{
                files: [
                    {
                        expand: true,
                        cwd: 'release/js/.build/',
                        src: ['**/*-debug.js'],
                        dest: 'release/js/debug/',
                        ext: '.js'
                    }
                ]
            },
			release:{
				files: [
					{
						expand: true,
						cwd: 'dev/',
						src: ['**/*'],
						dest: 'release/'
					}
				]
			},
			rootConfig: {
				src: 'dev/js/rootConfig.js',
				dest: 'release/js/rootConfig.js',
				options: {
					process: function (content, srcpath) {
				        return content.replace(/src/g,"dist");
				    },
				}
			}
        },
		//清理文件
        clean: {
            debug: ['release/js/dist/**/*-debug.js'],
            build: ['release/js/.build'],
			release: ['release/**/*'],
			css: ['release/css/**/*'],
			rootConfig: ['release/js/rootConfig.js'],
			src: ['release/js/src']
        },
		//压缩图片
		imagemin: {
			/* 压缩图片大小 */
			dist: {
			    options: {
			        optimizationLevel: 3 //定义 PNG 图片优化水平
			    },
			    files: [
			       {
			            expand: true,
			            cwd: 'release/img/',
			            src: ['**/*.{png,jpg,jpeg}'], // 优化 img 目录下所有 png/jpg/jpeg 图片
			            dest: 'release/img/' // 优化后的图片保存位置，覆盖旧图片，并且不作提示
			        }
			    ]
			}
		},
		//内嵌css内的图片资源
		imageEmbed: {
			dist: {
				src: [ "release/css/style.css" ],
				dest: "release/css/style.css",
				options: {
					deleteAfterEncoding : false
				}
			}
		},
		//压缩css
		cssmin: {
		  combine: {
			  files: [
				  {
					  expand: true,
					  cwd: 'release/css',
					  src: ['**/*.css'],
					  dest: 'release/css',
				  }
			  ]
		  }
		},
		//内嵌网站资源
		inline: {
			html: {
				options: {
					cssmin: true,		//压缩css文件
					uglify: true 		//压缩js文件
				},
				files: [
					{
						expand: true,
						cwd: 'release/html/',
						src: ['**/*.html'],	//内嵌html中的资源
						dest: 'release/html/',		//覆盖原来的文件
						ext: '.html'
					}
				]
			}
		},
		//生成带hash值的资源
		rev: {
			options: {
				encoding: 'utf8',
				algorithm: 'md5',
				length: 8
			},
			img: {
				files: [
					{
						src: [
							'release/img/**/*.{jpg,gif,png,jpeg,ico}'
						]
					}
				]
			},
			css: {
				files: [
					{
						src: ['release/css/**/*.css']
					}
				]
			},
			js: {
				files: [
					{
						src: ['release/js/rootConfig.js']
					}
				]
			}
		},
		//更新html和css中对静态资源的引用
		useminPrepare: {
			html: ['release/html/**/*.html'],
			options: {
				dest: 'release/html'
			}
		},
		usemin: {
			less: ['release/less/**/*.less'],
			html: ['release/html/**/*.html'],
			options: {
				assetsDirs: [
					'release/js/dist',
					'release/css',
					'release/img'
				]
			}
		},
        //监听文件变化
        watch: {
			less: {files: ["dev/less/**/*.less"],tasks: ["less:dev"]}
        },
    });

    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-cmd-concat');
	grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-inline');
	grunt.loadNpmTasks('grunt-rev');
	grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks("grunt-image-embed");
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	

    //注册监听文件变化
    grunt.registerTask('dev', ['watch']);
	
	grunt.registerTask('release', [
		'clean:release',
		'copy:release',
		'clean:rootConfig',
		'copy:rootConfig',
		'imagemin',
		'less:release',
		'imageEmbed',
		'inline:html',
		'clean:css',
		'rev:img',
		'useminPrepare',
		'usemin:less',
		'less:release', 
		'imageEmbed',
        'transport:plugins',
        'uglify:plugins',
        'transport:include',
        'uglify:include',
        'transport:requires',
        'uglify:requires',
        'transport:app',
        'concat:app',
        'uglify:app',
		'copy:debug',
        'clean:debug',
		'clean:build',
		'cssmin',
		'rev:css',
		'rev:js',
		'usemin:html',
		'clean:src'
	]);
};
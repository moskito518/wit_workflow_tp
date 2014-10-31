seajs.config({
    alias: {
		
	},
    charset: 'utf-8',
    'map': [
        [ /^(.*\.(?:css|js))(.*)$/i, '$1?v={%= version %}' ]
    ]
});
const fastify = require('fastify')({
    logger: {
        level: 'error'
    }
});

fastify
    .register(require('fastify-helmet'), { noCache: true })
    .register(require('fastify-formbody'))
    .register(require('fastify-static'), { root: require('path').join(__dirname, 'public') })

require('./routes')(fastify);

fastify.listen(process.env.PORT || 3000, '0.0.0.0', err => {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    console.log('...beep!');
});
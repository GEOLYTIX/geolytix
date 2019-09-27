// Catch unhandled errors on the process.
process.on('unhandledRejection', err => console.error(err));

const fastify = require('fastify')({
    logger: {
        level: 'error'
    }
});

fastify
    .register(require('fastify-helmet'), {
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ['\'self\'', '*.logrocket.io'],
            connectSrc: ['\'self\'', 'geolytix.xyz'],
            baseURI: ['\'self\''],
            objectSrc: ['\'self\''],
            workerSrc: ['\'self\'', 'blob:'],
            frameSrc: ['\'self\'', 'www.google.com', 'www.gstatic.com'],
            formAction: ['\'self\''],
            styleSrc: ['\'self\'', '\'unsafe-inline\'', 'fonts.googleapis.com', 'cdn.rawgit.com', 'code.getmdl.io', 'geolytix.xyz'],
            fontSrc: ['\'self\'', 'fonts.gstatic.com', 'geolytix.xyz', 'data:'],
            scriptSrc: ['\'self\'', 'geolytix.xyz', 'cdn.rawgit.com', 'gitcdn.xyz', 'www.google.com', 'www.gstatic.com', '*.logrocket.io', 'cdn.logrocket.com', 'code.getmdl.io'],
            imgSrc: ['\'self\'', 'geolytix.xyz', 'api.ordnancesurvey.co.uk', '*.tile.openstreetmap.org', 'api.mapbox.com', 'res.cloudinary.com', 'raw.githubusercontent.com', '*.global.ssl.fastly.net', 'data:']
          },
          setAllHeaders: true
        },
        noCache: true
      })
    .register(require('fastify-formbody'))
    .register(require('fastify-static'), { root: require('path').join(__dirname, 'public') })
    .setNotFoundHandler((req, res) => res.sendFile('error.html'));

require('./routes')(fastify);

fastify.listen(process.env.PORT || 3000, '0.0.0.0', err => {
    if (err) {
        console.error(err)
        process.exit(1)
    }

    console.log('...beep!');
});
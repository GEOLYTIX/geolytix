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
            defaultSrc: ['\'self\''],
            connectSrc: ['\'self\'', 'geolytix.xyz'],
            baseURI: ['\'self\''],
            objectSrc: ['\'self\''],
            workerSrc: ['\'self\'', 'blob:'],
            frameSrc: ['\'self\'', 'www.google.com', 'www.gstatic.com'],
            formAction: ['\'self\''],
            styleSrc: ['\'self\'', '\'unsafe-inline\'', 'fonts.googleapis.com', 'geolytix.xyz'],
            fontSrc: ['\'self\'', 'fonts.gstatic.com', 'geolytix.xyz', 'data:'],
            scriptSrc: ['\'self\'', 'www.google.com', 'www.gstatic.com', 'geolytix.xyz'],
            imgSrc: ['\'self\'', '*.tile.openstreetmap.org', 'api.mapbox.com', 'res.cloudinary.com', 'geolytix.xyz', 'data:']
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
module.exports = fastify => {

    // Create constructor for mobile detect module.
    const Md = require('mobile-detect');

    // Set jsrender module for server-side templates.
    const jsr = require('jsrender');

    fastify.get('/', (req, res) => getSite(req, res));

    fastify.get('/cn', (req, res) => cn(req, res));

    fastify.get('/jp', (req, res) => jp(req, res));

    fastify.get('/de', (req, res) => de(req, res));

    fastify.get('/pl', (req, res) => pl(req, res));

    function getSite(req, res) {

        if (req.headers['x-forwarded-host'] && req.headers['x-forwarded-host'].includes('.cn'))
            return cn(req, res);

        if (req.headers['x-forwarded-host'] && req.headers['x-forwarded-host'].includes('.jp'))
            return jp(req, res);

        if (req.headers['x-forwarded-host'] && req.headers['x-forwarded-host'].includes('.de')) {
            return de(req, res);
        }

        if (req.headers['x-forwarded-host'] && req.headers['x-forwarded-host'].includes('.pl')) {
            return pl(req, res);
        }

        uk(req, res);
    }

    function uk(req, res) {

        const md = new Md(req.headers['user-agent']);

        const platform = (md.mobile() === null || md.tablet() !== null) ? 'desktop' : 'mobiles';

        res.type('text/html').send(jsr.templates('./views/' + platform + '.html').render({
            locale: 'uk',
            office: 1,
            meta: 'Location Planning experts providing retail & demographic data worldwide. We find the right network strategy solution for our customers.',
            header: './public/tmpl/' + platform + '/uk/header.html',
            header_css: '<link rel="stylesheet" type="text/css" href="/css/' + platform + '_header_white.css"/>',
            services: './public/tmpl/' + platform + '/uk/services.html',
            case_studies: './public/tmpl/' + platform + '/uk/case_studies.html',
            team: './public/tmpl/' + platform + '/uk/team.html',
            geodata: './public/tmpl/' + platform + '/uk/geodata.html',
            footer: './public/tmpl/' + platform + '/uk/footer.html'
        }));
    }

    function cn(req, res) {

        const md = new Md(req.headers['user-agent']);

        const platform = (md.mobile() === null || md.tablet() !== null) ? 'desktop' : 'mobiles';

        res.type('text/html').send(jsr.templates('./views/' + platform + '.html').render({
            locale: 'cn',
            office: 4,
            meta: '为英国，欧洲及美洲的零售商及投资者提供门店选址，人口统计资料分析，客户及市场洞察的数据及专业服务。',
            header: './public/tmpl/' + platform + '/cn/header.html',
            header_css: '<link rel="stylesheet" type="text/css" href="/css/' + platform + '_header_black.css"/>',
            services: './public/tmpl/' + platform + '/cn/services.html',
            team: './public/tmpl/' + platform + '/cn/team.html',
            footer: './public/tmpl/' + platform + '/cn/footer.html'
        }));
    }

    function jp(req, res) {

        const md = new Md(req.headers['user-agent']);

        const platform = (md.mobile() === null || md.tablet() !== null) ? 'desktop' : 'mobiles';

        res.type('text/html').send(jsr.templates('./views/' + platform + '.html').render({
            locale: 'jp',
            office: 3,
            meta: 'Location Planning experts providing retail & demographic data worldwide. We find the right network strategy solution for our customers.',
            header: './public/tmpl/' + platform + '/jp/header.html',
            header_css: '<link rel="stylesheet" type="text/css" href="/css/' + platform + '_header_black.css"/>',
            services: './public/tmpl/' + platform + '/jp/services.html',
            team: './public/tmpl/' + platform + '/jp/team.html',
            footer: './public/tmpl/' + platform + '/jp/footer.html'
        }));
    }

    function de(req, res) {

        const md = new Md(req.headers['user-agent']);

        const platform = (md.mobile() === null || md.tablet() !== null) ? 'desktop' : 'mobiles';

        res.type('text/html').send(jsr.templates('./views/' + platform + '.html').render({
            locale: 'de',
            office: 5,
            meta: 'Experten für Standortplanung, die Daten aus dem Einzelhandel und demografische Daten weltweit bereitstellen. Wir finden die richtige Netzwerkstrategie für unsere Kunden.',
            header: './public/tmpl/' + platform + '/de/header.html',
            header_css: '<link rel="stylesheet" type="text/css" href="/css/' + platform + '_header_white.css"/>',
            services: './public/tmpl/' + platform + '/de/services.html',
            case_studies: './public/tmpl/' + platform + '/de/case_studies.html',
            team: './public/tmpl/' + platform + '/de/team.html',
            footer: './public/tmpl/' + platform + '/de/footer.html'
        }));
    }

    function pl(req, res) {

        const md = new Md(req.headers['user-agent']);

        const platform = (md.mobile() === null || md.tablet() !== null) ? 'desktop' : 'mobiles';

        res.type('text/html').send(jsr.templates('./views/' + platform + '.html').render({
            locale: 'pl',
            office: 6,
            meta: 'Eksperci ds. analiz przestrzennych i lokalizacyjnych świadczący uslugi doradcze dla klientów na całym świecie. Dane, które posiadamy z zakresu demografii oraz handlu detalicznego wraz z naszą wiedzą ekspercką służą nam do zaplanowania sieci detalicznych dla naszych klentów.',
            header: './public/tmpl/' + platform + '/pl/header.html',
            header_css: '<link rel="stylesheet" type="text/css" href="/css/' + platform + '_header_white.css"/>',
            services: './public/tmpl/' + platform + '/pl/services.html',
            case_studies: './public/tmpl/' + platform + '/pl/case_studies.html',
            team: './public/tmpl/' + platform + '/pl/team.html',
            footer: './public/tmpl/' + platform + '/pl/footer.html'
        }));
    }

}
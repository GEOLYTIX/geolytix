// Create constructor for mobile detect module.
const Md = require('mobile-detect');

const path = require('path');

const fs = require('fs');

const template = require('backtick-template');

module.exports = (req, res) => {

    const md = new Md(req.headers['user-agent']);

    const platform = (md.mobile() === null || md.tablet() !== null) ? 'desktop' : 'mobile';

    const partials = {
        header: fs.readFileSync(path.join(process.cwd(), `public/html/${platform}/header.html`), 'utf8'),
        services: fs.readFileSync(path.join(process.cwd(), `public/html/${platform}/services.html`), 'utf8'),
        case_studies: fs.readFileSync(path.join(process.cwd(), `public/html/${platform}/case_studies.html`), 'utf8'),
        team: fs.readFileSync(path.join(process.cwd(), `public/html/${platform}/team.html`), 'utf8'),
        geodata: fs.readFileSync(path.join(process.cwd(), `public/html/${platform}/geodata.html`), 'utf8'),
        footer: fs.readFileSync(path.join(process.cwd(), `public/html/${platform}/footer.html`), 'utf8'),
    }

    const html = template(
        fs.readFileSync(path.join(process.cwd(), `public/html/${platform}.html`), 'utf8'),
        {
            meta: 'Location Planning experts providing retail & demographic data worldwide. We find the right network strategy solution for our customers.',
            header_css: `<link rel="stylesheet" type="text/css" href="/css/${platform}_header_white.css"/>`,
            locale: 'uk',
            office: 1,
            ...partials
        });

    res.send(html);
}
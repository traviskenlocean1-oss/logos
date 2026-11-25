// Wraps the logo page as a standalone, unlisted web page in ../site
const fs = require('fs');
const page = fs.readFileSync(__dirname + '/ev-roadside-logos.html', 'utf8');
const url = 'https://ev-roadside-logos.traviskenlocean1.workers.dev';
const cut = page.indexOf('<div class="wrap">');
const head = page.slice(0, cut).replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '');
fs.writeFileSync(__dirname + '/../site/index.html', '<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="robots" content="noindex,nofollow"><meta name="description" content="Twenty logo directions for EV Roadside."><meta property="og:title" content="EV Roadside Logos"><meta property="og:description" content="20 logo directions. Pick your favorites by number."><meta property="og:image" content="' + url + '/preview.png"><meta property="og:url" content="' + url + '/">\n' + head + '<style>*{box-sizing:border-box}body{margin:0}</style></head><body>' + page.slice(cut) + '</body></html>\n');

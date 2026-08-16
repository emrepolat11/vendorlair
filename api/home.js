export default async function handler(req, res) {
  const sourceUrl = 'https://raw.githubusercontent.com/emrepolat11/vendorlair/feature/action-centre-implement/index.html';
  const response = await fetch(sourceUrl, { cache: 'no-store' });
  let html = await response.text();

  html = html.replace(
    '<h1>Know every vendor.<br>Know what needs<br>your <em>attention.</em></h1>',
    '<h1>Know every<br>vendor in<br>your <em>lair.</em></h1>'
  );

  html = html.replace(
    'padding-top:98px;padding-bottom:70px',
    'padding-top:98px;padding-bottom:24px'
  );

  html = html.replace(
    '.section{padding:95px 0}',
    '.section{padding:48px 0 95px}'
  );

  html = html.replace(
    '.section{padding:65px 0}',
    '.section{padding:36px 0 65px}'
  );

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).send(html);
}

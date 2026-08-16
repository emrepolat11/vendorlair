export default async function handler(req, res) {
  const sourceUrl = 'https://raw.githubusercontent.com/emrepolat11/vendorlair/feature/action-centre-implement/index.html';
  const response = await fetch(sourceUrl, { cache: 'no-store' });
  let html = await response.text();

  html = html.replace(
    '<h1>Know every vendor.<br>Know what needs<br>your <em>attention.</em></h1>',
    '<h1>Know every<br>vendor in<br>your <em>lair.</em></h1>'
  );

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).send(html);
}

module.exports = async function handler(req, res) {
  try {
    const host = process.env.VERCEL_URL;
    const response = await fetch(`https://${host}/index.html`);
    if (!response.ok) throw new Error(`Could not load landing page: ${response.status}`);

    const html = await response.text();
    const updated = html.replace(
      '<h1>Know every vendor.<br>Know what needs<br>your <em>attention.</em></h1>',
      '<h1>Know every<br>vendor in<br>your <em>lair.</em></h1>'
    );

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.status(200).send(updated);
  } catch (error) {
    res.status(500).send('Unable to load VendorLair landing page.');
  }
};

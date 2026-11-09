export default function handler(req, res) {
  res.setHeader("Location", "/");
  res.status(308).end();
}

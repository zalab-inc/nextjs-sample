import fetch from 'isomorphic-unfetch';

const posts = async (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = 200
  const s = req.body;


  const p = await fetch('https://jsonplaceholder.typicode.com/comments?postId=1');
  const data = await p.json();
  res.end(JSON.stringify({
    data: s,
  }))
}

export default posts;
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { endpoint, params } = req.body;

    let url = '';

    if (endpoint === 'sms') {
      const { number, source } = params;
      url = `https://premium.ikangoo.com/api/access-data-psms.php?key=BDFKJBDJB2123&number=${number}`;
      if (source) url += `&source=${encodeURIComponent(source)}`;
    } else if (endpoint === 'leads') {
      const { dateStart, dateEnd } = params;
      url = `https://products.ikangoo.com/api/helper/get-leads?username=abdala1996&key=BDFKJBDJB2123`;
      if (dateStart) url += `&dateStart=${dateStart}`;
      if (dateEnd) url += `&dateEnd=${dateEnd}`;
    } else if (endpoint === 'offers') {
      const { flow, country, operator, category } = params;
      url = `https://products.ikangoo.com/api/helper/get-offers?username=abdala1996&key=BDFKJBDJB2123`;
      if (flow && flow !== 'ALL') url += `&flow=${flow}`;
      if (country) url += `&country=${country}`;
      if (operator) url += `&operator=${operator}`;
      if (category) url += `&category=${category}`;
    } else {
      return res.status(400).json({ error: 'Invalid endpoint' });
    }

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({ error: error.message });
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const origin = req.headers.origin || '';
  const host = req.headers.host || '';
  if (!origin.endsWith('://' + host)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is missing.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session: {
          type: 'realtime',
          model: 'gpt-realtime-2',
          instructions: 'أنت مساعد صوتي شخصي لأبو أمجد (ماجد)، مطور عربي مستقل من السعودية. تكلم دائمًا بلهجة سعودية بيضاء طبيعية كصديق مقرّب، بنبرة دافئة ومرتاحة وإيقاع طبيعي وجمل قصيرة، ولا تتكلم بالفصحى إلا إذا طلب. اجعل الرد على السؤال البسيط قصيرًا، وما يحتاج شرحًا اشرحه بوضوح دون تعداد أو تنسيق. لا تدّعِ أنك نفذت شيئًا لم تنفذه، وفي هذه المرحلة لا تملك أدوات للبريد أو GitHub فقل ذلك بصراحة عند الطلب. انطق الكلمات التقنية الإنجليزية مثل React وGitHub بشكل طبيعي.',
          audio: { output: { voice: 'marin' } },
        },
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.value) {
      return res
        .status(response.ok ? 502 : response.status)
        .json({ error: data.error || 'Failed to create realtime session' });
    }

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ value: data.value, expires_at: data.expires_at });
  } catch (e) {
    console.error('Realtime token error:', e);
    return res.status(500).json({ error: e.message || 'Unexpected error' });
  }
}

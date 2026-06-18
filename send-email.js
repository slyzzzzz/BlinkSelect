const https = require('https');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { type, to, prenom, marque, date, creneau, ref } = req.body;
  const API_KEY = process.env.BREVO_API_KEY;
  const SENDER_EMAIL = process.env.SENDER_EMAIL || 'o.blink@hotmail.com';
  const SENDER_NAME = 'Blink Sélect';

  if (!API_KEY) return res.status(500).json({ error: 'API key manquante' });

  let subject, htmlContent;

  if (type === 'pending') {
    subject = 'Votre demande est en cours d\'examen — Blink Sélect';
    htmlContent = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  body{font-family:'Helvetica Neue',Arial,sans-serif;background:#FAFAF8;margin:0;padding:0}
  .wrap{max-width:560px;margin:40px auto;background:#fff;border:1px solid #E5E5E0}
  .header{background:#1A1A18;padding:32px 40px}
  .logo{font-size:20px;letter-spacing:0.06em;color:#B8A87A;font-weight:500}
  .logo em{color:#B8A87A;font-style:normal}
  .body{padding:40px}
  .tag{font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#B8A87A;margin-bottom:12px}
  h1{font-size:24px;font-weight:400;color:#1A1A18;margin:0 0 16px}
  p{font-size:14px;color:#6B6B65;line-height:1.8;margin:0 0 16px}
  .recap{background:#FAFAF8;border:1px solid #E5E5E0;padding:20px;margin:24px 0}
  .recap-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #E5E5E0;font-size:13px}
  .recap-row:last-child{border:none}
  .recap-row span:first-child{color:#6B6B65}
  .recap-row span:last-child{font-weight:500;color:#1A1A18}
  .info{background:#fff8e8;border:1px solid #d4b86a;padding:16px;font-size:13px;color:#9a7d2e;line-height:1.7}
  .footer{padding:24px 40px;border-top:1px solid #E5E5E0;font-size:12px;color:#6B6B65}
</style>
</head>
<body>
<div class="wrap">
  <div class="header"><div class="logo">Blink <em>Sélect</em></div></div>
  <div class="body">
    <div class="tag">Demande reçue</div>
    <h1>Bonjour ${prenom},</h1>
    <p>Nous avons bien reçu votre demande de réservation pour la vente privée <strong>${marque}</strong>. Notre équipe examine votre dossier en ce moment.</p>
    <div class="recap">
      <div class="recap-row"><span>Marque</span><span>${marque}</span></div>
      <div class="recap-row"><span>Date</span><span>${date}</span></div>
      <div class="recap-row"><span>Créneau demandé</span><span>${creneau}</span></div>
      <div class="recap-row"><span>Référence</span><span>${ref}</span></div>
    </div>
    <div class="info">⏳ Nous recevons beaucoup de demandes pour cette vente. Vous recevrez une réponse sous <strong>10 à 30 minutes</strong>. Pensez à vérifier vos spams.</div>
  </div>
  <div class="footer">Blink Sélect · o.blink@hotmail.com<br>Vous recevez cet email car vous avez effectué une demande sur blink-select.vercel.app</div>
</div>
</body></html>`;
  } else if (type === 'confirmed') {
    subject = '🎉 Félicitations, vous êtes accepté ! — Blink Sélect';
    htmlContent = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  body{font-family:'Helvetica Neue',Arial,sans-serif;background:#FAFAF8;margin:0;padding:0}
  .wrap{max-width:560px;margin:40px auto;background:#fff;border:1px solid #E5E5E0}
  .header{background:#1A1A18;padding:32px 40px}
  .logo{font-size:20px;letter-spacing:0.06em;color:#B8A87A;font-weight:500}
  .body{padding:40px}
  .tag{font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#27704a;margin-bottom:12px}
  h1{font-size:24px;font-weight:400;color:#1A1A18;margin:0 0 16px}
  p{font-size:14px;color:#6B6B65;line-height:1.8;margin:0 0 16px}
  .recap{background:#FAFAF8;border:1px solid #E5E5E0;padding:20px;margin:24px 0}
  .recap-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #E5E5E0;font-size:13px}
  .recap-row:last-child{border:none}
  .recap-row span:first-child{color:#6B6B65}
  .recap-row span:last-child{font-weight:500;color:#1A1A18}
  .badge{display:inline-block;background:#27704a;color:#fff;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;padding:6px 14px;margin-bottom:24px}
  .info{background:#eaf4ee;border:1px solid #b8ddc9;padding:16px;font-size:13px;color:#27704a;line-height:1.7}
  .footer{padding:24px 40px;border-top:1px solid #E5E5E0;font-size:12px;color:#6B6B65}
</style>
</head>
<body>
<div class="wrap">
  <div class="header"><div class="logo">Blink Sélect</div></div>
  <div class="body">
    <div class="tag">✓ Demande acceptée</div>
    <h1>Félicitations ${prenom} !</h1>
    <p>Votre place est confirmée pour la vente privée <strong>${marque}</strong>. Nous avons le plaisir de vous accueillir.</p>
    <div class="badge">✓ Place confirmée</div>
    <div class="recap">
      <div class="recap-row"><span>Marque</span><span>${marque}</span></div>
      <div class="recap-row"><span>Date</span><span>${date}</span></div>
      <div class="recap-row"><span>Créneau</span><span>${creneau}</span></div>
      <div class="recap-row"><span>Référence</span><span>${ref}</span></div>
    </div>
    <div class="info">📎 Votre ticket d'accès est joint à cet email en PDF. Présentez-le à l'entrée de la vente privée.</div>
    <p style="margin-top:24px">À très bientôt,<br><strong>L'équipe Blink Sélect</strong></p>
  </div>
  <div class="footer">Blink Sélect · o.blink@hotmail.com<br>Vous recevez cet email car votre réservation a été confirmée.</div>
</div>
</body></html>`;
  } else if (type === 'inscription') {
    subject = 'Bienvenue chez Blink Sélect !';
    htmlContent = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  body{font-family:'Helvetica Neue',Arial,sans-serif;background:#FAFAF8;margin:0;padding:0}
  .wrap{max-width:560px;margin:40px auto;background:#fff;border:1px solid #E5E5E0}
  .header{background:#1A1A18;padding:32px 40px}
  .logo{font-size:20px;letter-spacing:0.06em;color:#B8A87A;font-weight:500}
  .body{padding:40px}
  .tag{font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#B8A87A;margin-bottom:12px}
  h1{font-size:24px;font-weight:400;color:#1A1A18;margin:0 0 16px}
  p{font-size:14px;color:#6B6B65;line-height:1.8;margin:0 0 16px}
  .footer{padding:24px 40px;border-top:1px solid #E5E5E0;font-size:12px;color:#6B6B65}
</style>
</head>
<body>
<div class="wrap">
  <div class="header"><div class="logo">Blink Sélect</div></div>
  <div class="body">
    <div class="tag">Bienvenue</div>
    <h1>Bonjour ${prenom},</h1>
    <p>Votre compte Blink Sélect a bien été créé. Vous avez désormais accès aux ventes privées réservées à nos membres.</p>
    <p>Connectez-vous et réservez votre prochain créneau avant que les places ne soient prises.</p>
    <p style="margin-top:24px">À très bientôt,<br><strong>L'équipe Blink Sélect</strong></p>
  </div>
  <div class="footer">Blink Sélect · o.blink@hotmail.com</div>
</div>
</body></html>`;
  } else if (type === 'verification') {
    const { code } = req.body;
    subject = 'Votre code de vérification — Blink Sélect';
    htmlContent = `
<!DOCTYPE html>
<html><head><meta charset="UTF-8">
<style>
  body{font-family:'Helvetica Neue',Arial,sans-serif;background:#FAFAF8;margin:0;padding:0}
  .wrap{max-width:560px;margin:40px auto;background:#fff;border:1px solid #E5E5E0}
  .header{background:#1A1A18;padding:32px 40px}
  .logo{font-size:20px;letter-spacing:0.06em;color:#B8A87A;font-weight:500}
  .body{padding:40px}
  .tag{font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#B8A87A;margin-bottom:12px}
  h1{font-size:24px;font-weight:400;color:#1A1A18;margin:0 0 16px}
  p{font-size:14px;color:#6B6B65;line-height:1.8;margin:0 0 16px}
  .code-box{background:#1A1A18;color:#B8A87A;font-size:36px;font-weight:700;letter-spacing:0.3em;text-align:center;padding:28px;margin:28px 0}
  .info{background:#fff8e8;border:1px solid #d4b86a;padding:16px;font-size:13px;color:#9a7d2e;line-height:1.7}
  .footer{padding:24px 40px;border-top:1px solid #E5E5E0;font-size:12px;color:#6B6B65}
</style>
</head>
<body>
<div class="wrap">
  <div class="header"><div class="logo">Blink Sélect</div></div>
  <div class="body">
    <div class="tag">Vérification</div>
    <h1>Bonjour ${prenom},</h1>
    <p>Entrez ce code pour confirmer votre adresse email et finaliser votre inscription.</p>
    <div class="code-box">${code}</div>
    <div class="info">⏱ Ce code est valable <strong>10 minutes</strong>. Ne le partagez avec personne.</div>
  </div>
  <div class="footer">Blink Sélect · o.blink@hotmail.com<br>Si vous n'avez pas créé de compte, ignorez cet email.</div>
</div>
</body></html>`;
  } else {
    return res.status(400).json({ error: 'Type inconnu' });
  }

  const payload = JSON.stringify({
    sender: { name: SENDER_NAME, email: SENDER_EMAIL },
    to: [{ email: to, name: prenom }],
    subject,
    htmlContent
  });

  const options = {
    hostname: 'api.brevo.com',
    path: '/v3/smtp/email',
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': API_KEY,
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(payload)
    }
  };

  return new Promise((resolve) => {
    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', chunk => data += chunk);
      response.on('end', () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          res.status(200).json({ success: true });
        } else {
          res.status(response.statusCode).json({ error: data });
        }
        resolve();
      });
    });
    request.on('error', (e) => { res.status(500).json({ error: e.message }); resolve(); });
    request.write(payload);
    request.end();
  });
};

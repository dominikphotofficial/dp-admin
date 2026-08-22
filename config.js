const emailWrapperStart = `<div style="background-color: #FBF9F6; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;"><div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 4px 4px 0 0; border-top: 4px solid #113939; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">`;
const boxStyle = `border: 1px solid #E5ECE9; padding: 25px; margin: 25px 0; border-radius: 4px;`;
const emailWrapperEnd = `</div><div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px 40px; text-align: center; border-top: 1px solid rgba(17, 57, 57, 0.1); border-radius: 0 0 4px 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);"><h3 style="color: #113939; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 10px 0; font-size: 1em; font-weight: 600;">DP.PORTFOLIO Kontaktai</h3><p style="font-size: 0.9em; color: #555555; margin: 0; line-height: 1.6;">Dominik Šuškevič | dominikphotofficial.lt@gmail.com<br>Instagram: <a href="https://instagram.com/dominikphotofficial" style="color: #113939; text-decoration: none;">@dominikphotofficial</a><br>Web: <a href="https://portfolio.dominikphotofficial.lt" style="color: #113939; text-decoration: none;">portfolio.dominikphotofficial.lt</a></p></div></div>`;

const CONFIG = {
  ADMIN_EMAIL: "dominikphotofficial.lt@gmail.com",
  BRAND_NAME: "DP - ADMIN",
  DEFAULT_BANK_DETAILS: "LT00 0000 0000 0000 0000 (Swedbank)",
  DEFAULT_PAYPAL_EMAIL: "dominikphotofficial.lt@gmail.com",

  firebaseMain: {
    apiKey: "AIzaSyBxhDy4I4HZnqOAvwWE3JyjYsuy_Tg86xE",
    authDomain: "tfp-form.firebaseapp.com",
    projectId: "tfp-form",
    storageBucket: "tfp-form.firebasestorage.app",
    messagingSenderId: "542082314917",
    appId: "1:542082314917:web:5d3a750950a8ac4fd0d34c"
  },

  firebaseClients: {
    apiKey: "AIzaSyDqU4pdpFSCFoirSJUKG08kyJboyKgeEH4",
    authDomain: "clients-dp-portfolio.firebaseapp.com",
    projectId: "clients-dp-portfolio",
    storageBucket: "clients-dp-portfolio.firebasestorage.app",
    messagingSenderId: "850481600153",
    appId: "1:850481600153:web:ad62867d54636ae8434a08"
  },

  templates: {
    lt: {
      New: {
        subject: "DP.PORTFOLIO | Nauja TFP užklausa",
        html: `${emailWrapperStart}<h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}}!</h2><p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Nuoširdžiai dėkojame, kad pasidalinote savo kūrybine vizija. Sėkmingai gavome jūsų <b>TFP fotosesijos</b> užklausą.</p><p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Artimiausiu metu atidžiai peržiūrėsime jūsų idėją ir susisieksime su jumis.</p><div style="${boxStyle}"><p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Užklausos detalės:</b></p><p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Data ir laikas:</b> {{date_time}}</p><p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Vieta:</b> {{location}}</p><p style="margin: 0; color: #1A2B2B;"><b>Idėja:</b> {{idea}}</p></div><p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Jei turite papildomų klausimų, drąsiai atsakykite į šį laišką. Gražios dienos!</p>${emailWrapperEnd}`
      },
      TFPConfirmed: {
        subject: "DP.PORTFOLIO | Patvirtinta: TFP Fotosesija",
        html: `${emailWrapperStart}<h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Puikios naujienos, {{name}}!</h2><p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Mums labai patiko jūsų idėja, todėl su džiaugsmu <b>patvirtiname</b> jūsų TFP fotosesiją.</p><div style="${boxStyle}"><p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Susitikimo informacija:</b></p><p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Data ir laikas:</b> {{date_time}}</p><p style="margin: 0; color: #1A2B2B;"><b>Vieta:</b> {{location}}</p></div><p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Nekantraujame pradėti kurti kartu! Iki greito.</p>${emailWrapperEnd}`
      },
      ServiceConfirmed: {
        subject: "DP.PORTFOLIO | Užsakymas patvirtintas. Reikalingas avansas",
        html: `${emailWrapperStart}<h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}},</h2><p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Jūsų užsakymas (<strong>{{serviceName}}</strong>) yra <b>patvirtintas</b>!</p><p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Norėdami galutinai rezervuoti datą ir laiką, prašome atlikti avansinį mokėjimą.</p><div style="${boxStyle}"><p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Užsakymo detalės:</b></p><p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Data ir laikas:</b> {{date_time}}</p><p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Vieta:</b> {{location}}</p><p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Bendra kaina:</b> {{finalPrice}} €</p><p style="margin: 0; font-weight: bold; color: #113939;">Mokėtinas avansas: {{depositAmount}} €</p></div><p style="font-size: 16px; margin-bottom: 10px; color: #1A2B2B;"><b>Apmokėjimo instrukcijos:</b></p><p style="font-size: 16px; margin: 0 0 5px 0; color: #1A2B2B;">Bankinis pavedimas: <b>{{bankDetails}}</b></p><p style="font-size: 16px; margin: 0 0 15px 0; color: #1A2B2B;">PayPal: <b>{{paypalEmail}}</b></p><p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Atlikę mokėjimą, galite atsakyti į šį laišką. Gavę avansą, atsiųsime patvirtinimą.</p>${emailWrapperEnd}`
      },
      ServiceCompleted: {
        subject: "DP.PORTFOLIO | Paslauga atlikta. Ačiū!",
        html: `${emailWrapperStart}<h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}},</h2><p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Jūsų užsakymas (<strong>{{serviceName}}</strong>) yra sėkmingai atliktas!</p><p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Ačiū, kad pasirinkote DP.PORTFOLIO. Tikimės, kad rezultatas jums patiko ir lauksime sugrįžtant ateityje.</p><div style="${boxStyle}"><p style="margin: 0 0 10px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Dovana jums:</b></p><p style="margin: 0; color: #1A2B2B;">Kito užsakymo metu panaudokite kodą <b>DP10</b> ir gaukite 10% nuolaidą!</p></div>${emailWrapperEnd}`
      }
    },
    en: {
      New: {
        subject: "DP.PORTFOLIO | New Request: TFP Photoshoot",
        html: `${emailWrapperStart}<h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}}!</h2><p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Thank you for sharing your creative vision. We have successfully received your <b>TFP photoshoot</b> request.</p><div style="${boxStyle}"><p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Request Details:</b></p><p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Date & Time:</b> {{date_time}}</p><p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Location:</b> {{location}}</p><p style="margin: 0; color: #1A2B2B;"><b>Idea:</b> {{idea}}</p></div>${emailWrapperEnd}`
      },
      ServiceConfirmed: {
        subject: "DP.PORTFOLIO | Order Confirmed. Deposit Required",
        html: `${emailWrapperStart}<h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}},</h2><p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Your order (<strong>{{serviceName}}</strong>) is <b>confirmed</b>!</p><div style="${boxStyle}"><p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Order Details:</b></p><p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Date & Time:</b> {{date_time}}</p><p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Location:</b> {{location}}</p><p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Total Price:</b> €{{finalPrice}}</p><p style="margin: 0; font-weight: bold; color: #113939;">Deposit to pay: €{{depositAmount}}</p></div><p style="font-size: 16px; margin-bottom: 10px; color: #1A2B2B;"><b>Payment Instructions:</b></p><p style="font-size: 16px; margin: 0 0 5px 0; color: #1A2B2B;">Bank Transfer: <b>{{bankDetails}}</b></p><p style="font-size: 16px; margin: 0 0 15px 0; color: #1A2B2B;">PayPal: <b>{{paypalEmail}}</b></p>${emailWrapperEnd}`
      }
    },
    ru: {
      New: {
        subject: "DP.PORTFOLIO | Новая заявка: TFP Фотосессия",
        html: `${emailWrapperStart}<h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}}!</h2><p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Спасибо, что поделились своей творческой идеей. Мы успешно получили вашу заявку на <b>TFP фотосессию</b>.</p><div style="${boxStyle}"><p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Детали заявки:</b></p><p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Дата и время:</b> {{date_time}}</p><p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Место:</b> {{location}}</p><p style="margin: 0; color: #1A2B2B;"><b>Идея:</b> {{idea}}</p></div>${emailWrapperEnd}`
      },
      ServiceConfirmed: {
        subject: "DP.PORTFOLIO | Заказ подтвержден. Требуется аванс",
        html: `${emailWrapperStart}<h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}},</h2><p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Ваш заказ (<strong>{{serviceName}}</strong>) <b>подтвержден</b>!</p><div style="${boxStyle}"><p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Детали заказа:</b></p><p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Дата и время:</b> {{date_time}}</p><p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Место:</b> {{location}}</p><p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Общая стоимость:</b> €{{finalPrice}}</p><p style="margin: 0; font-weight: bold; color: #113939;">Сумма аванса: €{{depositAmount}}</p></div><p style="font-size: 16px; margin-bottom: 10px; color: #1A2B2B;"><b>Инструкции по оплате:</b></p><p style="font-size: 16px; margin: 0 0 5px 0; color: #1A2B2B;">Реквизиты банка: <b>{{bankDetails}}</b></p><p style="font-size: 16px; margin: 0 0 15px 0; color: #1A2B2B;">PayPal: <b>{{paypalEmail}}</b></p>${emailWrapperEnd}`
      }
    }
  }
};

function buildEmail(templateType, lang, data) {
  const l = (lang || 'lt').toLowerCase();
  const safeLang = CONFIG.templates[l] ? l : 'lt';
  let tpl = CONFIG.templates[safeLang][templateType] || CONFIG.templates['lt']['New'];

  let subject = tpl.subject;
  let html = tpl.html;

  const safeData = {
    ...data,
    bankDetails: CONFIG.DEFAULT_BANK_DETAILS,
    paypalEmail: CONFIG.DEFAULT_PAYPAL_EMAIL
  };

  for (const key in safeData) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    const val = safeData[key] !== undefined && safeData[key] !== null ? safeData[key] : '';
    html = html.replace(regex, val);
    subject = subject.replace(regex, val);
  }

  return { subject, html };
}

window.CONFIG = CONFIG;
window.buildEmail = buildEmail;

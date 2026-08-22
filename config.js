// config.js
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
    appId: "1:542082314917:web:5d3a750950a8ac4fd0d34c",
    measurementId: "G-4VRZRBDHY2"
  },

  firebaseClients: {
    apiKey: "AIzaSyDqU4pdpFSCFoirSJUKG08kyJboyKgeEH4",
    authDomain: "clients-dp-portfolio.firebaseapp.com",
    projectId: "clients-dp-portfolio",
    storageBucket: "clients-dp-portfolio.firebasestorage.app",
    messagingSenderId: "850481600153",
    appId: "1:850481600153:web:ad62867d54636ae8434a08",
    measurementId: "G-0LRSRPYYRF"
  },

  templates: {
    lt: {
      New: {
        subject: "DP.PORTFOLIO | Nauja TFP užklausa",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}}!</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Nuoširdžiai dėkojame, kad pasidalinote savo kūrybine vizija. Sėkmingai gavome jūsų <b>TFP fotosesijos</b> užklausą.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Artimiausiu metu atidžiai peržiūrėsime jūsų idėją ir susisieksime su jumis.</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Užklausos detalės:</b></p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Data ir laikas:</b> {{date_time}}</p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Vieta:</b> {{location}}</p>
            <p style="margin: 0; color: #1A2B2B;"><b>Idėja:</b> {{idea}}</p>
          </div>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Jei turite papildomų klausimų, drąsiai atsakykite į šį laišką. Gražios dienos!</p>
        ${emailWrapperEnd}`
      },
      TFPConfirmed: {
        subject: "DP.PORTFOLIO | Patvirtinta: TFP Fotosesija",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Puikios naujienos, {{name}}!</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Mums labai patiko jūsų idėja, todėl su džiaugsmu <b>patvirtiname</b> jūsų TFP fotosesiją.</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Susitikimo informacija:</b></p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Data ir laikas:</b> {{date_time}}</p>
            <p style="margin: 0; color: #1A2B2B;"><b>Vieta:</b> {{location}}</p>
          </div>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Nekantraujame pradėti kurti kartu! Iki greito.</p>
        ${emailWrapperEnd}`
      },
      TFPRescheduled: {
        subject: "DP.PORTFOLIO | Atnaujinta: TFP Fotosesija",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Norime informuoti, kad jūsų TFP fotosesijos detalės buvo atnaujintos.</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Nauja informacija:</b></p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Data ir laikas:</b> {{date_time}}</p>
            <p style="margin: 0; color: #1A2B2B;"><b>Vieta:</b> {{location}}</p>
          </div>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Jei šis laikas jums netinka, prašome atsakyti į šį laišką. Ačiū už jūsų lankstumą!</p>
        ${emailWrapperEnd}`
      },
      TFPCancelled: {
        subject: "DP.PORTFOLIO | Atšaukta: TFP Fotosesija",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Apgailestaujame, tačiau dėl nenumatytų aplinkybių turime <b>atšaukti</b> jūsų TFP fotosesiją.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Labai vertiname jūsų norą bendradarbiauti ir tikimės, kad ateityje turėsime progą sukurti kažką gražaus kartu.</p>
        ${emailWrapperEnd}`
      },
      TFPCompleted: {
        subject: "DP.PORTFOLIO | Ačiū už fotosesiją!",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}}!</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Didelis ačiū už jūsų laiką, pastangas ir puikią nuotaiką fotosesijos metu!</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Šiuo metu jau dirbame prie jūsų nuotraukų redagavimo. Kai tik jos bus paruoštos, atsiųsime jums nuorodą.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Tikimės, kad rezultatas jums patiks!</p>
        ${emailWrapperEnd}`
      },
      ServiceNew: {
        subject: "DP.PORTFOLIO | Užklausa gauta: {{serviceName}}",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}}!</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Šis laiškas patvirtina, kad sėkmingai gavome jūsų užklausą paslaugai: <strong>{{serviceName}}</strong>.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Artimiausiu metu peržiūrėsime jūsų pageidavimus ir susisieksime dėl detalių patvirtinimo.</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Preliminari informacija:</b></p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Bendra kaina:</b> {{finalPrice}} €</p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Avansas (50%):</b> {{depositAmount}} €</p>
            <p style="margin: 0; color: #1A2B2B;"><b>Pasirinktas apmokėjimo būdas:</b> {{paymentMethod}}</p>
          </div>
          <p style="font-size: 16px; color: #d9534f; line-height: 1.6;"><b>Svarbu:</b> Kol kas jokių mokėjimų atlikti nereikia. Laukite kito laiško su galutiniu patvirtinimu.</p>
        ${emailWrapperEnd}`
      },
      ServiceConfirmed: {
        subject: "DP.PORTFOLIO | Užsakymas patvirtintas. Reikalingas avansas",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Jūsų užsakymas (<strong>{{serviceName}}</strong>) yra <b>patvirtintas</b>!</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Norėdami galutinai rezervuoti datą ir laiką, prašome atlikti avansinį mokėjimą.</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Užsakymo detalės:</b></p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Data ir laikas:</b> {{date_time}}</p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Vieta:</b> {{location}}</p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Bendra kaina:</b> {{finalPrice}} €</p>
            <p style="margin: 0; font-weight: bold; color: #113939;">Mokėtinas avansas: {{depositAmount}} €</p>
          </div>
          <p style="font-size: 16px; margin-bottom: 10px; color: #1A2B2B;"><b>Apmokėjimo instrukcijos:</b></p>
          <p style="font-size: 16px; margin: 0 0 5px 0; color: #1A2B2B;">Bankinis pavedimas: <b>{{bankDetails}}</b></p>
          <p style="font-size: 16px; margin: 0 0 15px 0; color: #1A2B2B;">PayPal: <b>{{paypalEmail}}</b></p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Atlikę mokėjimą, galite atsakyti į šį laišką. Gavę avansą, atsiųsime patvirtinimą.</p>
        ${emailWrapperEnd}`
      },
      ServiceDepositPaid: {
        subject: "DP.PORTFOLIO | Avansas gautas. Rezervacija patvirtinta!",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Sėkmingai gavome jūsų avansinį mokėjimą ({{depositAmount}} €) už paslaugą <strong>{{serviceName}}</strong>.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Jūsų rezervacija yra pilnai patvirtinta. Susitiksime sutartu laiku!</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Data ir laikas:</b> {{date_time}}</p>
            <p style="margin: 0; color: #1A2B2B;"><b>Vieta:</b> {{location}}</p>
          </div>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Likutį ({{remainingAmount}} €) galėsite apmokėti po paslaugos atlikimo.</p>
        ${emailWrapperEnd}`
      },
      ServiceFullyPaid: {
        subject: "DP.PORTFOLIO | Pilnas apmokėjimas gautas",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Informuojame, kad sėkmingai gavome pilną apmokėjimą už paslaugą <strong>{{serviceName}}</strong>.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Nuoširdžiai dėkojame už bendradarbiavimą!</p>
        ${emailWrapperEnd}`
      },
      ServiceCompleted: {
        subject: "DP.PORTFOLIO | Paslauga atlikta. Ačiū!",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Jūsų užsakymas (<strong>{{serviceName}}</strong>) yra sėkmingai atliktas!</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Ačiū, kad pasirinkote DP.PORTFOLIO. Tikimės, kad rezultatas jums patiko ir lauksime sugrįžtant ateityje.</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 10px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Dovana jums:</b></p>
            <p style="margin: 0; color: #1A2B2B;">Kito užsakymo metu panaudokite kodą <b>DP10</b> ir gaukite 10% nuolaidą!</p>
          </div>
        ${emailWrapperEnd}`
      },
      ServiceCancelled: {
        subject: "DP.PORTFOLIO | Užsakymas atšauktas",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Informuojame, kad jūsų užsakymas (<strong>{{serviceName}}</strong>) buvo atšauktas.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Jei tai įvyko per klaidą arba turite klausimų, prašome susisiekti su mumis.</p>
        ${emailWrapperEnd}`
      },
      ServiceStatusUpdate: {
        subject: "DP.PORTFOLIO | Užsakymo statusas: {{status}}",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Informuojame, kad jūsų užsakymo (<strong>{{serviceName}}</strong>) statusas buvo atnaujintas.</p>
          <div style="${boxStyle}">
            <p style="margin: 0; font-size: 1.1em; color: #1A2B2B;"><b>Naujas statusas:</b> <span style="color: #113939; font-weight: bold; text-transform: uppercase;">{{status}}</span></p>
          </div>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Jei turite klausimų, tiesiog atsakykite į šį laišką.</p>
        ${emailWrapperEnd}`
      }
    },
    en: {
      New: {
        subject: "DP.PORTFOLIO | New Request: TFP Photoshoot",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}}!</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Thank you for sharing your creative vision. We have successfully received your <b>TFP photoshoot</b> request.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">We will carefully review your idea and get back to you shortly.</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Request Details:</b></p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Date & Time:</b> {{date_time}}</p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Location:</b> {{location}}</p>
            <p style="margin: 0; color: #1A2B2B;"><b>Idea:</b> {{idea}}</p>
          </div>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">If you have any additional questions, feel free to reply to this email. Have a great day!</p>
        ${emailWrapperEnd}`
      },
      TFPConfirmed: {
        subject: "DP.PORTFOLIO | Confirmed: TFP Photoshoot",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Great news, {{name}}!</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">We absolutely loved your idea and are thrilled to <b>confirm</b> your TFP photoshoot.</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Meeting Details:</b></p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Date & Time:</b> {{date_time}}</p>
            <p style="margin: 0; color: #1A2B2B;"><b>Location:</b> {{location}}</p>
          </div>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">We can't wait to start creating together! See you soon.</p>
        ${emailWrapperEnd}`
      },
      TFPRescheduled: {
        subject: "DP.PORTFOLIO | Rescheduled: TFP Photoshoot",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">We wanted to let you know that your TFP photoshoot details have been updated.</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>New Details:</b></p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Date & Time:</b> {{date_time}}</p>
            <p style="margin: 0; color: #1A2B2B;"><b>Location:</b> {{location}}</p>
          </div>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">If this new time doesn't work for you, please reply to this email. Thank you for your flexibility!</p>
        ${emailWrapperEnd}`
      },
      TFPCancelled: {
        subject: "DP.PORTFOLIO | Cancelled: TFP Photoshoot",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">We sincerely apologize, but due to unforeseen circumstances, we have to <b>cancel</b> your TFP photoshoot.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">We truly appreciate your interest and hope we will have the opportunity to create something beautiful together in the future.</p>
        ${emailWrapperEnd}`
      },
      TFPCompleted: {
        subject: "DP.PORTFOLIO | Thank you for the photoshoot!",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}}!</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">A huge thank you for your time, effort, and great energy during the photoshoot!</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">We are currently working on editing your photos. As soon as they are ready, we will send you a link.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">We hope you will love the final result!</p>
        ${emailWrapperEnd}`
      },
      ServiceNew: {
        subject: "DP.PORTFOLIO | Request Received: {{serviceName}}",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}}!</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">This email confirms that we have successfully received your request for: <strong>{{serviceName}}</strong>.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">We will review your information shortly and contact you to confirm the details.</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Preliminary Details:</b></p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Total Price:</b> €{{finalPrice}}</p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Deposit (50%):</b> €{{depositAmount}}</p>
            <p style="margin: 0; color: #1A2B2B;"><b>Selected Payment Method:</b> {{paymentMethod}}</p>
          </div>
          <p style="font-size: 16px; color: #d9534f; line-height: 1.6;"><b>Important:</b> No payment is required at this stage. Please wait for our final confirmation email.</p>
        ${emailWrapperEnd}`
      },
      ServiceConfirmed: {
        subject: "DP.PORTFOLIO | Order Confirmed. Deposit Required",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Your order (<strong>{{serviceName}}</strong>) is <b>confirmed</b>!</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">To fully secure your date and time, please proceed with the deposit payment.</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Order Details:</b></p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Date & Time:</b> {{date_time}}</p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Location:</b> {{location}}</p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Total Price:</b> €{{finalPrice}}</p>
            <p style="margin: 0; font-weight: bold; color: #113939;">Deposit to pay: €{{depositAmount}}</p>
          </div>
          <p style="font-size: 16px; margin-bottom: 10px; color: #1A2B2B;"><b>Payment Instructions:</b></p>
          <p style="font-size: 16px; margin: 0 0 5px 0; color: #1A2B2B;">Bank Transfer: <b>{{bankDetails}}</b></p>
          <p style="font-size: 16px; margin: 0 0 15px 0; color: #1A2B2B;">PayPal: <b>{{paypalEmail}}</b></p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Once the payment is made, you can reply to this email. We will send a confirmation upon receiving the deposit.</p>
        ${emailWrapperEnd}`
      },
      ServiceDepositPaid: {
        subject: "DP.PORTFOLIO | Deposit Received. Thank you!",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">We have successfully received your deposit payment (€{{depositAmount}}) for <strong>{{serviceName}}</strong>.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Your booking is now fully confirmed. See you at the agreed time!</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Date & Time:</b> {{date_time}}</p>
            <p style="margin: 0; color: #1A2B2B;"><b>Location:</b> {{location}}</p>
          </div>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">The remaining balance (€{{remainingAmount}}) can be paid after the service is completed.</p>
        ${emailWrapperEnd}`
      },
      ServiceFullyPaid: {
        subject: "DP.PORTFOLIO | Full Payment Received",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">We would like to inform you that we have successfully received the full payment for <strong>{{serviceName}}</strong>.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Thank you very much for your cooperation!</p>
        ${emailWrapperEnd}`
      },
      ServiceCompleted: {
        subject: "DP.PORTFOLIO | Service Completed. Thank you!",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Your order (<strong>{{serviceName}}</strong>) has been successfully completed!</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Thank you for choosing DP.PORTFOLIO. We hope you enjoyed the result.</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 10px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>A gift for you:</b></p>
            <p style="margin: 0; color: #1A2B2B;">Use the promo code <b>DP10</b> on your next order to get a 10% discount!</p>
          </div>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">We look forward to working with you again in the future.</p>
        ${emailWrapperEnd}`
      },
      ServiceCancelled: {
        subject: "DP.PORTFOLIO | Order Cancelled",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">We would like to inform you that your order (<strong>{{serviceName}}</strong>) has been cancelled.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">If this was a mistake or if you have any questions, please contact us.</p>
        ${emailWrapperEnd}`
      },
      ServiceStatusUpdate: {
        subject: "DP.PORTFOLIO | Order Status: {{status}}",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">We would like to inform you that the status of your order (<strong>{{serviceName}}</strong>) has been updated.</p>
          <div style="${boxStyle}">
            <p style="margin: 0; font-size: 1.1em; color: #1A2B2B;"><b>New Status:</b> <span style="color: #113939; font-weight: bold; text-transform: uppercase;">{{status}}</span></p>
          </div>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">If you have any questions, simply reply to this email.</p>
        ${emailWrapperEnd}`
      }
    },
    ru: {
      New: {
        subject: "DP.PORTFOLIO | Новая заявка: TFP Фотосессия",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}}!</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Спасибо, что поделились своей творческой идеей. Мы успешно получили вашу заявку на <b>TFP фотосессию</b>.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">В ближайшее время мы внимательно изучим вашу идею и свяжемся с вами.</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Детали заявки:</b></p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Дата и время:</b> {{date_time}}</p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Место:</b> {{location}}</p>
            <p style="margin: 0; color: #1A2B2B;"><b>Идея:</b> {{idea}}</p>
          </div>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Если у вас есть дополнительные вопросы, смело пишите нам в ответ на это письмо. Хорошего дня!</p>
        ${emailWrapperEnd}`
      },
      TFPConfirmed: {
        subject: "DP.PORTFOLIO | Подтверждено: TFP Фотосессия",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Отличные новости, {{name}}!</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Нам безумно понравилась ваша идея, и мы с радостью <b>подтверждаем</b> вашу TFP фотосессию.</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Детали встречи:</b></p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Дата и время:</b> {{date_time}}</p>
            <p style="margin: 0; color: #1A2B2B;"><b>Место:</b> {{location}}</p>
          </div>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">С нетерпением ждем начала совместного творчества! До скорой встречи.</p>
        ${emailWrapperEnd}`
      },
      TFPRescheduled: {
        subject: "DP.PORTFOLIO | Обновлено: TFP Фотосессия",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Хотим сообщить, что детали вашей TFP фотосессии были обновлены.</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Новая информация:</b></p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Дата и время:</b> {{date_time}}</p>
            <p style="margin: 0; color: #1A2B2B;"><b>Место:</b> {{location}}</p>
          </div>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Если это новое время вам не подходит, пожалуйста, ответьте на это письмо. Спасибо за вашу гибкость!</p>
        ${emailWrapperEnd}`
      },
      TFPCancelled: {
        subject: "DP.PORTFOLIO | Отменено: TFP Фотосессия",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Приносим свои извинения, но из-за непредвиденных обстоятельств мы вынуждены <b>отменить</b> вашу TFP фотосессию.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Мы очень ценим ваше желание сотрудничать и надеемся, что в будущем у нас появится возможность создать что-то красивое вместе.</p>
        ${emailWrapperEnd}`
      },
      TFPCompleted: {
        subject: "DP.PORTFOLIO | Спасибо за фотосессию!",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}}!</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Огромное спасибо за ваше время, старания и отличную атмосферу во время фотосессии!</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Сейчас мы уже работаем над обработкой ваших фотографий. Как только они будут готовы, мы пришлем вам ссылку.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Надеемся, результат вам очень понравится!</p>
        ${emailWrapperEnd}`
      },
      ServiceNew: {
        subject: "DP.PORTFOLIO | Заявка получена: {{serviceName}}",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}}!</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Это письмо подтверждает, что мы успешно получили вашу заявку на услугу: <strong>{{serviceName}}</strong>.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">В ближайшее время мы изучим ваши пожелания и свяжемся с вами для подтверждения деталей.</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Предварительная информация:</b></p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Общая стоимость:</b> €{{finalPrice}}</p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Аванс (50%):</b> €{{depositAmount}}</p>
            <p style="margin: 0; color: #1A2B2B;"><b>Способ оплаты:</b> {{paymentMethod}}</p>
          </div>
          <p style="font-size: 16px; color: #d9534f; line-height: 1.6;"><b>Важно:</b> На данном этапе оплачивать ничего не нужно. Ожидайте письмо с окончательным подтверждением.</p>
        ${emailWrapperEnd}`
      },
      ServiceConfirmed: {
        subject: "DP.PORTFOLIO | Заказ подтвержден. Требуется аванс",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Ваш заказ (<strong>{{serviceName}}</strong>) <b>подтвержден</b>!</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Чтобы окончательно забронировать дату и время, пожалуйста, внесите аванс.</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 15px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Детали заказа:</b></p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Дата и время:</b> {{date_time}}</p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Место:</b> {{location}}</p>
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Общая стоимость:</b> €{{finalPrice}}</p>
            <p style="margin: 0; font-weight: bold; color: #113939;">Сумма аванса: €{{depositAmount}}</p>
          </div>
          <p style="font-size: 16px; margin-bottom: 10px; color: #1A2B2B;"><b>Инструкции по оплате:</b></p>
          <p style="font-size: 16px; margin: 0 0 5px 0; color: #1A2B2B;">Реквизиты банка: <b>{{bankDetails}}</b></p>
          <p style="font-size: 16px; margin: 0 0 15px 0; color: #1A2B2B;">PayPal: <b>{{paypalEmail}}</b></p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">После оплаты вы можете ответить на это письмо. Как только мы получим аванс, мы пришлем подтверждение.</p>
        ${emailWrapperEnd}`
      },
      ServiceDepositPaid: {
        subject: "DP.PORTFOLIO | Аванс получен. Спасибо!",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Мы успешно получили ваш аванс (€{{depositAmount}}) за услугу <strong>{{serviceName}}</strong>.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Ваше бронирование полностью подтверждено. До встречи в назначенное время!</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 8px 0; color: #1A2B2B;"><b>Дата и время:</b> {{date_time}}</p>
            <p style="margin: 0; color: #1A2B2B;"><b>Место:</b> {{location}}</p>
          </div>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Остаток (€{{remainingAmount}}) можно будет оплатить после выполнения услуги.</p>
        ${emailWrapperEnd}`
      },
      ServiceFullyPaid: {
        subject: "DP.PORTFOLIO | Полная оплата получена",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Сообщаем, что мы успешно получили полную оплату за услугу <strong>{{serviceName}}</strong>.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Огромное спасибо за сотрудничество!</p>
        ${emailWrapperEnd}`
      },
      ServiceCompleted: {
        subject: "DP.PORTFOLIO | Услуга выполнена. Спасибо!",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Ваш заказ (<strong>{{serviceName}}</strong>) успешно выполнен!</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Спасибо, что выбрали DP.PORTFOLIO. Надеемся, вам понравился результат.</p>
          <div style="${boxStyle}">
            <p style="margin: 0 0 10px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Подарок для вас:</b></p>
            <p style="margin: 0; color: #1A2B2B;">Используйте промокод <b>DP10</b> при следующем заказе и получите скидку 10%!</p>
          </div>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Будем рады поработать с вами снова.</p>
        ${emailWrapperEnd}`
      },
      ServiceCancelled: {
        subject: "DP.PORTFOLIO | Заказ отменен",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Сообщаем, что ваш заказ (<strong>{{serviceName}}</strong>) был отменен.</p>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Если это произошло по ошибке или у вас есть вопросы, пожалуйста, свяжитесь с нами.</p>
        ${emailWrapperEnd}`
      },
      ServiceStatusUpdate: {
        subject: "DP.PORTFOLIO | Статус заказа: {{status}}",
        html: `${emailWrapperStart}
          <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}},</h2>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Хотим сообщить, что статус вашего заказа (<strong>{{serviceName}}</strong>) был обновлен.</p>
          <div style="${boxStyle}">
            <p style="margin: 0; font-size: 1.1em; color: #1A2B2B;"><b>Новый статус:</b> <span style="color: #113939; font-weight: bold; text-transform: uppercase;">{{status}}</span></p>
          </div>
          <p style="font-size: 16px; color: #1A2B2B; line-height: 1.6;">Если у вас есть вопросы, просто ответьте на это письмо.</p>
        ${emailWrapperEnd}`
      }
    }
  }
};

function buildEmail(templateType, lang, data) {
  const l = (lang || 'lt').toLowerCase();
  const safeLang = CONFIG.templates[l] ? l : 'lt';
  
  let tpl = CONFIG.templates[safeLang][templateType];
  if (!tpl) {
    tpl = CONFIG.templates[safeLang]['ServiceStatusUpdate'] || CONFIG.templates['lt']['New'];
  }

  let subject = tpl.subject;
  let html = tpl.html;

  for (const key in data) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, data[key] !== undefined && data[key] !== null ? data[key] : '');
    subject = subject.replace(regex, data[key] !== undefined && data[key] !== null ? data[key] : '');
  }

  return { subject, html };
}

window.CONFIG = CONFIG;
window.buildEmail = buildEmail;

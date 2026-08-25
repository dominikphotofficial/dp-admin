const emailWrapperStart = `
<div style="background-color: #FBF9F6; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 4px; border-top: 4px solid #113939; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
`;

const emailWrapperEnd = `
        <hr style="border: none; border-top: 1px solid #E5ECE9; margin: 30px 0;">
        <p style="font-size: 0.9em; color: #2A5C5C; margin: 0; line-height: 1.6;">
            <b>DP.PORTFOLIO</b><br>
            Dominik Šuškevič<br>
            Instagram: <a href="https://instagram.com/dominikphotofficial" style="color: #113939; text-decoration: none;">@dominikphotofficial</a><br>
            Web: <a href="https://portfolio.dominikphotofficial.lt" style="color: #113939; text-decoration: none;">portfolio.dominikphotofficial.lt</a>
        </p>
    </div>
</div>
`;

const galleryBlockLT = `
<div style="background: #FBF9F6; padding: 30px 20px; border-radius: 4px; text-align: center; margin: 25px 0; border: 1px solid #E5ECE9;">
    <p style="margin: 0 0 20px 0; color: #1A2B2B; font-size: 18px; font-weight: bold;">Jūsų nuotraukos paruoštos!</p>
    <a href="https://client.dominikphotofficial.lt" style="display: inline-block; background-color: #113939; color: #ffffff; padding: 15px 30px; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; border-radius: 4px; margin-bottom: 20px;">Atidaryti Klientų Portalą</a>
    <div style="text-align: left; background: #ffffff; padding: 15px; border-radius: 4px; border: 1px solid #E5ECE9; display: inline-block; margin: 0 auto;">
        <p style="margin: 0 0 5px 0; color: #1A2B2B; font-size: 14px;"><b>Prisijungimo ID (Login):</b> <span style="color: #113939; font-family: monospace; font-size: 16px;">{{clientId}}</span></p>
        <p style="margin: 0; color: #1A2B2B; font-size: 14px;"><b>PIN Kodas (Password):</b> <span style="color: #113939; font-family: monospace; font-size: 16px;">{{galleryPin}}</span></p>
    </div>
</div>
`;

const galleryBlockEN = `
<div style="background: #FBF9F6; padding: 30px 20px; border-radius: 4px; text-align: center; margin: 25px 0; border: 1px solid #E5ECE9;">
    <p style="margin: 0 0 20px 0; color: #1A2B2B; font-size: 18px; font-weight: bold;">Your photos are ready!</p>
    <a href="https://client.dominikphotofficial.lt" style="display: inline-block; background-color: #113939; color: #ffffff; padding: 15px 30px; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; border-radius: 4px; margin-bottom: 20px;">Open Client Portal</a>
    <div style="text-align: left; background: #ffffff; padding: 15px; border-radius: 4px; border: 1px solid #E5ECE9; display: inline-block; margin: 0 auto;">
        <p style="margin: 0 0 5px 0; color: #1A2B2B; font-size: 14px;"><b>Client ID (Login):</b> <span style="color: #113939; font-family: monospace; font-size: 16px;">{{clientId}}</span></p>
        <p style="margin: 0; color: #1A2B2B; font-size: 14px;"><b>PIN Code (Password):</b> <span style="color: #113939; font-family: monospace; font-size: 16px;">{{galleryPin}}</span></p>
    </div>
</div>
`;

const galleryBlockRU = `
<div style="background: #FBF9F6; padding: 30px 20px; border-radius: 4px; text-align: center; margin: 25px 0; border: 1px solid #E5ECE9;">
    <p style="margin: 0 0 20px 0; color: #1A2B2B; font-size: 18px; font-weight: bold;">Ваши фотографии готовы!</p>
    <a href="https://client.dominikphotofficial.lt" style="display: inline-block; background-color: #113939; color: #ffffff; padding: 15px 30px; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; font-size: 14px; border-radius: 4px; margin-bottom: 20px;">Открыть Клиентский Портал</a>
    <div style="text-align: left; background: #ffffff; padding: 15px; border-radius: 4px; border: 1px solid #E5ECE9; display: inline-block; margin: 0 auto;">
        <p style="margin: 0 0 5px 0; color: #1A2B2B; font-size: 14px;"><b>Client ID (Логин):</b> <span style="color: #113939; font-family: monospace; font-size: 16px;">{{clientId}}</span></p>
        <p style="margin: 0; color: #1A2B2B; font-size: 14px;"><b>PIN Код (Пароль):</b> <span style="color: #113939; font-family: monospace; font-size: 16px;">{{galleryPin}}</span></p>
    </div>
</div>
`;

window.CONFIG = {
    ADMIN_EMAIL: "dominikphotofficial.lt@gmail.com",
    BRAND_NAME: "DP.PORTFOLIO",
    
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
            PortalAccess: {
                subject: "DP.PORTFOLIO | Jūsų nuotraukų galerija paruošta!",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}}!</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Džiaugiamės galėdami pranešti, kad jūsų fotosesijos nuotraukos jau paruoštos ir įkeltos į asmeninį klientų portalą.</p>
                    ${galleryBlockLT}
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Ačiū, kad pasirinkote DP.PORTFOLIO. Tikimės, kad rezultatas jums patiks!</p>
                ${emailWrapperEnd}`
            },
            TFPConfirmed: {
                subject: "DP.PORTFOLIO | Patvirtinta: TFP Fotosesija",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Puikios naujienos, {{name}}!</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Mums labai patiko jūsų idėja, todėl su džiaugsmu <b>patvirtiname</b> jūsų TFP fotosesiją.</p>
                    <div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;">
                        <p style="margin: 0 0 10px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Susitikimo informacija:</b></p>
                        <p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Data ir laikas:</b> {{date_time}}</p>
                        <p style="margin: 0; color: #1A2B2B;"><b>Vieta:</b> {{location}}</p>
                    </div>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Nekantraujame pradėti kurti kartu! Iki greito.</p>
                ${emailWrapperEnd}`
            },
            TFPRescheduled: {
                subject: "DP.PORTFOLIO | Atnaujinta: TFP Fotosesija",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Norime informuoti, kad jūsų TFP fotosesijos detalės buvo atnaujintos.</p>
                    <div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;">
                        <p style="margin: 0 0 10px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Nauja informacija:</b></p>
                        <p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Data ir laikas:</b> {{date_time}}</p>
                        <p style="margin: 0; color: #1A2B2B;"><b>Vieta:</b> {{location}}</p>
                    </div>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Jei šis laikas jums netinka, prašome atsakyti į šį laišką. Ačiū už jūsų lankstumą!</p>
                ${emailWrapperEnd}`
            },
            TFPCancelled: {
                subject: "DP.PORTFOLIO | Atšaukta: TFP Fotosesija",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Apgailestaujame, tačiau dėl nenumatytų aplinkybių turime <b>atšaukti</b> jūsų TFP fotosesiją.</p>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Labai vertiname jūsų norą bendradarbiauti ir tikimės, kad ateityje turėsime progą sukurti kažką gražaus kartu.</p>
                ${emailWrapperEnd}`
            },
            TFPCompleted: {
                subject: "DP.PORTFOLIO | Ačiū už fotosesiją!",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}}!</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Didelis ačiū už jūsų laiką, pastangas ir puikią nuotaiką fotosesijos metu!</p>
                    ${galleryBlockLT}
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Tikimės, kad rezultatas jums patiks!</p>
                ${emailWrapperEnd}`
            },
            ServiceConfirmed: {
                subject: "DP.PORTFOLIO | Užsakymas patvirtintas",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Jūsų užsakymas (<strong>{{serviceName}}</strong>) yra <b>patvirtintas</b>!</p>
                    <div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;">
                        <p style="margin: 0 0 10px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Užsakymo detalės:</b></p>
                        <p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Data ir laikas:</b> {{date_time}}</p>
                        <p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Vieta:</b> {{location}}</p>
                        <p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Bendra kaina:</b> {{finalPrice}} €</p>
                        <p style="margin: 0; color: #1A2B2B;"><b>Avansas (50%):</b> {{depositAmount}} €</p>
                    </div>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Prašome atlikti avansinį mokėjimą, kad galutinai rezervuotume laiką.</p>
                ${emailWrapperEnd}`
            },
            ServiceDepositPaid: {
                subject: "DP.PORTFOLIO | Avansas gautas. Ačiū!",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Sėkmingai gavome jūsų avansinį mokėjimą ({{depositAmount}} €) už paslaugą <strong>{{serviceName}}</strong>.</p>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Jūsų rezervacija yra pilnai patvirtinta. Susitiksime sutartu laiku!</p>
                    <div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;">
                        <p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Data ir laikas:</b> {{date_time}}</p>
                        <p style="margin: 0; color: #1A2B2B;"><b>Vieta:</b> {{location}}</p>
                    </div>
                ${emailWrapperEnd}`
            },
            ServiceFullyPaid: {
                subject: "DP.PORTFOLIO | Pilnas apmokėjimas gautas",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Informuojame, kad sėkmingai gavome pilną apmokėjimą už paslaugą <strong>{{serviceName}}</strong>.</p>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Nuoširdžiai dėkojame už bendradarbiavimą!</p>
                ${emailWrapperEnd}`
            },
            ServiceCompleted: {
                subject: "DP.PORTFOLIO | Paslauga atlikta. Ačiū!",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Jūsų užsakymas (<strong>{{serviceName}}</strong>) yra sėkmingai atliktas!</p>
                    ${galleryBlockLT}
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Ačiū, kad pasirinkote DP.PORTFOLIO. Tikimės, kad rezultatas jums patiko ir lauksime sugrįžtant ateityje.</p>
                ${emailWrapperEnd}`
            },
            ServiceCancelled: {
                subject: "DP.PORTFOLIO | Užsakymas atšauktas",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Informuojame, kad jūsų užsakymas (<strong>{{serviceName}}</strong>) buvo atšauktas.</p>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Jei tai įvyko per klaidą arba turite klausimų, prašome susisiekti su mumis.</p>
                ${emailWrapperEnd}`
            },
            ServiceStatusUpdate: {
                subject: "DP.PORTFOLIO | Užsakymo statusas: {{status}}",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Informuojame, kad jūsų užsakymo (<strong>{{serviceName}}</strong>) statusas buvo atnaujintas.</p>
                    <div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;">
                        <p style="margin: 0; font-size: 1.1em; color: #1A2B2B;"><b>Naujas statusas:</b> <span style="color: #2A5C5C; font-weight: bold; text-transform: uppercase;">{{status}}</span></p>
                    </div>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Jei turite klausimų, tiesiog atsakykite į šį laišką.</p>
                ${emailWrapperEnd}`
            }
        },
        en: {
            PortalAccess: {
                subject: "DP.PORTFOLIO | Your photo gallery is ready!",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}}!</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">We are excited to let you know that your photos are ready and uploaded to your personal client portal.</p>
                    ${galleryBlockEN}
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Thank you for choosing DP.PORTFOLIO. We hope you love the results!</p>
                ${emailWrapperEnd}`
            },
            TFPConfirmed: {
                subject: "DP.PORTFOLIO | Confirmed: TFP Photoshoot",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Great news, {{name}}!</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">We absolutely loved your idea and are thrilled to <b>confirm</b> your TFP photoshoot.</p>
                    <div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;">
                        <p style="margin: 0 0 10px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Meeting Details:</b></p>
                        <p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Date & Time:</b> {{date_time}}</p>
                        <p style="margin: 0; color: #1A2B2B;"><b>Location:</b> {{location}}</p>
                    </div>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">We can't wait to start creating together! See you soon.</p>
                ${emailWrapperEnd}`
            },
            TFPRescheduled: {
                subject: "DP.PORTFOLIO | Rescheduled: TFP Photoshoot",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">We wanted to let you know that your TFP photoshoot details have been updated.</p>
                    <div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;">
                        <p style="margin: 0 0 10px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>New Details:</b></p>
                        <p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Date & Time:</b> {{date_time}}</p>
                        <p style="margin: 0; color: #1A2B2B;"><b>Location:</b> {{location}}</p>
                    </div>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">If this new time doesn't work for you, please reply to this email. Thank you for your flexibility!</p>
                ${emailWrapperEnd}`
            },
            TFPCancelled: {
                subject: "DP.PORTFOLIO | Cancelled: TFP Photoshoot",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">We sincerely apologize, but due to unforeseen circumstances, we have to <b>cancel</b> your TFP photoshoot.</p>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">We truly appreciate your interest and hope we will have the opportunity to create something beautiful together in the future.</p>
                ${emailWrapperEnd}`
            },
            TFPCompleted: {
                subject: "DP.PORTFOLIO | Thank you for the photoshoot!",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}}!</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">A huge thank you for your time, effort, and great energy during the photoshoot!</p>
                    ${galleryBlockEN}
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">We hope you will love the final result!</p>
                ${emailWrapperEnd}`
            },
            ServiceConfirmed: {
                subject: "DP.PORTFOLIO | Order Confirmed. Deposit Required",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Your order (<strong>{{serviceName}}</strong>) is <b>confirmed</b>!</p>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">To fully secure your date and time, please proceed with the deposit payment.</p>
                    <div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;">
                        <p style="margin: 0 0 10px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Order Details:</b></p>
                        <p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Date & Time:</b> {{date_time}}</p>
                        <p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Location:</b> {{location}}</p>
                        <p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Total Price:</b> €{{finalPrice}}</p>
                        <p style="margin: 0; font-weight: bold; color: #113939;">Deposit to pay: €{{depositAmount}}</p>
                    </div>
                ${emailWrapperEnd}`
            },
            ServiceDepositPaid: {
                subject: "DP.PORTFOLIO | Deposit Received. Thank you!",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">We have successfully received your deposit payment (€{{depositAmount}}) for <strong>{{serviceName}}</strong>.</p>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Your booking is now fully confirmed. See you at the agreed time!</p>
                    <div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;">
                        <p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Date & Time:</b> {{date_time}}</p>
                        <p style="margin: 0; color: #1A2B2B;"><b>Location:</b> {{location}}</p>
                    </div>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">The remaining balance (€{{remainingAmount}}) can be paid after the service is completed.</p>
                ${emailWrapperEnd}`
            },
            ServiceFullyPaid: {
                subject: "DP.PORTFOLIO | Full Payment Received",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">We would like to inform you that we have successfully received the full payment for <strong>{{serviceName}}</strong>.</p>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Thank you very much for your cooperation!</p>
                ${emailWrapperEnd}`
            },
            ServiceCompleted: {
                subject: "DP.PORTFOLIO | Service Completed. Thank you!",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Your order (<strong>{{serviceName}}</strong>) has been successfully completed!</p>
                    ${galleryBlockEN}
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Thank you for choosing DP.PORTFOLIO. We hope you enjoyed the result.</p>
                ${emailWrapperEnd}`
            },
            ServiceCancelled: {
                subject: "DP.PORTFOLIO | Order Cancelled",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">We would like to inform you that your order (<strong>{{serviceName}}</strong>) has been cancelled.</p>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">If this was a mistake or if you have any questions, please contact us.</p>
                ${emailWrapperEnd}`
            },
            ServiceStatusUpdate: {
                subject: "DP.PORTFOLIO | Order Status: {{status}}",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">We would like to inform you that the status of your order (<strong>{{serviceName}}</strong>) has been updated.</p>
                    <div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;">
                        <p style="margin: 0; font-size: 1.1em; color: #1A2B2B;"><b>New Status:</b> <span style="color: #2A5C5C; font-weight: bold; text-transform: uppercase;">{{status}}</span></p>
                    </div>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">If you have any questions, simply reply to this email.</p>
                ${emailWrapperEnd}`
            }
        },
        ru: {
            PortalAccess: {
                subject: "DP.PORTFOLIO | Ваша галерея фотографий готова!",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}}!</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Рады сообщить, что ваши фотографии готовы и загружены в персональный клиентский портал.</p>
                    ${galleryBlockRU}
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Спасибо, что выбрали DP.PORTFOLIO. Надеемся, вам понравится результат!</p>
                ${emailWrapperEnd}`
            },
            TFPConfirmed: {
                subject: "DP.PORTFOLIO | Подтверждено: TFP Фотосессия",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Отличные новости, {{name}}!</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Нам безумно понравилась ваша идея, и мы с радостью <b>подтверждаем</b> вашу TFP фотосессию.</p>
                    <div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;">
                        <p style="margin: 0 0 10px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Детали встречи:</b></p>
                        <p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Дата и время:</b> {{date_time}}</p>
                        <p style="margin: 0; color: #1A2B2B;"><b>Место:</b> {{location}}</p>
                    </div>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">С нетерпением ждем начала совместного творчества! До скорой встречи.</p>
                ${emailWrapperEnd}`
            },
            TFPRescheduled: {
                subject: "DP.PORTFOLIO | Обновлено: TFP Фотосессия",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Хотим сообщить, что детали вашей TFP фотосессии были обновлены.</p>
                    <div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;">
                        <p style="margin: 0 0 10px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Новая информация:</b></p>
                        <p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Дата и время:</b> {{date_time}}</p>
                        <p style="margin: 0; color: #1A2B2B;"><b>Место:</b> {{location}}</p>
                    </div>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Если это новое время вам не подходит, пожалуйста, ответьте на это письмо. Спасибо за вашу гибкость!</p>
                ${emailWrapperEnd}`
            },
            TFPCancelled: {
                subject: "DP.PORTFOLIO | Отменено: TFP Фотосессия",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Приносим свои извинения, но из-за непредвиденных обстоятельств мы вынуждены <b>отменить</b> вашу TFP фотосессию.</p>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Мы очень ценим ваше желание сотрудничать и надеемся, что в будущем у нас появится возможность создать что-то красивое вместе.</p>
                ${emailWrapperEnd}`
            },
            TFPCompleted: {
                subject: "DP.PORTFOLIO | Спасибо за фотосессию!",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}}!</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Огромное спасибо за ваше время, старания и отличную атмосферу во время фотосессии!</p>
                    ${galleryBlockRU}
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Надеемся, результат вам очень понравится!</p>
                ${emailWrapperEnd}`
            },
            ServiceConfirmed: {
                subject: "DP.PORTFOLIO | Заказ подтвержден. Требуется аванс",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Ваш заказ (<strong>{{serviceName}}</strong>) <b>подтвержден</b>!</p>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Чтобы окончательно забронировать дату и время, пожалуйста, внесите аванс.</p>
                    <div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;">
                        <p style="margin: 0 0 10px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Детали заказа:</b></p>
                        <p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Дата и время:</b> {{date_time}}</p>
                        <p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Место:</b> {{location}}</p>
                        <p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Общая стоимость:</b> €{{finalPrice}}</p>
                        <p style="margin: 0; font-weight: bold; color: #113939;">Сумма аванса: €{{depositAmount}}</p>
                    </div>
                ${emailWrapperEnd}`
            },
            ServiceDepositPaid: {
                subject: "DP.PORTFOLIO | Аванс получен. Спасибо!",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Мы успешно получили ваш аванс (€{{depositAmount}}) за услугу <strong>{{serviceName}}</strong>.</p>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Ваше бронирование полностью подтверждено. До встречи в назначенное время!</p>
                    <div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;">
                        <p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Дата и время:</b> {{date_time}}</p>
                        <p style="margin: 0; color: #1A2B2B;"><b>Место:</b> {{location}}</p>
                    </div>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Остаток (€{{remainingAmount}}) можно будет оплатить после выполнения услуги.</p>
                ${emailWrapperEnd}`
            },
            ServiceFullyPaid: {
                subject: "DP.PORTFOLIO | Полная оплата получена",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Сообщаем, что мы успешно получили полную оплату за услугу <strong>{{serviceName}}</strong>.</p>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Огромное спасибо за сотрудничество!</p>
                ${emailWrapperEnd}`
            },
            ServiceCompleted: {
                subject: "DP.PORTFOLIO | Услуга выполнена. Спасибо!",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Ваш заказ (<strong>{{serviceName}}</strong>) успешно выполнен!</p>
                    ${galleryBlockRU}
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Спасибо, что выбрали DP.PORTFOLIO. Надеемся, вам понравился результат.</p>
                ${emailWrapperEnd}`
            },
            ServiceCancelled: {
                subject: "DP.PORTFOLIO | Заказ отменен",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Сообщаем, что ваш заказ (<strong>{{serviceName}}</strong>) был отменен.</p>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Если это произошло по ошибке или у вас есть вопросы, пожалуйста, свяжитесь с нами.</p>
                ${emailWrapperEnd}`
            },
            ServiceStatusUpdate: {
                subject: "DP.PORTFOLIO | Статус заказа: {{status}}",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}},</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Хотим сообщить, что статус вашего заказа (<strong>{{serviceName}}</strong>) был обновлен.</p>
                    <div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;">
                        <p style="margin: 0; font-size: 1.1em; color: #1A2B2B;"><b>Новый статус:</b> <span style="color: #2A5C5C; font-weight: bold; text-transform: uppercase;">{{status}}</span></p>
                    </div>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Если у вас есть вопросы, просто ответьте на это письмо.</p>
                ${emailWrapperEnd}`
            }
        }
    }
};

window.buildEmail = function(templateType, lang, data) {
    const safeLang = window.CONFIG.templates[lang] ? lang : 'lt';
    let tpl = window.CONFIG.templates[safeLang][templateType] || window.CONFIG.templates[safeLang]['PortalAccess'];
    
    let subject = tpl.subject;
    let html = tpl.html;
    
    for (const key in data) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, data[key] || '');
        subject = subject.replace(regex, data[key] || '');
    }
    return { subject, html };
};

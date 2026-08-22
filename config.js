const emailWrapperStart = `
<div style="background-color: #FBF9F6; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 4px; border-top: 4px solid #113939; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
`;

const emailWrapperEnd = `
        <hr style="border: none; border-top: 1px solid #E5ECE9; margin: 30px 0;">
        <p style="font-size: 0.9em; color: #2A5C5C; margin: 0; line-height: 1.6;">
            <b>Dominikphotofficial.lt</b><br>
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
    BRAND_NAME: "Dominikphotofficial.lt",
    
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
                subject: "Dominikphotofficial.lt | Jūsų nuotraukų galerija paruošta!",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Sveiki, {{name}}!</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Džiaugiamės galėdami pranešti, kad jūsų fotosesijos nuotraukos jau paruoštos ir įkeltos į asmeninį klientų portalą.</p>
                    ${galleryBlockLT}
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Ačiū, kad pasirinkote Dominikphotofficial.lt. Tikimės, kad rezultatas jums patiks!</p>
                ${emailWrapperEnd}`
            },
            TFPConfirmed: {
                subject: "Dominikphotofficial.lt | Patvirtinta: TFP Fotosesija",
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
            ServiceConfirmed: {
                subject: "Dominikphotofficial.lt | Užsakymas patvirtintas",
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
            }
        },
        en: {
            PortalAccess: {
                subject: "Dominikphotofficial.lt | Your photo gallery is ready!",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}}!</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">We are excited to let you know that your photos are ready and uploaded to your personal client portal.</p>
                    ${galleryBlockEN}
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Thank you for choosing Dominikphotofficial.lt. We hope you love the results!</p>
                ${emailWrapperEnd}`
            },
            TFPConfirmed: {
                subject: "Dominikphotofficial.lt | Confirmed: TFP Photoshoot",
                html: `${emailWrapperStart}<h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Great news, {{name}}!</h2><p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">We absolutely loved your idea and are thrilled to <b>confirm</b> your TFP photoshoot.</p><div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;"><p style="margin: 0 0 10px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Meeting Details:</b></p><p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Date & Time:</b> {{date_time}}</p><p style="margin: 0; color: #1A2B2B;"><b>Location:</b> {{location}}</p></div><p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">We can't wait to start creating together! See you soon.</p>${emailWrapperEnd}`
            },
            ServiceConfirmed: {
                subject: "Dominikphotofficial.lt | Order Confirmed. Deposit Required",
                html: `${emailWrapperStart}<h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Hello, {{name}},</h2><p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Your order (<strong>{{serviceName}}</strong>) is <b>confirmed</b>!</p><p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">To fully secure your date and time, please proceed with the deposit payment.</p><div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;"><p style="margin: 0 0 10px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Order Details:</b></p><p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Date & Time:</b> {{date_time}}</p><p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Location:</b> {{location}}</p><p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Total Price:</b> €{{finalPrice}}</p><p style="margin: 0; font-weight: bold; color: #113939;">Deposit to pay: €{{depositAmount}}</p></div>${emailWrapperEnd}`
            }
        },
        ru: {
            PortalAccess: {
                subject: "Dominikphotofficial.lt | Ваша галерея фотографий готова!",
                html: `${emailWrapperStart}
                    <h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}}!</h2>
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Рады сообщить, что ваши фотографии готовы и загружены в персональный клиентский портал.</p>
                    ${galleryBlockRU}
                    <p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Спасибо, что выбрали Dominikphotofficial.lt. Надеемся, вам понравится результат!</p>
                ${emailWrapperEnd}`
            },
            TFPConfirmed: {
                subject: "Dominikphotofficial.lt | Подтверждено: TFP Фотосессия",
                html: `${emailWrapperStart}<h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Отличные новости, {{name}}!</h2><p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Нам безумно понравилась ваша идея, и мы с радостью <b>подтверждаем</b> вашу TFP фотосессию.</p><div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;"><p style="margin: 0 0 10px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Детали встречи:</b></p><p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Дата и время:</b> {{date_time}}</p><p style="margin: 0; color: #1A2B2B;"><b>Место:</b> {{location}}</p></div><p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">С нетерпением ждем начала совместного творчества! До скорой встречи.</p>${emailWrapperEnd}`
            },
            ServiceConfirmed: {
                subject: "Dominikphotofficial.lt | Заказ подтвержден. Требуется аванс",
                html: `${emailWrapperStart}<h2 style="color: #113939; font-weight: 300; letter-spacing: 2px; text-transform: uppercase; margin-top: 0;">Здравствуйте, {{name}},</h2><p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Ваш заказ (<strong>{{serviceName}}</strong>) <b>подтвержден</b>!</p><p style="color: #1A2B2B; font-size: 16px; line-height: 1.6;">Чтобы окончательно забронировать дату и время, пожалуйста, внесите аванс.</p><div style="background: #FBF9F6; padding: 20px; border-left: 3px solid #113939; margin: 25px 0;"><p style="margin: 0 0 10px 0; color: #113939; text-transform: uppercase; font-size: 0.85em; letter-spacing: 1px;"><b>Детали заказа:</b></p><p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Дата и время:</b> {{date_time}}</p><p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Место:</b> {{location}}</p><p style="margin: 0 0 5px 0; color: #1A2B2B;"><b>Общая стоимость:</b> €{{finalPrice}}</p><p style="margin: 0; font-weight: bold; color: #113939;">Сумма аванса: €{{depositAmount}}</p></div>${emailWrapperEnd}`
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

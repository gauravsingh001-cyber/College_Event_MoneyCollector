const QRCode = require('qrcode');


async function generateQRCodeDataURL(url) {
return await QRCode.toDataURL(url);
}


module.exports = { generateQRCodeDataURL };
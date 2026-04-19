const QRCode = require('qrcode');

const generateQRCode = async (data) => {
  try {
    const qrCode = await QRCode.toDataURL(JSON.stringify(data));
    return qrCode;
  } catch (error) {
    throw new Error('Failed to generate QR code: ' + error.message);
  }
};

module.exports = {
  generateQRCode,
};

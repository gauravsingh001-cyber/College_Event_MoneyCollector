import React from 'react'


export default function QRDownload({ dataUrl, filename='qr.png' }){
if(!dataUrl) return null
return (
<div>
<img src={dataUrl} alt="qr" style={{width:140}}/>
<div>
<a href={dataUrl} download={filename} className="button" style={{marginTop:8}}>Download QR</a>
</div>
</div>
)
}
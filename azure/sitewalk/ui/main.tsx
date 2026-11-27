import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import Walk from './page';
import Upload from './CloudPhotoUpload';
import Gallery from './CloudPhotoGallery';
import Sync from './LiveStateSync';
import Report from './PdfReportButton';
const deviceKey = 'odiscom-scott-afb-device-id';
const stateKey = 'odiscom-scott-afb-sitewalk-v3';

function Sitewalk(){
  const [error,setError] = useState('');
  const [ready,setReady] = useState(window.location.hash !== '#restore');
  async function restore(file: File){
    try {
      if(file.size > 2*1024*1024) throw Error('The field draft is too large.');
      const draft = JSON.parse(await file.text());
      if(draft.format !== 'odiscom-sitewalk-v3' || typeof draft.deviceId !== 'string' || !draft.deviceId || typeof draft.state !== 'object' || !draft.state) throw Error('Choose a field draft exported from the original sitewalk page.');
      if(localStorage.getItem(stateKey) && !confirm('Replace the draft saved on this device with the selected field draft?')) return;
      localStorage.setItem(deviceKey,draft.deviceId);
      localStorage.setItem(stateKey,JSON.stringify(draft.state));
      history.replaceState(null,'',location.pathname);
      setReady(true);
    } catch(e){setError(e instanceof Error?e.message:'Unable to restore the field draft.');}
  }
  if(!ready) return <main style={{fontFamily:'Arial',padding:24}}><h1>Restore your field draft</h1><p>Choose the draft you exported from the original sitewalk page.</p><input type="file" accept=".json" onChange={e=>{if(e.target.files?.[0]) void restore(e.target.files[0]);}}/>{error&&<p role="alert">{error}</p>}<p><button onClick={()=>setReady(true)}>Continue without importing</button></p></main>;
  return <><Walk/><Upload/><Gallery/><Report/><Sync/></>;
}
createRoot(document.getElementById('root')!).render(<Sitewalk/>);

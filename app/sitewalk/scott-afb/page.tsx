'use client';
import { useEffect, useState } from 'react';

const appUrl = 'https://app-odiscom-sitewalk-6egqd4raqxebe.azurewebsites.net/sitewalk/scott-afb';
const stateKey = 'odiscom-scott-afb-sitewalk-v3';
const deviceKey = 'odiscom-scott-afb-device-id';

export default function SitewalkHandoff() {
  const [draft,setDraft] = useState('');
  useEffect(()=>{
    const state=localStorage.getItem(stateKey);
    if(!state){window.location.replace(appUrl);return;}
    try {
      setDraft(JSON.stringify({format:'odiscom-sitewalk-v3',deviceId:localStorage.getItem(deviceKey)||crypto.randomUUID(),state:JSON.parse(state)}));
    } catch {setDraft('');}
  },[]);
  function exportDraft(){
    const url=URL.createObjectURL(new Blob([draft],{type:'application/json'}));
    const link=document.createElement('a');link.href=url;link.download='Odiscom-sitewalk-device-draft.json';link.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return <main className="mx-auto max-w-xl p-8"><h1 className="text-2xl font-semibold">Staff sitewalk</h1>
    {draft && <><p className="my-4">This device has a saved field draft. Download it here, then sign in to restore it on the staff site.</p><button className="underline" onClick={exportDraft}>Download this device’s draft</button></>}
    <p className="mt-4"><a className="underline" href={appUrl+(draft?'#restore':'')}>Open staff sitewalk</a></p></main>;
}

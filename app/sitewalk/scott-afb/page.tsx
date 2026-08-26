'use client';

import { useEffect, useMemo, useState } from 'react';

type WalkItem = { id: string; section: string; text: string };
type SavedState = { checked: Record<string, boolean>; notes: Record<string, string>; issues: Record<string, boolean>; building: string; general: string };

const items: WalkItem[] = [
  { id:'access', section:'Arrival / Access', text:'Confirm visitor processing, escort requirements, parking, and building access sequence.' },
  { id:'demarc', section:'Carrier / Backbone', text:'Locate existing ISP/carrier demarcation and document provider, handoff type, rack position, power, and available capacity.' },
  { id:'fiber1820', section:'Carrier / Backbone', text:'Verify feasible 10 Gb fiber entrance into Building 1820 and document pathway, distance, penetrations, and firestopping.' },
  { id:'fiber1830', section:'Carrier / Backbone', text:'Verify interbuilding fiber pathway from Building 1820 to Building 1830; measure/estimate route and note existing conduit/handholes.' },
  { id:'fiber1850', section:'Carrier / Backbone', text:'Verify interbuilding fiber pathway from Building 1820 to Building 1850; measure/estimate route and note existing conduit/handholes.' },
  { id:'mdf1820', section:'MDF / IDF', text:'Confirm proposed MDF location in Building 1820: room size, rack space, grounding, HVAC, security, lighting, and dedicated power.' },
  { id:'idf1820a', section:'MDF / IDF', text:'Building 1820 attic IDF #1: exact location, access, mounting, power, pathway, environmental conditions.' },
  { id:'idf1820b', section:'MDF / IDF', text:'Building 1820 attic IDF #2: exact location, access, mounting, power, pathway, environmental conditions.' },
  { id:'idf1830a', section:'MDF / IDF', text:'Building 1830 attic IDF #1: exact location, access, mounting, power, pathway, environmental conditions.' },
  { id:'idf1830b', section:'MDF / IDF', text:'Building 1830 attic IDF #2: exact location, access, mounting, power, pathway, environmental conditions.' },
  { id:'idf1850a', section:'MDF / IDF', text:'Building 1850 attic IDF #1: exact location, access, mounting, power, pathway, environmental conditions.' },
  { id:'idf1850b', section:'MDF / IDF', text:'Building 1850 attic IDF #2: exact location, access, mounting, power, pathway, environmental conditions.' },
  { id:'copper', section:'Horizontal Cabling', text:'Document existing cable pathways, ceilings/attics, wall construction, penetrations, firestopping requirements, and cable route obstacles.' },
  { id:'apmount', section:'Wi-Fi / Ruckus', text:'Identify practical AP mounting locations and note ceiling/wall materials, heights, obstructions, and room/common-area coverage concerns.' },
  { id:'coverage', section:'Wi-Fi / Ruckus', text:'Walk representative resident rooms, corridors, lounges/common areas, stairwells, and exterior-adjacent spaces for RF considerations.' },
  { id:'poe', section:'Switching / Power', text:'Confirm PoE switch locations, available electrical circuits/receptacles, UPS requirements, and any electrical work required.' },
  { id:'rooms', section:'Operations', text:'Confirm occupied-room access limitations, work-hour restrictions, escorts, notification requirements, and phasing constraints.' },
  { id:'sla', section:'Operations', text:'Clarify expectations for 24-hour outage/service-degradation response and required on-base access after award.' },
  { id:'photos', section:'Closeout', text:'Take wide + detail photos of all MDF/IDF, demarc, racks, pathways, handholes, penetrations, power, and representative AP locations.' },
  { id:'questions', section:'Closeout', text:'Capture every item requiring Government clarification before the 28 Aug 2026 9:00 AM question deadline.' }
];

const buildings = ['All Buildings','1820 - Belleville Hall','1830 - Mascoutah Hall','1850 - Shiloh Hall'];
const storeKey = 'odiscom-scott-afb-sitewalk-v1';

export default function ScottAFBSiteWalkPage() {
  const [checked,setChecked] = useState<Record<string,boolean>>({});
  const [notes,setNotes] = useState<Record<string,string>>({});
  const [issues,setIssues] = useState<Record<string,boolean>>({});
  const [building,setBuilding] = useState(buildings[0]);
  const [general,setGeneral] = useState('');
  const [photos,setPhotos] = useState<string[]>([]);
  const [ready,setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storeKey);
      if(raw){ const s:SavedState = JSON.parse(raw); setChecked(s.checked||{}); setNotes(s.notes||{}); setIssues(s.issues||{}); setBuilding(s.building||buildings[0]); setGeneral(s.general||''); }
    } catch {}
    if('serviceWorker' in navigator){ navigator.serviceWorker.register('/scott-afb-sw.js').catch(()=>{}); }
    setReady(true);
  },[]);

  useEffect(() => {
    if(!ready) return;
    const s:SavedState = {checked,notes,issues,building,general};
    localStorage.setItem(storeKey,JSON.stringify(s));
  },[checked,notes,issues,building,general,ready]);

  const done = useMemo(()=>items.filter(i=>checked[i.id]).length,[checked]);
  const pct = Math.round((done/items.length)*100);

  function exportReport(){
    const lines = [
      'ODISCOM - SCOTT AFB SITE WALK REPORT',
      'Solicitation: FA440726QJC05',
      `Building: ${building}`,
      `Progress: ${done}/${items.length}`,
      '',
      ...items.flatMap(i=>[
        `[${checked[i.id]?'X':' '}] ${i.section} - ${i.text}`,
        issues[i.id] ? '  ISSUE / GOV QUESTION: YES' : '',
        notes[i.id] ? `  Notes/Measurements: ${notes[i.id]}` : ''
      ].filter(Boolean)),
      '',
      'GENERAL FIELD NOTES', general || '(none)',
      '',
      `Photos selected in this session: ${photos.length}`
    ];
    const blob = new Blob([lines.join('\n')],{type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=`Scott_AFB_Site_Walk_${new Date().toISOString().slice(0,10)}.txt`; a.click(); URL.revokeObjectURL(url);
  }

  return <main style={{maxWidth:760,margin:'0 auto',padding:'16px',fontFamily:'Arial, sans-serif',background:'#f5f7fa',minHeight:'100vh',color:'#14213d'}}>
    <link rel="manifest" href="/sitewalk-scott-afb.webmanifest" />
    <div style={{background:'#0b1f3a',color:'white',padding:'18px',borderRadius:16,marginBottom:14}}>
      <div style={{fontSize:12,opacity:.8}}>ODISCOM FIELD WALK</div>
      <h1 style={{fontSize:24,margin:'4px 0'}}>Scott AFB Dorm Wi-Fi</h1>
      <div style={{fontSize:14}}>FA440726QJC05 · 27 Aug 2026 · 9:00 AM CT</div>
      <div style={{marginTop:12,height:10,background:'#ffffff33',borderRadius:8,overflow:'hidden'}}><div style={{height:'100%',width:`${pct}%`,background:'#fff'}} /></div>
      <div style={{fontSize:13,marginTop:6}}>{done} of {items.length} complete · {pct}%</div>
    </div>

    <label style={{display:'block',fontWeight:700,marginBottom:6}}>Current building</label>
    <select value={building} onChange={e=>setBuilding(e.target.value)} style={{width:'100%',padding:12,borderRadius:10,border:'1px solid #c8d0dc',marginBottom:14,fontSize:16}}>{buildings.map(b=><option key={b}>{b}</option>)}</select>

    <div style={{background:'white',padding:14,borderRadius:14,marginBottom:14,border:'1px solid #dfe5ed'}}>
      <b>Field photos</b><div style={{fontSize:13,margin:'4px 0 10px'}}>Use the iPhone camera. Photos remain on the phone unless Bruce shares/uploads them.</div>
      <input type="file" accept="image/*" capture="environment" multiple onChange={e=>setPhotos(Array.from(e.target.files||[]).map(f=>f.name))} style={{width:'100%'}} />
      {photos.length>0 && <div style={{fontSize:13,marginTop:8}}>{photos.length} photo(s) selected this session.</div>}
    </div>

    {items.map((i,idx)=><section key={i.id} style={{background:'white',padding:14,borderRadius:14,marginBottom:10,border: issues[i.id]?'2px solid #b42318':'1px solid #dfe5ed'}}>
      <div style={{fontSize:12,fontWeight:700,opacity:.65}}>{idx+1}. {i.section}</div>
      <label style={{display:'flex',gap:10,alignItems:'flex-start',marginTop:6,fontWeight:600,lineHeight:1.35}}>
        <input type="checkbox" checked={!!checked[i.id]} onChange={e=>setChecked({...checked,[i.id]:e.target.checked})} style={{width:22,height:22,marginTop:1}} />
        <span>{i.text}</span>
      </label>
      <textarea value={notes[i.id]||''} onChange={e=>setNotes({...notes,[i.id]:e.target.value})} placeholder="Notes / measurements / room numbers / quantities..." style={{width:'100%',boxSizing:'border-box',minHeight:76,padding:10,borderRadius:9,border:'1px solid #ccd4df',marginTop:10,fontSize:15}} />
      <label style={{display:'flex',alignItems:'center',gap:8,marginTop:8,fontSize:14,color:'#8a1c13',fontWeight:700}}><input type="checkbox" checked={!!issues[i.id]} onChange={e=>setIssues({...issues,[i.id]:e.target.checked})} /> Government question / pricing issue</label>
    </section>)}

    <section style={{background:'white',padding:14,borderRadius:14,marginTop:14,border:'1px solid #dfe5ed'}}>
      <b>General field notes</b>
      <textarea value={general} onChange={e=>setGeneral(e.target.value)} placeholder="People present, escort, base access, overall observations, follow-ups..." style={{width:'100%',boxSizing:'border-box',minHeight:130,padding:10,borderRadius:9,border:'1px solid #ccd4df',marginTop:10,fontSize:15}} />
    </section>

    <button onClick={exportReport} style={{width:'100%',padding:15,border:0,borderRadius:12,background:'#0b1f3a',color:'white',fontSize:17,fontWeight:700,margin:'16px 0 8px'}}>Export Site Walk Report</button>
    <button onClick={()=>{if(confirm('Clear all saved checklist data on this phone?')){localStorage.removeItem(storeKey);location.reload();}}} style={{width:'100%',padding:12,border:'1px solid #b8c2cf',borderRadius:12,background:'white',fontSize:15}}>Reset this phone</button>
    <p style={{fontSize:12,opacity:.65,textAlign:'center',margin:'14px 0 30px'}}>Data auto-saves locally on this device. Add to Home Screen in Safari for app-like use.</p>
  </main>;
}

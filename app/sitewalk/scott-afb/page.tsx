'use client';

import { useEffect, useMemo, useState } from 'react';

type WalkItem = { id:string; section:string; text:string };
type SavedState = {
  done:Record<string,boolean>;
  issue:Record<string,boolean>;
  notes:Record<string,string>;
  building:string;
  general:string;
  attendee:string;
};

const items:WalkItem[] = [
  {id:'carrier1',section:'Carrier / demarc',text:'Identify ISP/carrier and service entrance; photograph demarc and handoff.'},
  {id:'carrier2',section:'Carrier / demarc',text:'Confirm 10Gbps availability and delivery point.'},
  {id:'carrier3',section:'Carrier / demarc',text:'Identify fiber pathways, conduits, handholes, poles, innerduct and spare capacity.'},
  {id:'mdf1',section:'B1820 MDF',text:'Confirm MDF location; measure rack/wall space and clearances.'},
  {id:'mdf2',section:'B1820 MDF',text:'Verify power, circuits, grounding, HVAC/environment and UPS requirements.'},
  {id:'fiber1',section:'Interbuilding fiber',text:'Measure 1820-1830 and 1820-1850 routes; aerial vs underground.'},
  {id:'fiber2',section:'Interbuilding fiber',text:'Locate conduits/handholes/pull boxes; note boring, restoration and firestopping.'},
  {id:'idf1',section:'Six attic IDFs',text:'Record location, access, rack space, temperature, power, grounding and security.'},
  {id:'idf2',section:'Six attic IDFs',text:'Verify fiber route to IDFs and copper route to APs; cable distances and penetrations.'},
  {id:'wifi1',section:'Wi-Fi / AP',text:'Determine coverage locations in rooms, corridors, common and exterior areas.'},
  {id:'wifi2',section:'Wi-Fi / AP',text:'Record construction, RF obstructions, mounting heights and atypical rooms.'},
  {id:'cable1',section:'Cabling',text:'Identify attic-to-room pathways, sleeves/conduit, raceway and occupied-room penetrations.'},
  {id:'ops1',section:'Operations',text:'Confirm room access, resident notification, phasing, outage windows and cutover hours.'},
  {id:'sla1',section:'Maintenance / SLA',text:'Clarify 24-hour response vs resolution, weekends, ticketing and onsite spares.'},
  {id:'q1',section:'Government questions',text:'Is 10GB a 10Gbps ISP circuit, building backbone, or both?'},
  {id:'q2',section:'Government questions',text:'Is a specific Ruckus family/controller/cloud platform required?'},
  {id:'q3',section:'Government questions',text:'Are AP locations/counts prescribed or bidder-designed?'},
  {id:'q4',section:'Government questions',text:'Any cybersecurity/ATO requirements for captive portal, cloud management or filtering?'},
  {id:'evidence',section:'Evidence',text:'Capture labeled photos and dimensions for MDF/IDFs, pathways, panels, grounding, entrances, handholes and AP routes.'},
];

const buildings=['All Buildings','1820 - Belleville Hall','1830 - Mascoutah Hall','1850 - Shiloh Hall'];
const storageKey='odiscom-scott-afb-sitewalk-v2';

export default function Page(){
  const [done,setDone]=useState<Record<string,boolean>>({});
  const [issue,setIssue]=useState<Record<string,boolean>>({});
  const [notes,setNotes]=useState<Record<string,string>>({});
  const [building,setBuilding]=useState(buildings[0]);
  const [general,setGeneral]=useState('');
  const [attendee,setAttendee]=useState('');
  const [photoNames,setPhotoNames]=useState<string[]>([]);
  const [ready,setReady]=useState(false);

  useEffect(()=>{
    try{
      const raw=localStorage.getItem(storageKey);
      if(raw){const s:SavedState=JSON.parse(raw);setDone(s.done||{});setIssue(s.issue||{});setNotes(s.notes||{});setBuilding(s.building||buildings[0]);setGeneral(s.general||'');setAttendee(s.attendee||'');}
    }catch{}
    if('serviceWorker' in navigator) navigator.serviceWorker.register('/scott-afb-sw.js').catch(()=>{});
    setReady(true);
  },[]);

  useEffect(()=>{
    if(!ready)return;
    localStorage.setItem(storageKey,JSON.stringify({done,issue,notes,building,general,attendee}));
  },[done,issue,notes,building,general,attendee,ready]);

  const complete=useMemo(()=>items.filter(i=>done[i.id]).length,[done]);
  const pct=Math.round(complete/items.length*100);
  const issueCount=useMemo(()=>items.filter(i=>issue[i.id]).length,[issue]);
  const sections=useMemo(()=>Array.from(new Set(items.map(i=>i.section))),[]);

  function reportText(){
    const out:string[]=[
      'SCOTT AFB SITE WALK REPORT','FA440726QJC05','27 Aug 2026','',
      `Attendee: ${attendee||'(not entered)'}`,
      `Current/selected building: ${building}`,
      `Completed: ${complete}/${items.length}`,
      `Issues / Government questions flagged: ${issueCount}`,'',
    ];
    for(const sec of sections){
      out.push(`## ${sec}`);
      for(const i of items.filter(x=>x.section===sec)){
        out.push(`[${done[i.id]?'X':' '}] ${i.text}${issue[i.id]?'  **ISSUE / GOV QUESTION**':''}`);
        if(notes[i.id]?.trim()) out.push(`Notes: ${notes[i.id].trim()}`);
      }
      out.push('');
    }
    out.push('## General field notes',general||'(none)','',`Photos selected this session: ${photoNames.length}`);
    if(photoNames.length) out.push(...photoNames.map(n=>`- ${n}`));
    return out.join('\n');
  }

  async function shareReport(){
    const text=reportText();
    if(navigator.share){
      try{await navigator.share({title:'Scott AFB Site Walk Report',text});return;}catch{}
    }
    const blob=new Blob([text],{type:'text/plain'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='Scott_AFB_Site_Walk_Report.txt';a.click();URL.revokeObjectURL(url);
  }

  const card:React.CSSProperties={background:'#fff',border:'1px solid #dce3eb',borderRadius:14,padding:14,marginBottom:10,boxShadow:'0 1px 2px rgba(0,0,0,.03)'};

  return <main style={{maxWidth:760,margin:'0 auto',padding:'14px',fontFamily:'Arial,Helvetica,sans-serif',background:'#f3f6f9',minHeight:'100vh',color:'#10223b'}}>
    <link rel="manifest" href="/sitewalk-scott-afb.webmanifest"/>

    <header style={{background:'#0b1f3a',color:'#fff',padding:18,borderRadius:16,marginBottom:12}}>
      <div style={{fontSize:12,letterSpacing:1,opacity:.8}}>ODISCOM · OFFLINE FIELD CAPTURE</div>
      <h1 style={{fontSize:25,margin:'4px 0 3px'}}>Scott AFB Site Walk</h1>
      <div style={{fontSize:14}}>FA440726QJC05 · 27 Aug 2026</div>
      <div style={{height:10,background:'#ffffff2e',borderRadius:10,overflow:'hidden',marginTop:12}}><div style={{height:'100%',width:`${pct}%`,background:'#fff'}}/></div>
      <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginTop:6}}><span>{complete} / {items.length} completed</span><span>{issueCount} issue{issueCount===1?'':'s'}</span></div>
    </header>

    <section style={card}>
      <label style={{fontWeight:700,fontSize:13}}>Field representative</label>
      <input value={attendee} onChange={e=>setAttendee(e.target.value)} placeholder="Bruce / attendee name" style={{width:'100%',boxSizing:'border-box',padding:11,border:'1px solid #c9d3df',borderRadius:9,fontSize:16,margin:'6px 0 10px'}}/>
      <label style={{fontWeight:700,fontSize:13}}>Current building</label>
      <select value={building} onChange={e=>setBuilding(e.target.value)} style={{width:'100%',padding:11,border:'1px solid #c9d3df',borderRadius:9,fontSize:16,marginTop:6}}>{buildings.map(b=><option key={b}>{b}</option>)}</select>
    </section>

    <section style={card}>
      <div style={{fontWeight:700}}>Camera / field photos</div>
      <div style={{fontSize:13,opacity:.75,margin:'4px 0 9px'}}>Take or select photos from the iPhone. Use notes below each checklist item to record what each photo shows.</div>
      <input type="file" accept="image/*" capture="environment" multiple onChange={e=>setPhotoNames(Array.from(e.target.files||[]).map(f=>f.name))}/>
      {photoNames.length>0&&<div style={{fontSize:13,marginTop:7}}>{photoNames.length} photo(s) selected.</div>}
    </section>

    {sections.map(sec=><div key={sec}>
      <h2 style={{fontSize:17,margin:'18px 3px 8px'}}>{sec}</h2>
      {items.filter(i=>i.section===sec).map(i=><section key={i.id} style={{...card,border:issue[i.id]?'2px solid #b42318':'1px solid #dce3eb'}}>
        <div style={{fontWeight:600,lineHeight:1.38}}>{i.text}</div>
        <div style={{display:'flex',gap:20,marginTop:10,alignItems:'center'}}>
          <label style={{display:'flex',gap:7,alignItems:'center',fontWeight:700}}><input type="checkbox" checked={!!done[i.id]} onChange={e=>setDone({...done,[i.id]:e.target.checked})} style={{width:22,height:22}}/>Done</label>
          <label style={{display:'flex',gap:7,alignItems:'center',fontWeight:700,color:'#9b1c12'}}><input type="checkbox" checked={!!issue[i.id]} onChange={e=>setIssue({...issue,[i.id]:e.target.checked})} style={{width:22,height:22}}/>Issue</label>
        </div>
        <textarea value={notes[i.id]||''} onChange={e=>setNotes({...notes,[i.id]:e.target.value})} placeholder="Notes / measurements" style={{width:'100%',boxSizing:'border-box',minHeight:80,padding:10,borderRadius:9,border:'1px solid #cbd5e1',fontSize:16,marginTop:10}}/>
      </section>)}
    </div>)}

    <section style={card}>
      <div style={{fontWeight:700}}>General field notes</div>
      <textarea value={general} onChange={e=>setGeneral(e.target.value)} placeholder="People present, access issues, sequencing, overall observations, follow-ups..." style={{width:'100%',boxSizing:'border-box',minHeight:130,padding:10,borderRadius:9,border:'1px solid #cbd5e1',fontSize:16,marginTop:8}}/>
    </section>

    <button onClick={shareReport} style={{width:'100%',border:0,borderRadius:12,padding:15,background:'#0b1f3a',color:'#fff',fontSize:17,fontWeight:700,marginTop:6}}>Share Report</button>
    <button onClick={()=>{const text=reportText();navigator.clipboard?.writeText(text);alert('Report copied to clipboard.');}} style={{width:'100%',border:'1px solid #9aa9ba',borderRadius:12,padding:13,background:'#fff',fontSize:16,fontWeight:700,marginTop:9}}>Copy Report</button>
    <button onClick={()=>{if(confirm('Clear all saved Scott AFB site-walk data on this phone?')){localStorage.removeItem(storageKey);location.reload();}}} style={{width:'100%',border:'1px solid #c3ccd6',borderRadius:12,padding:12,background:'#fff',fontSize:14,marginTop:9}}>Reset this phone</button>
    <p style={{textAlign:'center',fontSize:12,opacity:.65,margin:'14px 0 30px'}}>Auto-saves locally. In Safari: Share → Add to Home Screen.</p>
  </main>;
}

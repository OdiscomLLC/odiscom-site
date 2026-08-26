'use client';

import { useEffect, useMemo, useState } from 'react';

type WalkItem={id:string;section:string;text:string};
type PhotoMeta={id:string;name:string,itemId:string;building:string;time:string};
type SavedState={done:Record<string,boolean>;issue:Record<string,boolean>;notes:Record<string,string>;building:string;general:string;attendee:string;photos:PhotoMeta[]};

const items:WalkItem[]=[
{id:'access1',section:'Arrival / Base Access',text:'Record Government escort/POC, arrival location, parking, visitor processing and access restrictions.'},
{id:'access2',section:'Arrival / Base Access',text:'Confirm which rooms, attics, telecom spaces and exterior areas may be accessed during construction.'},
{id:'access3',section:'Arrival / Base Access',text:'Confirm badging, escort, work-hour, tool/material inspection and after-hours access requirements.'},
{id:'carrier1',section:'Carrier / Demarc',text:'Identify existing ISP/carrier and service entrance; photograph demarc, labels and handoff.'},
{id:'carrier2',section:'Carrier / Demarc',text:'Confirm required 10 Gbps service availability, delivery point, interface and responsibility boundary.'},
{id:'carrier3',section:'Carrier / Demarc',text:'Record existing fiber count/type, connector type, rack/patch-panel position and spare capacity.'},
{id:'carrier4',section:'Carrier / Demarc',text:'Identify carrier entrance conduit, handholes, poles, innerduct, pull path and available capacity.'},
{id:'carrier5',section:'Carrier / Demarc',text:'Confirm whether diverse/redundant carrier entrance or backup service is required.'},
{id:'mdf1',section:'B1820 MDF',text:'Confirm exact MDF location; record room number and measure rack/wall space and clearances.'},
{id:'mdf2',section:'B1820 MDF',text:'Photograph all walls, racks, panels, equipment, labels, cable entrances and overhead/underfloor pathways.'},
{id:'mdf3',section:'B1820 MDF',text:'Verify receptacles, panel/circuit source, voltage, spare circuits, UPS needs and dedicated power requirements.'},
{id:'mdf4',section:'B1820 MDF',text:'Verify grounding/bonding: telecom ground bar, conductor size/path and building grounding connection.'},
{id:'mdf5',section:'B1820 MDF',text:'Record HVAC/environment, temperature concerns, security, lighting, fire protection and working clearance.'},
{id:'fiber1',section:'Interbuilding Fiber',text:'Walk and document proposed 1820-1830 route; measure/estimate length and identify aerial vs underground segments.'},
{id:'fiber2',section:'Interbuilding Fiber',text:'Walk and document proposed 1820-1850 route; measure/estimate length and identify aerial vs underground segments.'},
{id:'fiber3',section:'Interbuilding Fiber',text:'Locate and photograph conduits, handholes, pull boxes, poles and building entrance points along both routes.'},
{id:'fiber4',section:'Interbuilding Fiber',text:'Record conduit size/count, occupied/spare ducts, innerduct, pull-string condition and apparent blockage concerns.'},
{id:'fiber5',section:'Interbuilding Fiber',text:'Identify boring/trenching, pavement/sidewalk/landscape restoration, traffic control and utility-conflict concerns.'},
{id:'fiber6',section:'Interbuilding Fiber',text:'Document every building penetration and required sleeve, seal, weatherproofing and firestopping condition.'},
{id:'idf1820a',section:'Six Attic IDFs',text:'B1820 attic IDF #1: room/attic location, access method, rack space, dimensions, power, grounding, temperature and security.'},
{id:'idf1820b',section:'Six Attic IDFs',text:'B1820 attic IDF #2: room/attic location, access method, rack space, dimensions, power, grounding, temperature and security.'},
{id:'idf1830a',section:'Six Attic IDFs',text:'B1830 attic IDF #1: room/attic location, access method, rack space, dimensions, power, grounding, temperature and security.'},
{id:'idf1830b',section:'Six Attic IDFs',text:'B1830 attic IDF #2: room/attic location, access method, rack space, dimensions, power, grounding, temperature and security.'},
{id:'idf1850a',section:'Six Attic IDFs',text:'B1850 attic IDF #1: room/attic location, access method, rack space, dimensions, power, grounding, temperature and security.'},
{id:'idf1850b',section:'Six Attic IDFs',text:'B1850 attic IDF #2: room/attic location, access method, rack space, dimensions, power, grounding, temperature and security.'},
{id:'idf7',section:'Six Attic IDFs',text:'For each IDF, verify fiber route from MDF/building entrance and copper route outward to AP serving areas.'},
{id:'idf8',section:'Six Attic IDFs',text:'For each IDF, record existing switches/patch panels, available RU/rack capacity and reusable infrastructure.'},
{id:'wifi1',section:'Wi-Fi / AP Survey',text:'Walk representative resident rooms and record wall/ceiling construction, room layout and likely AP mounting method.'},
{id:'wifi2',section:'Wi-Fi / AP Survey',text:'Walk corridors, lounges/common rooms, stairwells and other shared areas; identify coverage and mounting constraints.'},
{id:'wifi3',section:'Wi-Fi / AP Survey',text:'Identify concrete/masonry, metal, mechanical spaces, shafts or other RF obstructions that affect design.'},
{id:'wifi4',section:'Wi-Fi / AP Survey',text:'Record ceiling heights/types, attic access, mounting surfaces and any locations requiring special hardware.'},
{id:'wifi5',section:'Wi-Fi / AP Survey',text:'Confirm whether exterior coverage is required and identify any outdoor/common exterior areas to serve.'},
{id:'wifi6',section:'Wi-Fi / AP Survey',text:'Confirm whether AP count/locations are Government-prescribed or bidder-designed from performance requirements.'},
{id:'cable1',section:'Horizontal Cabling',text:'Identify attic-to-room and corridor pathways, sleeves, conduit, raceway, J-hooks/tray and inaccessible areas.'},
{id:'cable2',section:'Horizontal Cabling',text:'Determine representative cable distances from each IDF to farthest AP locations and flag runs approaching copper limits.'},
{id:'cable3',section:'Horizontal Cabling',text:'Document occupied-room penetrations, fire-rated assemblies, firestopping and surface-raceway needs.'},
{id:'cable4',section:'Horizontal Cabling',text:'Identify existing cable that must be removed, abandoned, reused or protected during installation.'},
{id:'power1',section:'Power / Grounding',text:'Photograph relevant electrical panels and record panel designation, voltage and apparent spare breaker capacity.'},
{id:'power2',section:'Power / Grounding',text:'Identify new receptacle/circuit requirements at MDF and each IDF and estimate routing difficulty.'},
{id:'power3',section:'Power / Grounding',text:'Confirm UPS expectations, runtime, rack mounting and whether Government or contractor supplies UPS units.'},
{id:'power4',section:'Power / Grounding',text:'Verify grounding/bonding conditions at all telecom spaces and note missing/inadequate telecom grounding.'},
{id:'ops1',section:'Construction / Operations',text:'Confirm resident-room access process, advance notification, escorts and daily room availability.'},
{id:'ops2',section:'Construction / Operations',text:'Confirm permitted work hours, quiet hours, weekend work and outage/cutover windows.'},
{id:'ops3',section:'Construction / Operations',text:'Identify staging, material storage, dumpster, lift/ladder access and parking restrictions.'},
{id:'ops4',section:'Construction / Operations',text:'Identify asbestos/lead/hazardous-material restrictions or surveys affecting penetrations and demolition.'},
{id:'ops5',section:'Construction / Operations',text:'Confirm patch/paint/restoration standards and responsibility for ceiling/wall/landscape restoration.'},
{id:'sla1',section:'Maintenance / SLA',text:'Clarify 24-hour response requirement: response vs restoration/resolution, weekends/holidays and escalation.'},
{id:'sla2',section:'Maintenance / SLA',text:'Confirm ticketing/help-desk expectations, monitoring platform, remote support and reporting requirements.'},
{id:'sla3',section:'Maintenance / SLA',text:'Confirm onsite spare equipment expectations and where spares may be stored.'},
{id:'q1',section:'Government Questions',text:'Is “10GB” a 10 Gbps ISP circuit, building backbone, or both?'},
{id:'q2',section:'Government Questions',text:'Is a specific Ruckus AP/switch/controller/cloud family required, and are licenses included in contractor scope?'},
{id:'q3',section:'Government Questions',text:'Are AP quantities/locations prescribed, or must bidder perform final RF design/validation?'},
{id:'q4',section:'Government Questions',text:'Are there cybersecurity/ATO requirements for cloud management, captive portal, authentication, filtering or logging?'},
{id:'q5',section:'Government Questions',text:'Who owns/provides the ISP circuit and who is responsible for recurring carrier charges?'},
{id:'q6',section:'Government Questions',text:'What existing fiber/copper/equipment may be reused and what must be removed or replaced?'},
{id:'q7',section:'Government Questions',text:'Are as-builts, test results, heat maps, cable certification and training required at closeout?'},
{id:'q8',section:'Government Questions',text:'Confirm warranty term and whether manufacturer support subscriptions/licenses must cover the full contract period.'},
{id:'evidence1',section:'Evidence / Closeout',text:'Capture wide and detail photos for every MDF/IDF, pathway, panel, grounding point, entrance, handhole and representative AP route.'},
{id:'evidence2',section:'Evidence / Closeout',text:'Record dimensions/measurements needed for racks, pathways, penetrations, fiber routes, conduit and cable lengths.'},
{id:'evidence3',section:'Evidence / Closeout',text:'Before leaving, review every red Issue flag and make sure the related photo, measurement or Government question is captured.'}
];

const buildings=['All Buildings','1820 - Belleville Hall','1830 - Mascoutah Hall','1850 - Shiloh Hall'];
const storageKey='odiscom-scott-afb-sitewalk-v3';

export default function Page(){
 const [done,setDone]=useState<Record<string,boolean>>({});const [issue,setIssue]=useState<Record<string,boolean>>({});const [notes,setNotes]=useState<Record<string,string>>({});
 const [building,setBuilding]=useState(buildings[0]);const [general,setGeneral]=useState('');const [attendee,setAttendee]=useState('');const [photos,setPhotos]=useState<PhotoMeta[]>([]);const [ready,setReady]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem(storageKey);if(raw){const s:SavedState=JSON.parse(raw);setDone(s.done||{});setIssue(s.issue||{});setNotes(s.notes||{});setBuilding(s.building||buildings[0]);setGeneral(s.general||'');setAttendee(s.attendee||'');setPhotos(s.photos||[])}}catch{};if('serviceWorker'in navigator)navigator.serviceWorker.register('/scott-afb-sw.js').catch(()=>{});setReady(true)},[]);
 useEffect(()=>{if(ready)localStorage.setItem(storageKey,JSON.stringify({done,issue,notes,building,general,attendee,photos}))},[done,issue,notes,building,general,attendee,photos,ready]);
 const complete=useMemo(()=>items.filter(i=>done[i.id]).length,[done]);const issueCount=useMemo(()=>items.filter(i=>issue[i.id]).length,[issue]);const pct=Math.round(complete/items.length*100);const sections=useMemo(()=>Array.from(new Set(items.map(i=>i.section))),[]);
 const addPhoto=(itemId:string,file:File)=>setPhotos(p=>[...p,{id:`${Date.now()}-${Math.random()}`,name:file.name||'iPhone photo',itemId,building,time:new Date().toLocaleString()}]);
 const removePhoto=(id:string)=>setPhotos(p=>p.filter(x=>x.id!==id));
 const photoPicker=(itemId:string,label:string)=><div style={{marginTop:10}}><label style={{display:'inline-block',background:'#eef3f8',border:'1px solid #aab8c7',borderRadius:9,padding:'9px 12px',fontWeight:700,fontSize:14}}>📷 {label}<input type="file" accept="image/*" capture="environment" style={{display:'none'}} onChange={e=>{const f=e.target.files?.[0];if(f)addPhoto(itemId,f);e.currentTarget.value=''}}/></label>{photos.filter(p=>p.itemId===itemId).map((p,n)=><div key={p.id} style={{fontSize:12,marginTop:6,padding:7,background:'#f7f9fb',borderRadius:7}}>Photo {n+1} · {p.building} · {p.time} <button onClick={()=>removePhoto(p.id)} style={{float:'right',border:0,background:'transparent',color:'#a21b12'}}>Delete</button></div>)}</div>;
 function reportText(){const out=[`SCOTT AFB SITE WALK REPORT`,`FA440726QJC05`,`Attendee: ${attendee||'(not entered)'}`,`Completed: ${complete}/${items.length}`,`Issues: ${issueCount}`,`Photos logged: ${photos.length}`,''];for(const sec of sections){out.push(`## ${sec}`);for(const i of items.filter(x=>x.section===sec)){out.push(`[${done[i.id]?'X':' '}] ${i.text}${issue[i.id]?' **ISSUE**':''}`);if(notes[i.id])out.push(`Notes: ${notes[i.id]}`);photos.filter(p=>p.itemId===i.id).forEach((p,n)=>out.push(`Photo ${n+1}: ${p.name} | ${p.building} | ${p.time}`))}out.push('')}out.push('## General Notes',general||'(none)');photos.filter(p=>p.itemId==='general').forEach((p,n)=>out.push(`General Photo ${n+1}: ${p.name} | ${p.building} | ${p.time}`));return out.join('\n')}
 async function share(){const text=reportText();if(navigator.share){try{await navigator.share({title:'Scott AFB Site Walk Report',text});return}catch{}}const b=new Blob([text],{type:'text/plain'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='Scott_AFB_Site_Walk_Report.txt';a.click();URL.revokeObjectURL(u)}
 const card:React.CSSProperties={background:'#fff',border:'1px solid #dce3eb',borderRadius:14,padding:14,marginBottom:10};
 return <main style={{maxWidth:760,margin:'0 auto',padding:14,fontFamily:'Arial,sans-serif',background:'#f3f6f9',minHeight:'100vh',color:'#10223b'}}><link rel="manifest" href="/sitewalk-scott-afb.webmanifest"/>
 <header style={{background:'#0b1f3a',color:'#fff',padding:18,borderRadius:16,marginBottom:12}}><div style={{fontSize:12,opacity:.8}}>ODISCOM · SCOTT AFB FIELD SURVEY</div><h1 style={{fontSize:25,margin:'4px 0'}}>Wi-Fi Site Walk</h1><div>FA440726QJC05 · 27 Aug 2026</div><div style={{height:10,background:'#ffffff2e',borderRadius:10,overflow:'hidden',marginTop:12}}><div style={{height:'100%',width:`${pct}%`,background:'#fff'}}/></div><div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginTop:6}}><span>{complete}/{items.length} complete</span><span>{issueCount} issues · {photos.length} photos</span></div></header>
 <section style={card}><b>Field representative</b><input value={attendee} onChange={e=>setAttendee(e.target.value)} placeholder="Bruce / attendee name" style={{width:'100%',boxSizing:'border-box',padding:11,border:'1px solid #c9d3df',borderRadius:9,fontSize:16,margin:'6px 0 10px'}}/><b>Current building</b><select value={building} onChange={e=>setBuilding(e.target.value)} style={{width:'100%',padding:11,border:'1px solid #c9d3df',borderRadius:9,fontSize:16,marginTop:6}}>{buildings.map(b=><option key={b}>{b}</option>)}</select></section>
 <section style={card}><b>Quick Photos</b><div style={{fontSize:13,opacity:.75,marginTop:4}}>Tap repeatedly. Each camera shot is logged with building and time. Use item-specific photo buttons below whenever possible.</div>{photoPicker('general','Take General Photo / Add Another')}</section>
 {sections.map(sec=><div key={sec}><h2 style={{fontSize:18,margin:'19px 3px 8px'}}>{sec}</h2>{items.filter(i=>i.section===sec).map(i=><section key={i.id} style={{...card,border:issue[i.id]?'2px solid #b42318':'1px solid #dce3eb'}}><div style={{fontWeight:600,lineHeight:1.4}}>{i.text}</div><div style={{display:'flex',gap:20,marginTop:10}}><label style={{display:'flex',gap:7,alignItems:'center',fontWeight:700}}><input type="checkbox" checked={!!done[i.id]} onChange={e=>setDone({...done,[i.id]:e.target.checked})} style={{width:22,height:22}}/>Done</label><label style={{display:'flex',gap:7,alignItems:'center',fontWeight:700,color:'#9b1c12'}}><input type="checkbox" checked={!!issue[i.id]} onChange={e=>setIssue({...issue,[i.id]:e.target.checked})} style={{width:22,height:22}}/>Issue</label></div><textarea value={notes[i.id]||''} onChange={e=>setNotes({...notes,[i.id]:e.target.value})} placeholder="Notes / measurements / quantities / room numbers" style={{width:'100%',boxSizing:'border-box',minHeight:82,padding:10,borderRadius:9,border:'1px solid #cbd5e1',fontSize:16,marginTop:10}}/>{photoPicker(i.id,photos.some(p=>p.itemId===i.id)?'Add Another Photo':'Add Photo')}</section>)}</div>)}
 <section style={card}><b>General field notes</b><textarea value={general} onChange={e=>setGeneral(e.target.value)} placeholder="People present, access, overall observations and follow-ups..." style={{width:'100%',boxSizing:'border-box',minHeight:130,padding:10,borderRadius:9,border:'1px solid #cbd5e1',fontSize:16,marginTop:8}}/></section>
 <button onClick={share} style={{width:'100%',border:0,borderRadius:12,padding:15,background:'#0b1f3a',color:'#fff',fontSize:17,fontWeight:700}}>Share Report</button><button onClick={()=>{navigator.clipboard?.writeText(reportText());alert('Report copied.')}} style={{width:'100%',border:'1px solid #9aa9ba',borderRadius:12,padding:13,background:'#fff',fontSize:16,fontWeight:700,marginTop:9}}>Copy Report</button><button onClick={()=>{if(confirm('Clear all saved Scott AFB data on this phone?')){localStorage.removeItem(storageKey);location.reload()}}} style={{width:'100%',border:'1px solid #c3ccd6',borderRadius:12,padding:12,background:'#fff',fontSize:14,marginTop:9}}>Reset this phone</button><p style={{textAlign:'center',fontSize:12,opacity:.65,margin:'14px 0 30px'}}>Checklist, notes and photo metadata auto-save locally. Camera photos remain in the iPhone photo library. Safari → Share → Add to Home Screen.</p></main>
}

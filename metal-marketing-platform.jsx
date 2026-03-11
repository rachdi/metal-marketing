import { useState, useEffect, useRef } from "react";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@300;400;500;600&display=swap');`;

const css = `
  ${FONT}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Barlow', sans-serif; background: #0a0a0a; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #111; }
  ::-webkit-scrollbar-thumb { background: #FF5500; border-radius: 3px; }

  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse-dot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: .5; transform: scale(1.4); }
  }
  @keyframes shimmer {
    0%   { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes countUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  @keyframes barGrow { from { width: 0; } to { width: var(--w); } }
  @keyframes borderPulse { 0%,100%{border-color:#FF5500;} 50%{border-color:#FF8800;} }
`;

/* ─────────────── palette ─────────────── */
const C = {
  bg:     "#0a0a0a",
  panel:  "#111111",
  card:   "#161616",
  border: "#242424",
  orange: "#FF5500",
  amber:  "#FF8800",
  steel:  "#8899AA",
  text:   "#E8E8E8",
  muted:  "#666",
  green:  "#22C55E",
  red:    "#EF4444",
  blue:   "#3B82F6",
  gold:   "#F59E0B",
};

/* ─────────────── tiny helpers ─────────────── */
const H1 = ({children,style={}}) => (
  <h1 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:32,color:C.text,letterSpacing:1,...style}}>{children}</h1>
);
const H2 = ({children,style={}}) => (
  <h2 style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:22,color:C.text,letterSpacing:.5,...style}}>{children}</h2>
);
const Tag = ({label,color=C.orange}) => (
  <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:600,letterSpacing:.5}}>{label}</span>
);
const Divider = () => <div style={{height:1,background:C.border,margin:"20px 0"}}/>;
const Dot = ({color=C.green}) => (
  <span style={{display:"inline-block",width:8,height:8,borderRadius:"50%",background:color,animation:"pulse-dot 2s infinite"}}/>
);

const Btn = ({children,onClick,variant="primary",size="md",icon,disabled,style={}}) => {
  const [hover,setHover]=useState(false);
  const base = {
    display:"inline-flex",alignItems:"center",gap:6,cursor:disabled?"not-allowed":"pointer",
    border:"none",borderRadius:6,fontFamily:"'Barlow',sans-serif",fontWeight:600,
    letterSpacing:.3,transition:"all .18s",opacity:disabled?.5:1,
  };
  const sizes = { sm:{padding:"6px 14px",fontSize:12}, md:{padding:"10px 20px",fontSize:14}, lg:{padding:"14px 28px",fontSize:16} };
  const variants = {
    primary:  { background: hover&&!disabled?"#FF6F00":C.orange, color:"#fff" },
    secondary:{ background: hover?"#1f1f1f":"#181818", color:C.text, border:`1px solid ${C.border}` },
    danger:   { background: hover?"#B91C1C":C.red, color:"#fff" },
    ghost:    { background:"transparent", color:hover?C.orange:C.steel, border:`1px solid ${hover?C.orange:C.border}` },
    success:  { background: hover?"#16A34A":C.green, color:"#fff" },
  };
  return (
    <button style={{...base,...sizes[size],...variants[variant],...style}}
      onClick={onClick} disabled={disabled}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
      {icon&&<span>{icon}</span>}{children}
    </button>
  );
};

const Input = ({label,value,onChange,placeholder,type="text",textarea=false,rows=3,style={}}) => {
  const [focus,setFocus]=useState(false);
  const shared = {
    width:"100%",background:"#0e0e0e",border:`1px solid ${focus?C.orange:C.border}`,
    borderRadius:6,padding:"10px 14px",color:C.text,fontSize:14,fontFamily:"'Barlow',sans-serif",
    outline:"none",resize:"vertical",transition:"border-color .15s",...style
  };
  return (
    <div style={{marginBottom:14}}>
      {label&&<label style={{display:"block",marginBottom:5,fontSize:12,color:C.steel,fontWeight:600,letterSpacing:.5,textTransform:"uppercase"}}>{label}</label>}
      {textarea
        ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
            style={shared} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}/>
        : <input type={type} value={value} onChange={onChange} placeholder={placeholder}
            style={shared} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}/>}
    </div>
  );
};

const Select = ({label,value,onChange,options}) => {
  return (
    <div style={{marginBottom:14}}>
      {label&&<label style={{display:"block",marginBottom:5,fontSize:12,color:C.steel,fontWeight:600,letterSpacing:.5,textTransform:"uppercase"}}>{label}</label>}
      <select value={value} onChange={onChange}
        style={{width:"100%",background:"#0e0e0e",border:`1px solid ${C.border}`,borderRadius:6,
          padding:"10px 14px",color:C.text,fontSize:14,fontFamily:"'Barlow',sans-serif",outline:"none",cursor:"pointer"}}>
        {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
};

const Card = ({children,style={},glow=false}) => (
  <div style={{background:C.card,border:`1px solid ${glow?C.orange:C.border}`,borderRadius:10,
    padding:20,animation:glow?"borderPulse 2s infinite":"none",...style}}>
    {children}
  </div>
);

const Badge = ({count,color=C.orange}) => (
  <span style={{background:color,color:"#fff",borderRadius:20,padding:"1px 8px",fontSize:11,fontWeight:700,minWidth:20,textAlign:"center",display:"inline-block"}}>
    {count}
  </span>
);

/* ─────────────── Stat Card ─────────────── */
const StatCard = ({icon,label,value,delta,color=C.orange}) => (
  <Card style={{flex:1,minWidth:160}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
      <span style={{fontSize:28}}>{icon}</span>
      <span style={{fontSize:12,color:delta?.startsWith("+")? C.green:C.red,fontWeight:600,background:delta?.startsWith("+")?"#22C55E18":"#EF444418",padding:"2px 8px",borderRadius:20}}>
        {delta}
      </span>
    </div>
    <div style={{fontSize:28,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",color,letterSpacing:-1,animation:"countUp .5s ease"}}>{value}</div>
    <div style={{fontSize:12,color:C.steel,marginTop:3,fontWeight:500}}>{label}</div>
  </Card>
);

/* ─────────────── Progress Bar ─────────────── */
const ProgressBar = ({label,value,max,color=C.orange}) => {
  const pct = Math.round((value/max)*100);
  return (
    <div style={{marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{fontSize:13,color:C.text}}>{label}</span>
        <span style={{fontSize:13,color,fontWeight:700}}>{pct}%</span>
      </div>
      <div style={{background:"#1a1a1a",borderRadius:4,height:8,overflow:"hidden"}}>
        <div style={{height:"100%",borderRadius:4,background:`linear-gradient(90deg,${color},${color}88)`,
          width:`${pct}%`,transition:"width 1s ease"}}/>
      </div>
    </div>
  );
};

/* ─────────────── Toggle ─────────────── */
const Toggle = ({value,onChange,label}) => (
  <div style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onClick={()=>onChange(!value)}>
    <div style={{width:44,height:24,borderRadius:12,background:value?C.orange:"#222",transition:"background .2s",position:"relative"}}>
      <div style={{position:"absolute",top:2,left:value?20:2,width:20,height:20,borderRadius:"50%",background:"#fff",transition:"left .2s",boxShadow:"0 1px 4px #0008"}}/>
    </div>
    {label&&<span style={{fontSize:13,color:C.text}}>{label}</span>}
  </div>
);

/* ══════════════════════════════════════════
   PAGES
══════════════════════════════════════════ */

/* ── DASHBOARD ── */
const Dashboard = () => {
  const [activity] = useState([
    {time:"09:14",action:"Email envoyé","cible":"Ferronneries Midi","stat":"Ouvert"},
    {time:"09:02",action:"SMS envoyé","cible":"Auto-Entr. Région","stat":"Livré"},
    {time:"08:47",action:"Pub Facebook","cible":"Communauté locale","stat":"Active"},
    {time:"08:30",action:"Annonce Véhicule","cible":"LeBonCoin + PAP","stat":"En ligne"},
    {time:"07:55",action:"Google Ads","cible":"Mots-clé ferraille","stat":"Active"},
  ]);
  return (
    <div style={{animation:"fadeSlideIn .4s ease"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
        <div>
          <H1>Tableau de Bord</H1>
          <p style={{color:C.steel,fontSize:14,marginTop:4}}>Vue d'ensemble de votre activité marketing — <Dot/> <span style={{color:C.green,fontSize:12}}>Toutes les campagnes actives</span></p>
        </div>
        <Btn icon="🚀" size="lg">Nouvelle Campagne</Btn>
      </div>

      {/* Stats Row */}
      <div style={{display:"flex",gap:16,marginBottom:24,flexWrap:"wrap"}}>
        <StatCard icon="👥" label="Contacts Total" value="4 287" delta="+18%" color={C.orange}/>
        <StatCard icon="📣" label="Campagnes Actives" value="12" delta="+4" color={C.amber}/>
        <StatCard icon="📬" label="Taux d'Ouverture" value="41.3%" delta="+6.2%" color={C.green}/>
        <StatCard icon="🚗" label="Véhicules Rachetés" value="34" delta="+9" color={C.blue}/>
        <StatCard icon="💶" label="Budget Pub Mensuel" value="2 400€" delta="-3%" color={C.gold}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:20,marginBottom:20}}>
        {/* Channel Performance */}
        <Card>
          <H2 style={{marginBottom:16}}>📊 Performance par Canal</H2>
          <ProgressBar label="📧 Email Marketing" value={412} max={600} color={C.orange}/>
          <ProgressBar label="📱 SMS Campagnes" value={287} max={600} color={C.amber}/>
          <ProgressBar label="📘 Facebook Ads" value={540} max={600} color={C.blue}/>
          <ProgressBar label="🔍 Google Ads" value={390} max={600} color={C.green}/>
          <ProgressBar label="💼 LinkedIn" value={120} max={600} color="#0A66C2"/>
          <ProgressBar label="📸 Instagram" value={210} max={600} color="#E1306C"/>
        </Card>

        {/* Segments */}
        <Card>
          <H2 style={{marginBottom:16}}>🎯 Segments Cibles</H2>
          {[
            {icon:"⚙️",label:"Auto-Entrepreneurs",n:312,color:C.orange},
            {icon:"🏭",label:"Sociétés Métaux",n:234,color:C.amber},
            {icon:"🔩",label:"Prod. Ferraille",n:408,color:C.steel},
            {icon:"🥈",label:"Métaux Non-Ferreux",n:178,color:"#A8DADC"},
            {icon:"🏘️",label:"Communauté Locale",n:2 155,color:C.green},
            {icon:"🚗",label:"Cédants Véhicules",n:1 000,color:C.blue},
          ].map(s=>(
            <div key={s.label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:18}}>{s.icon}</span>
                <span style={{fontSize:13,color:C.text}}>{s.label}</span>
              </div>
              <Badge count={s.n} color={s.color}/>
            </div>
          ))}
        </Card>
      </div>

      {/* Activity Feed */}
      <Card>
        <H2 style={{marginBottom:16}}>⚡ Activité Récente</H2>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{borderBottom:`1px solid ${C.border}`}}>
              {["Heure","Action","Cible","Statut"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"8px 12px",fontSize:11,color:C.steel,letterSpacing:.5,textTransform:"uppercase"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activity.map((a,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${C.border}11`}}>
                <td style={{padding:"10px 12px",fontSize:12,color:C.muted,fontFamily:"monospace"}}>{a.time}</td>
                <td style={{padding:"10px 12px",fontSize:13,color:C.text}}>{a.action}</td>
                <td style={{padding:"10px 12px",fontSize:13,color:C.steel}}>{a.cible}</td>
                <td style={{padding:"10px 12px"}}>
                  <Tag label={a.stat} color={a.stat==="Ouvert"||a.stat==="Active"||a.stat==="En ligne"?C.green:C.amber}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

/* ── EMAIL BUILDER ── */
const EmailBuilder = () => {
  const [subject,setSubject]=useState("🔩 Rachat de ferraille & métaux — Contactez-nous !");
  const [body,setBody]=useState(`Bonjour,

Nous sommes spécialisés dans le rachat de ferraille, métaux ferreux et non-ferreux. Nous intervenons directement chez vous pour évaluer et collecter vos matériaux.

✅ Prix compétitifs et transparents
✅ Déplacement gratuit dans tout le département
✅ Paiement immédiat
✅ Rachat aussi de véhicules destinés à la destruction

N'hésitez pas à nous contacter pour un devis gratuit.

Cordialement,
L'équipe MetalPro`);
  const [seg,setSeg]=useState("all");
  const [sent,setSent]=useState(false);
  const [sending,setSending]=useState(false);

  const templates = [
    {name:"Ferraille Pro B2B",subj:"🔩 Partenariat Rachat Ferraille — Offre Exclusive",body:`Cher partenaire,\n\nNous recherchons des producteurs de ferraille pour établir des partenariats durables.\n\n💶 Tarifs au kilo garantis\n🚛 Enlèvement sur site\n📋 Bons de pesée certifiés\n\nContactez-nous pour une collaboration.`},
    {name:"Non-Ferreux Premium",subj:"🥈 Cours des métaux — Meilleurs prix du marché",body:`Bonjour,\n\nActuellement, nous rachetons :\n• Cuivre : 7.20€/kg\n• Aluminium : 1.85€/kg\n• Laiton : 4.50€/kg\n• Inox : 1.20€/kg\n\nCes tarifs sont valables cette semaine uniquement.`},
    {name:"Communauté Locale",subj:"📢 Collecte ferraille dans votre quartier — Ce vendredi !",body:`Bonjour voisin(e),\n\nNous organisons une collecte de ferraille et d'objets métalliques dans votre rue ce vendredi de 9h à 17h.\n\nDéposez gratuitement :\n🔩 Ferraille diverse\n🚲 Vélos usagés\n🛒 Objets métalliques\n🔧 Outils hors service\n\nOn s'occupe de tout !`},
    {name:"Rachat Véhicules",subj:"🚗 Votre véhicule hors d'usage a de la valeur !",body:`Bonjour,\n\nVotre véhicule ne roule plus ? Nous le rachetons !\n\n✅ Tous types de véhicules acceptés\n✅ Dépollution et destruction légale\n✅ Remise du certificat de destruction\n✅ Paiement immédiat en espèces ou virement\n✅ Enlèvement gratuit à domicile\n\nDevis gratuit en 5 minutes.`},
  ];

  const handleSend = () => {
    setSending(true);
    setTimeout(()=>{ setSending(false); setSent(true); setTimeout(()=>setSent(false),3000); },1800);
  };

  return (
    <div style={{animation:"fadeSlideIn .4s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div><H1>✉️ Campagne Email</H1><p style={{color:C.steel,fontSize:14,marginTop:4}}>Créez et envoyez des emails ciblés à vos prospects</p></div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:20}}>
        {/* Templates */}
        <div>
          <Card style={{marginBottom:16}}>
            <H2 style={{marginBottom:14}}>📋 Templates Prêts à l'Envoi</H2>
            {templates.map((t,i)=>(
              <div key={i} onClick={()=>{setSubject(t.subj);setBody(t.body);}}
                style={{padding:"12px 14px",border:`1px solid ${C.border}`,borderRadius:8,marginBottom:8,
                  cursor:"pointer",transition:"border-color .15s,background .15s"}}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.orange; e.currentTarget.style.background="#1a1100"; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background="transparent"; }}>
                <div style={{fontWeight:700,fontSize:13,color:C.text,marginBottom:4}}>{t.name}</div>
                <div style={{fontSize:12,color:C.steel,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{t.subj}</div>
              </div>
            ))}
          </Card>
          <Card>
            <H2 style={{marginBottom:14}}>🎯 Segmentation</H2>
            <Select label="Segment Cible" value={seg} onChange={e=>setSeg(e.target.value)} options={[
              {value:"all",label:"Tous les contacts (4 287)"},
              {value:"auto",label:"Auto-Entrepreneurs (312)"},
              {value:"soc",label:"Sociétés Métaux (234)"},
              {value:"ferr",label:"Producteurs Ferraille (408)"},
              {value:"nf",label:"Métaux Non-Ferreux (178)"},
              {value:"loc",label:"Communauté Locale (2 155)"},
              {value:"veh",label:"Cédants Véhicules (1 000)"},
            ]}/>
            <div style={{background:"#0e0e0e",borderRadius:8,padding:12,display:"flex",justifyContent:"space-between"}}>
              <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:900,color:C.orange}}>4 287</div><div style={{fontSize:11,color:C.steel}}>Destinataires</div></div>
              <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:900,color:C.green}}>98.2%</div><div style={{fontSize:11,color:C.steel}}>Délivrabilité</div></div>
              <div style={{textAlign:"center"}}><div style={{fontSize:22,fontWeight:900,color:C.amber}}>41%</div><div style={{fontSize:11,color:C.steel}}>Taux ouv. moy.</div></div>
            </div>
          </Card>
        </div>

        {/* Editor */}
        <Card>
          <H2 style={{marginBottom:16}}>✏️ Éditeur Email</H2>
          <Input label="Objet" value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Objet de l'email..."/>
          <Input label="Corps du message" value={body} onChange={e=>setBody(e.target.value)} textarea rows={14}/>
          <div style={{display:"flex",gap:10,marginTop:8}}>
            <Btn onClick={handleSend} disabled={sending} icon={sending?"⏳":"📨"} size="lg" style={{flex:1}}>
              {sending?"Envoi en cours...":"Envoyer la Campagne"}
            </Btn>
            <Btn variant="secondary" icon="👁️">Aperçu</Btn>
          </div>
          {sent&&<div style={{marginTop:12,background:"#22C55E18",border:`1px solid ${C.green}`,borderRadius:8,padding:12,color:C.green,fontWeight:600,textAlign:"center"}}>
            ✅ Campagne envoyée avec succès à {seg==="all"?"4 287":"vos contacts sélectionnés"} !
          </div>}
        </Card>
      </div>
    </div>
  );
};

/* ── SMS MARKETING ── */
const SmsMarketing = () => {
  const [msg,setMsg]=useState("🔩 MetalPro : Collecte ferraille VENDREDI dans votre quartier ! Déposez vos métaux gratuitement. Info : 06XXXXXXXX - STOP pour se désabonner");
  const [sent,setSent]=useState(false);
  const maxChar = 160;

  const templates = [
    "🚗 MetalPro : Votre véhicule HS ? On le rachète cash ! Enlèv. gratuit. Devis immédiat : 06XX",
    "🔩 MetalPro : Cours ferraille en hausse ! Vendez vos métaux aujourd'hui au meilleur prix.",
    "🏘️ MetalPro : Collecte ferraille ce samedi dans votre rue. Amenez vos objets métalliques !",
    "💶 MetalPro : Auto-entr.? Partenariat rachat ferraille disponible. Revenus réguliers garanti.",
  ];

  return (
    <div style={{animation:"fadeSlideIn .4s ease"}}>
      <H1 style={{marginBottom:4}}>📱 Campagne SMS</H1>
      <p style={{color:C.steel,fontSize:14,marginBottom:24}}>Touchez vos prospects directement sur leur mobile</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div>
          <Card style={{marginBottom:16}}>
            <H2 style={{marginBottom:12}}>📝 Message SMS</H2>
            <div style={{position:"relative"}}>
              <Input value={msg} onChange={e=>setMsg(e.target.value.slice(0,maxChar))} textarea rows={5} placeholder="Votre message SMS..."/>
              <span style={{position:"absolute",bottom:20,right:12,fontSize:11,color:msg.length>140?C.red:C.steel}}>
                {msg.length}/{maxChar}
              </span>
            </div>
            <Select label="Segment" value="all" onChange={()=>{}} options={[
              {value:"all",label:"Tous (4 287)"},
              {value:"veh",label:"Cédants Véhicules (1 000)"},
              {value:"loc",label:"Communauté Locale (2 155)"},
            ]}/>
            <Btn onClick={()=>{setSent(true);setTimeout(()=>setSent(false),3000);}} icon="📲" size="lg" style={{width:"100%"}}>
              Envoyer SMS en masse
            </Btn>
            {sent&&<div style={{marginTop:10,background:"#22C55E18",border:`1px solid ${C.green}`,borderRadius:8,padding:10,color:C.green,textAlign:"center",fontWeight:600}}>
              ✅ 4 287 SMS envoyés !
            </div>}
          </Card>
          <Card>
            <H2 style={{marginBottom:12}}>📊 Stats SMS</H2>
            <ProgressBar label="Taux de livraison" value={98} max={100} color={C.green}/>
            <ProgressBar label="Taux de lecture" value={72} max={100} color={C.orange}/>
            <ProgressBar label="Taux de réponse" value={18} max={100} color={C.amber}/>
          </Card>
        </div>
        <div>
          <Card style={{marginBottom:16}}>
            <H2 style={{marginBottom:12}}>📋 Templates SMS</H2>
            {templates.map((t,i)=>(
              <div key={i} onClick={()=>setMsg(t)}
                style={{padding:"10px 12px",border:`1px solid ${C.border}`,borderRadius:8,marginBottom:8,cursor:"pointer",fontSize:13,color:C.steel,lineHeight:1.5,transition:"all .15s"}}
                onMouseEnter={e=>{ e.currentTarget.style.borderColor=C.orange; e.currentTarget.style.color=C.text; }}
                onMouseLeave={e=>{ e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.steel; }}>
                {t}
              </div>
            ))}
          </Card>
          {/* Phone preview */}
          <div style={{display:"flex",justifyContent:"center"}}>
            <div style={{width:220,background:"#111",border:`2px solid ${C.border}`,borderRadius:36,padding:16,boxShadow:"0 20px 60px #0009"}}>
              <div style={{background:"#1a1a1a",borderRadius:24,padding:12,minHeight:200}}>
                <div style={{background:"#0e0e0e",borderRadius:4,padding:4,textAlign:"center",marginBottom:12}}>
                  <span style={{fontSize:10,color:C.steel}}>Messages — MetalPro</span>
                </div>
                <div style={{background:`${C.orange}22`,border:`1px solid ${C.orange}44`,borderRadius:14,borderBottomLeftRadius:4,padding:"10px 14px",fontSize:12,color:C.text,lineHeight:1.5}}>
                  {msg||"Votre message SMS..."}
                </div>
                <div style={{textAlign:"right",marginTop:6,fontSize:10,color:C.muted}}>Maintenant</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── PUB MULTI-CANAL ── */
const PubMultiCanal = () => {
  const [activeChannel,setActiveChannel]=useState("facebook");
  const [budget,setBudget]=useState("25");
  const [launched,setLaunched]=useState(false);

  const channels = [
    {id:"facebook",icon:"📘",name:"Facebook Ads",color:"#1877F2",reach:"Communauté locale, particuliers, pros"},
    {id:"google",icon:"🔍",name:"Google Ads",color:"#4285F4",reach:"Intention d'achat ferraille / métaux"},
    {id:"instagram",icon:"📸",name:"Instagram",color:"#E1306C",reach:"Jeunes entreprises, artisans"},
    {id:"linkedin",icon:"💼",name:"LinkedIn Ads",color:"#0A66C2",reach:"Dirigeants B2B, industriels"},
    {id:"leboncoin",icon:"🟠",name:"LeBonCoin",color:"#FF6600",reach:"Particuliers VHU, matériaux"},
    {id:"pap",icon:"🏡",name:"PAP / Annonces",color:"#E63946",reach:"Particuliers locaux"},
  ];
  const ch = channels.find(c=>c.id===activeChannel);

  const adTexts = {
    facebook: {title:"🔩 Rachat Ferraille & Véhicules — Prix Top Marché",body:"Vous avez de la ferraille, des métaux ou un véhicule hors d'usage ? Nous rachetons TOUT ! Paiement immédiat, enlèvement gratuit. Devis en 5 min ✅"},
    google:   {title:"Rachat Ferraille & Métaux | Meilleurs Prix | Devis Gratuit",body:"Ferraille, cuivre, aluminium, VHU — Prix compétitifs garantis. Déplacement gratuit. Appelez maintenant !"},
    instagram:{title:"♻️ Donnez une 2e vie à vos métaux",body:"On rachète votre ferraille, vos véhicules HS et tous métaux. Prix honnêtes, service rapide. 📍 Votre région"},
    linkedin: {title:"Partenariat Professionnel — Rachat Métaux & Ferraille",body:"Nous proposons des contrats de rachat réguliers aux entreprises productrices de déchets métalliques. Tarifs préférentiels, bons de pesée certifiés."},
    leboncoin:{title:"🚗 Achat VHU + Ferraille — Déplacement Gratuit",body:"J'achète votre véhicule hors d'usage, ferraille et métaux. Paiement immédiat. Certificat de destruction fourni. Région entière."},
    pap:      {title:"Rachat ferraille / métaux — Toute région",body:"Particulier ou professionnel, je rachète votre ferraille, aluminium, cuivre, véhicules HS. Intervention rapide et paiement cash."},
  };
  const ad = adTexts[activeChannel];

  return (
    <div style={{animation:"fadeSlideIn .4s ease"}}>
      <H1 style={{marginBottom:4}}>📣 Publicité Multi-Canal</H1>
      <p style={{color:C.steel,fontSize:14,marginBottom:24}}>Diffusez vos annonces sur toutes les plateformes simultanément</p>

      {/* Channel Selector */}
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
        {channels.map(c=>(
          <button key={c.id} onClick={()=>setActiveChannel(c.id)}
            style={{display:"flex",alignItems:"center",gap:8,padding:"10px 16px",
              background:activeChannel===c.id?c.color+"22":"#161616",
              border:`1px solid ${activeChannel===c.id?c.color:C.border}`,
              borderRadius:8,cursor:"pointer",color:activeChannel===c.id?c.color:C.steel,fontWeight:600,fontSize:13,transition:"all .15s"}}>
            <span style={{fontSize:18}}>{c.icon}</span>{c.name}
          </button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        {/* Ad Config */}
        <div>
          <Card style={{marginBottom:16,border:`1px solid ${ch.color}44`}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <span style={{fontSize:28}}>{ch.icon}</span>
              <div><H2>{ch.name}</H2><p style={{fontSize:12,color:C.steel}}>{ch.reach}</p></div>
            </div>
            <Input label="Titre de l'annonce" value={ad.title} onChange={()=>{}}/>
            <Input label="Corps de l'annonce" value={ad.body} onChange={()=>{}} textarea rows={4}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Input label="Budget journalier (€)" value={budget} onChange={e=>setBudget(e.target.value)} type="number"/>
              <Input label="Durée (jours)" value="30" onChange={()=>{}} type="number"/>
            </div>
            <Select label="Zone géographique" value="dep" onChange={()=>{}} options={[
              {value:"dep",label:"Département (50km)"},
              {value:"reg",label:"Région (150km)"},
              {value:"nat",label:"National"},
            ]}/>
            <Btn onClick={()=>{setLaunched(true);setTimeout(()=>setLaunched(false),3000);}} icon="🚀" size="lg" style={{width:"100%",background:ch.color}}>
              Lancer la campagne {ch.name}
            </Btn>
            {launched&&<div style={{marginTop:10,background:"#22C55E18",border:`1px solid ${C.green}`,borderRadius:8,padding:10,color:C.green,textAlign:"center",fontWeight:600}}>
              ✅ Campagne lancée sur {ch.name} !
            </div>}
          </Card>
        </div>

        {/* Preview */}
        <div>
          <Card>
            <H2 style={{marginBottom:16}}>👁️ Aperçu de l'annonce</H2>
            <div style={{background:"#0e0e0e",borderRadius:10,padding:16,border:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
                <div style={{width:36,height:36,borderRadius:"50%",background:ch.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{ch.icon}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:C.text}}>MetalPro</div>
                  <div style={{fontSize:11,color:C.steel}}>Publication sponsorisée</div>
                </div>
              </div>
              <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:8}}>{ad.title}</div>
              <div style={{fontSize:13,color:C.steel,lineHeight:1.6,marginBottom:12}}>{ad.body}</div>
              <div style={{height:100,background:`linear-gradient(135deg,${ch.color}33,${C.orange}22)`,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:32}}>🔩</span>
              </div>
              <div style={{marginTop:12,padding:"8px 16px",background:ch.color,borderRadius:6,textAlign:"center",color:"#fff",fontWeight:700,fontSize:13}}>
                Demander un devis gratuit →
              </div>
            </div>
            <Divider/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,textAlign:"center"}}>
              <div style={{background:"#0e0e0e",borderRadius:8,padding:10}}>
                <div style={{fontSize:20,fontWeight:900,color:ch.color}}>{Math.round(parseFloat(budget||25)*30*18/10)}</div>
                <div style={{fontSize:11,color:C.steel}}>Impressions estimées</div>
              </div>
              <div style={{background:"#0e0e0e",borderRadius:8,padding:10}}>
                <div style={{fontSize:20,fontWeight:900,color:C.green}}>{Math.round(parseFloat(budget||25)*30*0.8)}</div>
                <div style={{fontSize:11,color:C.steel}}>Clics estimés</div>
              </div>
              <div style={{background:"#0e0e0e",borderRadius:8,padding:10}}>
                <div style={{fontSize:20,fontWeight:900,color:C.amber}}>{parseFloat(budget||25)*30}€</div>
                <div style={{fontSize:11,color:C.steel}}>Budget total</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

/* ── RACHAT VÉHICULES ── */
const RachatVehicules = () => {
  const [formData,setFormData]=useState({marque:"",modele:"",annee:"",etat:"epave",kms:"",contact:"",tel:""});
  const [submitted,setSubmitted]=useState(false);
  const [activeTab,setActiveTab]=useState("formulaire");

  const annonces = [
    {plateforme:"LeBonCoin",status:"En ligne",vues:342,contacts:28,icon:"🟠"},
    {plateforme:"La Centrale",status:"En ligne",vues:187,contacts:14,icon:"🔵"},
    {plateforme:"PAP",status:"En ligne",vues:95,contacts:8,icon:"🏡"},
    {plateforme:"Facebook Marketplace",status:"En ligne",vues:521,contacts:41,icon:"📘"},
    {plateforme:"Google Ads",status:"Active",vues:2100,contacts:73,icon:"🔍"},
  ];

  return (
    <div style={{animation:"fadeSlideIn .4s ease"}}>
      <H1 style={{marginBottom:4}}>🚗 Rachat Véhicules Hors d'Usage</H1>
      <p style={{color:C.steel,fontSize:14,marginBottom:20}}>Gérez vos annonces d'achat VHU sur toutes les plateformes</p>

      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {["formulaire","annonces","landing"].map(t=>(
          <button key={t} onClick={()=>setActiveTab(t)}
            style={{padding:"8px 20px",background:activeTab===t?C.orange:"#161616",
              border:`1px solid ${activeTab===t?C.orange:C.border}`,borderRadius:6,
              color:activeTab===t?"#fff":C.steel,fontWeight:600,fontSize:13,cursor:"pointer",textTransform:"capitalize"}}>
            {t==="formulaire"?"📝 Formulaire Achat":t==="annonces"?"📣 Annonces Actives":"🌐 Landing Page"}
          </button>
        ))}
      </div>

      {activeTab==="formulaire"&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
          <Card>
            <H2 style={{marginBottom:16}}>📝 Formulaire Rachat VHU</H2>
            <p style={{fontSize:13,color:C.steel,marginBottom:16}}>Ce formulaire est intégrable sur votre site web et partageable sur les réseaux sociaux.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <Input label="Marque" value={formData.marque} onChange={e=>setFormData({...formData,marque:e.target.value})} placeholder="Renault, Peugeot..."/>
              <Input label="Modèle" value={formData.modele} onChange={e=>setFormData({...formData,modele:e.target.value})} placeholder="Clio, 208..."/>
              <Input label="Année" value={formData.annee} onChange={e=>setFormData({...formData,annee:e.target.value})} placeholder="2010" type="number"/>
              <Input label="Kilométrage" value={formData.kms} onChange={e=>setFormData({...formData,kms:e.target.value})} placeholder="150 000 km"/>
            </div>
            <Select label="État du véhicule" value={formData.etat} onChange={e=>setFormData({...formData,etat:e.target.value})} options={[
              {value:"epave",label:"Épave / Accidenté"},
              {value:"roule",label:"Roule encore"},
              {value:"hs",label:"En panne"},
              {value:"casse",label:"Pièces cassées"},
            ]}/>
            <Input label="Votre nom / Raison sociale" value={formData.contact} onChange={e=>setFormData({...formData,contact:e.target.value})} placeholder="Jean Dupont"/>
            <Input label="Téléphone" value={formData.tel} onChange={e=>setFormData({...formData,tel:e.target.value})} placeholder="06 XX XX XX XX" type="tel"/>
            <Btn onClick={()=>{setSubmitted(true);setTimeout(()=>setSubmitted(false),3000);}} icon="📩" size="lg" style={{width:"100%"}}>
              Envoyer la Demande de Rachat
            </Btn>
            {submitted&&<div style={{marginTop:10,background:"#22C55E18",border:`1px solid ${C.green}`,borderRadius:8,padding:10,color:C.green,textAlign:"center",fontWeight:600}}>
              ✅ Demande envoyée ! Nous vous rappelons sous 30 minutes.
            </div>}
          </Card>
          <Card>
            <H2 style={{marginBottom:16}}>ℹ️ Ce que nous achetons</H2>
            {[
              {icon:"🚗",type:"Voitures particulières",detail:"Toutes marques, état épave accepté"},
              {icon:"🚐",type:"Utilitaires & Vans",detail:"Fourgonnettes, camionnettes, VUL"},
              {icon:"🚛",type:"Poids Lourds",detail:"Tracteurs, semi-remorques, camions"},
              {icon:"🏍️",type:"2 Roues",detail:"Motos, scooters, cyclomoteurs"},
              {icon:"🚜",type:"Engins agricoles",detail:"Tracteurs, moissonneuses, outils"},
              {icon:"🔧",type:"Pièces & Carcasses",detail:"Moteurs, carrosseries, pièces HS"},
            ].map((v,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:`1px solid ${C.border}`}}>
                <span style={{fontSize:24}}>{v.icon}</span>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:C.text}}>{v.type}</div>
                  <div style={{fontSize:12,color:C.steel}}>{v.detail}</div>
                </div>
                <Tag label="✓ Accepté" color={C.green}/>
              </div>
            ))}
            <div style={{marginTop:16,background:"#FF550011",border:`1px solid ${C.orange}44`,borderRadius:8,padding:14}}>
              <div style={{fontSize:13,fontWeight:700,color:C.orange,marginBottom:6}}>📋 Documents fournis</div>
              <div style={{fontSize:12,color:C.steel,lineHeight:1.8}}>
                ✅ Certificat de destruction officiel<br/>
                ✅ Paiement immédiat (cash ou virement)<br/>
                ✅ Enlèvement gratuit à domicile<br/>
                ✅ Traçabilité légale garantie
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab==="annonces"&&(
        <Card>
          <H2 style={{marginBottom:16}}>📣 Annonces Actives sur les Plateformes</H2>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr style={{borderBottom:`1px solid ${C.border}`}}>
                {["Plateforme","Statut","Vues","Contacts","Actions"].map(h=>(
                  <th key={h} style={{textAlign:"left",padding:"10px 14px",fontSize:11,color:C.steel,letterSpacing:.5,textTransform:"uppercase"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {annonces.map((a,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${C.border}22`}}>
                  <td style={{padding:"14px",display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:20}}>{a.icon}</span>
                    <span style={{fontSize:14,fontWeight:600,color:C.text}}>{a.plateforme}</span>
                  </td>
                  <td style={{padding:"14px"}}><Tag label={a.status} color={C.green}/></td>
                  <td style={{padding:"14px",fontSize:15,fontWeight:700,color:C.amber}}>{a.vues.toLocaleString()}</td>
                  <td style={{padding:"14px",fontSize:15,fontWeight:700,color:C.orange}}>{a.contacts}</td>
                  <td style={{padding:"14px"}}>
                    <div style={{display:"flex",gap:8}}>
                      <Btn variant="ghost" size="sm">Éditer</Btn>
                      <Btn variant="danger" size="sm">Pause</Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Divider/>
          <div style={{display:"flex",gap:16,textAlign:"center"}}>
            <div style={{flex:1,background:"#0e0e0e",borderRadius:8,padding:12}}>
              <div style={{fontSize:28,fontWeight:900,color:C.amber}}>3 245</div>
              <div style={{fontSize:12,color:C.steel}}>Vues totales</div>
            </div>
            <div style={{flex:1,background:"#0e0e0e",borderRadius:8,padding:12}}>
              <div style={{fontSize:28,fontWeight:900,color:C.orange}}>164</div>
              <div style={{fontSize:12,color:C.steel}}>Contacts reçus</div>
            </div>
            <div style={{flex:1,background:"#0e0e0e",borderRadius:8,padding:12}}>
              <div style={{fontSize:28,fontWeight:900,color:C.green}}>5.1%</div>
              <div style={{fontSize:12,color:C.steel}}>Taux conversion</div>
            </div>
          </div>
        </Card>
      )}

      {activeTab==="landing"&&(
        <Card>
          <H2 style={{marginBottom:12}}>🌐 Landing Page VHU — Aperçu</H2>
          <p style={{fontSize:13,color:C.steel,marginBottom:16}}>Cette page est générée automatiquement et hébergée pour vos campagnes Google / Facebook.</p>
          <div style={{background:"#0a0a0a",borderRadius:12,overflow:"hidden",border:`1px solid ${C.border}`}}>
            <div style={{background:`linear-gradient(135deg,#1a0a00,#220e00)`,padding:"32px 24px",textAlign:"center"}}>
              <div style={{fontSize:13,color:C.orange,fontWeight:700,marginBottom:8,letterSpacing:2}}>METALCOLLECT PRO</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:38,fontWeight:900,color:"#fff",lineHeight:1.1,marginBottom:12}}>
                ON RACHÈTE VOTRE<br/>VÉHICULE CASH 🚗💶
              </div>
              <p style={{color:"#ccc",fontSize:15,marginBottom:20}}>Épave, accidenté, en panne — peu importe l'état. Paiement immédiat, enlèvement gratuit.</p>
              <div style={{display:"inline-block",background:C.orange,color:"#fff",padding:"14px 32px",borderRadius:8,fontWeight:700,fontSize:16,letterSpacing:.5}}>
                📞 Devis Gratuit en 5 Min →
              </div>
            </div>
            <div style={{padding:"20px 24px",display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
              {["✅ Paiement immédiat","🚛 Enlèvement gratuit","📋 Certificat destruction","⚡ Réponse en 30 min"].map((f,i)=>(
                <div key={i} style={{background:"#161616",borderRadius:8,padding:"10px 16px",fontSize:13,color:C.text,fontWeight:600}}>{f}</div>
              ))}
            </div>
          </div>
          <div style={{marginTop:16,display:"flex",gap:10}}>
            <Btn icon="🔗" size="lg" style={{flex:1}}>Publier la Landing Page</Btn>
            <Btn variant="secondary" icon="📋">Copier le lien</Btn>
          </div>
        </Card>
      )}
    </div>
  );
};

/* ── OUTILS WEB ── */
const OutilsWeb = () => {
  const outils = [
    {
      cat:"🌐 Présence Web",
      items:[
        {icon:"🏪",name:"Google My Business",desc:"Fiche établissement optimisée — apparaître dans Google Maps",status:"Actif",color:C.green},
        {icon:"🔍",name:"SEO Local",desc:"Optimisation pour recherches 'ferraille [ville]'",status:"En cours",color:C.amber},
        {icon:"⭐",name:"Gestion des Avis",desc:"Collecte et réponse automatique aux avis clients",status:"Actif",color:C.green},
        {icon:"🌍",name:"Site Vitrine",desc:"Site web professionnel avec formulaire de contact",status:"Actif",color:C.green},
      ]
    },
    {
      cat:"📊 Analytics & Tracking",
      items:[
        {icon:"📈",name:"Google Analytics 4",desc:"Suivi des visites, sources, conversions sur votre site",status:"Actif",color:C.green},
        {icon:"🎯",name:"Facebook Pixel",desc:"Retargeting sur les visiteurs de votre site",status:"Actif",color:C.green},
        {icon:"🔥",name:"Heatmap",desc:"Visualisez les zones cliquées sur vos pages",status:"Inactif",color:C.red},
        {icon:"📞",name:"Call Tracking",desc:"Suivez les appels générés par vos campagnes",status:"En cours",color:C.amber},
      ]
    },
    {
      cat:"🤖 Automatisation",
      items:[
        {icon:"💬",name:"Chatbot WhatsApp",desc:"Réponse automatique et capture de leads WhatsApp",status:"Inactif",color:C.red},
        {icon:"📧",name:"Autorépondeur Email",desc:"Séquences d'emails automatiques pour les prospects",status:"Actif",color:C.green},
        {icon:"🔔",name:"Alertes Prospects",desc:"Notification immédiate à chaque nouveau contact",status:"Actif",color:C.green},
        {icon:"📅",name:"Prise de RDV en ligne",desc:"Calendly intégré pour planifier les collectes",status:"En cours",color:C.amber},
      ]
    },
    {
      cat:"📱 Réseaux Sociaux",
      items:[
        {icon:"📘",name:"Page Facebook Pro",desc:"Animation et publications automatiques",status:"Actif",color:C.green},
        {icon:"📸",name:"Compte Instagram",desc:"Photos chantiers, avant/après, témoignages",status:"En cours",color:C.amber},
        {icon:"💼",name:"LinkedIn Entreprise",desc:"Présence B2B et networking industriel",status:"Inactif",color:C.red},
        {icon:"📹",name:"YouTube / Shorts",desc:"Vidéos de collecte, tutoriels tri ferraille",status:"Inactif",color:C.red},
      ]
    },
  ];

  return (
    <div style={{animation:"fadeSlideIn .4s ease"}}>
      <H1 style={{marginBottom:4}}>🛠️ Outils Web & Digital</H1>
      <p style={{color:C.steel,fontSize:14,marginBottom:24}}>Gérez toute votre présence internet depuis un seul endroit</p>
      {outils.map((cat,ci)=>(
        <div key={ci} style={{marginBottom:24}}>
          <H2 style={{marginBottom:14}}>{cat.cat}</H2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
            {cat.items.map((item,ii)=>(
              <Card key={ii} style={{display:"flex",alignItems:"flex-start",gap:14}}>
                <div style={{width:44,height:44,borderRadius:10,background:"#1a1a1a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                  {item.icon}
                </div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontWeight:700,fontSize:14,color:C.text}}>{item.name}</span>
                    <Tag label={item.status} color={item.color}/>
                  </div>
                  <p style={{fontSize:12,color:C.steel,lineHeight:1.5,marginBottom:8}}>{item.desc}</p>
                  <div style={{display:"flex",gap:6}}>
                    <Btn size="sm" variant={item.status==="Inactif"?"primary":"secondary"}>
                      {item.status==="Inactif"?"Activer":"Configurer"}
                    </Btn>
                    {item.status==="Actif"&&<Btn size="sm" variant="ghost">Voir stats</Btn>}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ── CONTACTS ── */
const Contacts = () => {
  const [search,setSearch]=useState("");
  const contacts = [
    {nom:"Ferronnerie Dupont SAS",type:"Société",email:"contact@ferronnerie-dupont.fr",tel:"05 61 XX XX XX",seg:"Métaux",score:92},
    {nom:"Jean-Marc Tessier",type:"Auto-Entr.",email:"jm.tessier@gmail.com",tel:"06 XX XX XX XX",seg:"Ferraille",score:85},
    {nom:"Recyclage Métaux 31",type:"Société",email:"info@rm31.fr",tel:"05 34 XX XX XX",seg:"Ferraille",score:78},
    {nom:"Marie Bouchard",type:"Particulier",email:"marie.b@orange.fr",tel:"06 XX XX XX XX",seg:"VHU",score:65},
    {nom:"Aliminium Pro SARL",type:"Société",email:"contact@alupro.fr",tel:"05 61 XX XX XX",seg:"Non-Ferreux",score:94},
    {nom:"Pierre Lafon",type:"Particulier",email:"p.lafon@free.fr",tel:"06 XX XX XX XX",seg:"Communauté",score:55},
    {nom:"BTP Occitanie",type:"Société",email:"info@btpoc.fr",tel:"05 34 XX XX XX",seg:"Ferraille",score:88},
    {nom:"Sylvie Martin",type:"Auto-Entr.",email:"sylvie.m@gmail.com",tel:"06 XX XX XX XX",seg:"VHU",score:71},
  ].filter(c=>c.nom.toLowerCase().includes(search.toLowerCase())||c.seg.toLowerCase().includes(search.toLowerCase()));

  const segColors = {Société:C.orange,"Auto-Entr.":C.amber,Particulier:C.steel,Ferraille:C.red,"Non-Ferreux":"#A8DADC",VHU:C.blue,Communauté:C.green,Métaux:C.gold};

  return (
    <div style={{animation:"fadeSlideIn .4s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <div><H1>👥 Contacts & Segments</H1><p style={{color:C.steel,fontSize:14,marginTop:4}}>Base de données prospects et clients</p></div>
        <div style={{display:"flex",gap:10}}>
          <Btn variant="secondary" icon="📥">Importer CSV</Btn>
          <Btn icon="➕">Ajouter Contact</Btn>
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:20,flexWrap:"wrap"}}>
        {[
          {label:"Total",n:4287,color:C.orange},
          {label:"Sociétés",n:421,color:C.amber},
          {label:"Auto-Entr.",n:312,color:C.gold},
          {label:"Particuliers VHU",n:1000,color:C.blue},
          {label:"Communauté",n:2155,color:C.green},
          {label:"Non-Ferreux",n:178,color:"#A8DADC"},
        ].map(s=>(
          <div key={s.label} style={{background:C.card,border:`1px solid ${s.color}44`,borderRadius:8,padding:"10px 16px",textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:900,color:s.color,fontFamily:"'Barlow Condensed',sans-serif"}}>{s.n.toLocaleString()}</div>
            <div style={{fontSize:11,color:C.steel}}>{s.label}</div>
          </div>
        ))}
      </div>
      <Card>
        <div style={{marginBottom:14}}>
          <Input placeholder="🔍 Rechercher un contact, une entreprise, un segment..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead>
            <tr style={{borderBottom:`1px solid ${C.border}`}}>
              {["Nom / Entreprise","Type","Email","Téléphone","Segment","Score","Actions"].map(h=>(
                <th key={h} style={{textAlign:"left",padding:"10px 12px",fontSize:11,color:C.steel,letterSpacing:.5,textTransform:"uppercase"}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {contacts.map((c,i)=>(
              <tr key={i} style={{borderBottom:`1px solid ${C.border}22`}}
                onMouseEnter={e=>e.currentTarget.style.background="#1a1a1a"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <td style={{padding:"12px",fontSize:14,fontWeight:600,color:C.text}}>{c.nom}</td>
                <td style={{padding:"12px"}}><Tag label={c.type} color={segColors[c.type]||C.steel}/></td>
                <td style={{padding:"12px",fontSize:13,color:C.steel}}>{c.email}</td>
                <td style={{padding:"12px",fontSize:13,color:C.steel,fontFamily:"monospace"}}>{c.tel}</td>
                <td style={{padding:"12px"}}><Tag label={c.seg} color={segColors[c.seg]||C.steel}/></td>
                <td style={{padding:"12px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <div style={{flex:1,height:6,background:"#1a1a1a",borderRadius:3,overflow:"hidden"}}>
                      <div style={{height:"100%",background:c.score>80?C.green:c.score>60?C.amber:C.red,width:`${c.score}%`}}/>
                    </div>
                    <span style={{fontSize:12,fontWeight:700,color:c.score>80?C.green:c.score>60?C.amber:C.red}}>{c.score}</span>
                  </div>
                </td>
                <td style={{padding:"12px"}}>
                  <div style={{display:"flex",gap:4}}>
                    <Btn variant="ghost" size="sm">✉️</Btn>
                    <Btn variant="ghost" size="sm">📱</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

/* ── GÉNÉRATEUR DE CONTENU IA ── */
const GenerateurIA = () => {
  const [type,setType]=useState("email");
  const [target,setTarget]=useState("autoentrepreneur");
  const [tone,setTone]=useState("professionnel");
  const [result,setResult]=useState("");
  const [loading,setLoading]=useState(false);

  const contents = {
    email: {
      autoentrepreneur: `Objet : 🔩 Opportunité : Devenez collecteur de ferraille indépendant

Bonjour,

En tant qu'auto-entrepreneur, vous cherchez peut-être à diversifier vos revenus ?

Notre réseau de rachat de ferraille et métaux recherche des collecteurs indépendants dans votre région.

💡 Ce que nous proposons :
• Rémunération au kilo collecté
• Formation gratuite au tri des métaux
• Matériel de collecte fourni
• Paiement hebdomadaire garanti

✅ Aucun investissement de départ
✅ Activité complémentaire flexible
✅ Secteur en pleine croissance

Intéressé(e) ? Répondez à cet email ou appelez-nous.

Cordialement,
L'équipe MetalPro`,
      entreprise:`Objet : Partenariat Rachat Ferraille — Contrat Annuel Garanti

Madame, Monsieur,

Votre activité génère des déchets métalliques ? Nous avons une solution rentable pour vous.

MetalPro propose des contrats de rachat annuels pour les entreprises productrices de ferraille.

🏭 Notre offre B2B :
• Enlèvement régulier sur site (hebdo/mensuel selon volume)
• Prix indexé sur le cours des métaux + prime de fidélité
• Bons de pesée certifiés pour votre comptabilité
• Responsabilité environnementale prise en charge

💶 Économisez sur vos frais d'élimination et générez des revenus supplémentaires.

Planifions un rendez-vous pour évaluer votre potentiel.`,
    },
    sms: {
      autoentrepreneur:"🔩 Opportunité auto-entr : devenez collecteur ferraille ! Revenus complémentaires, secteur porteur. Info : 06XXXXXXXXX - STOP pour se désab.",
      communaute:"🏘️ MetalPro : Journée collecte ferraille SAMEDI dans votre quartier ! Déposez gratuitement vos objets métalliques. Adresse : [lieu]",
    },
    pub:{
      vhu:"🚗 Votre voiture ne roule plus ? On la rachète CASH ! Toutes marques, tous états. Enlèvement GRATUIT. Certificat de destruction fourni. Appelez maintenant : 06XXXXXXXXX",
      ferraille:"🔩 MEILLEURS PRIX FERRAILLE & MÉTAUX de la région ! Cuivre, alu, inox, acier — on pèse et on paie sur place. Professionnels et particuliers bienvenus.",
    },
    post:{
      facebook:`📸 [Photo d'une pile de ferraille triée]

♻️ Aujourd'hui on a collecté 2,3 tonnes de ferraille dans la zone industrielle de [ville] !

Acier, cuivre, aluminium — chaque kilo compte pour l'environnement ET pour votre portefeuille 💶

Vous avez de la ferraille à vendre ? On se déplace gratuitement pour évaluer et enlever.

📞 Contactez-nous directement
🔗 Devis en ligne : [lien]

#Ferraille #Recyclage #Métaux #[Ville] #Environnement`,
    },
  };

  const generate = () => {
    setLoading(true);
    setTimeout(()=>{
      const t = contents[type];
      const key = Object.keys(t)[0];
      setResult(t[target]||t[key]||"Contenu généré pour votre campagne marketing dans le secteur des métaux et de la ferraille.");
      setLoading(false);
    },800);
  };

  return (
    <div style={{animation:"fadeSlideIn .4s ease"}}>
      <H1 style={{marginBottom:4}}>🤖 Générateur de Contenu</H1>
      <p style={{color:C.steel,fontSize:14,marginBottom:24}}>Générez automatiquement des textes marketing adaptés à votre secteur</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1.4fr",gap:20}}>
        <div>
          <Card>
            <H2 style={{marginBottom:16}}>⚙️ Paramètres</H2>
            <Select label="Type de contenu" value={type} onChange={e=>setType(e.target.value)} options={[
              {value:"email",label:"📧 Email marketing"},
              {value:"sms",label:"📱 SMS"},
              {value:"pub",label:"📣 Annonce publicitaire"},
              {value:"post",label:"📱 Post réseaux sociaux"},
            ]}/>
            <Select label="Cible" value={target} onChange={e=>setTarget(e.target.value)} options={[
              {value:"autoentrepreneur",label:"⚙️ Auto-Entrepreneur"},
              {value:"entreprise",label:"🏭 Société / Industriel"},
              {value:"vhu",label:"🚗 Cédant Véhicule"},
              {value:"ferraille",label:"🔩 Producteur Ferraille"},
              {value:"communaute",label:"🏘️ Communauté Locale"},
              {value:"nf",label:"🥈 Métaux Non-Ferreux"},
            ]}/>
            <Select label="Ton" value={tone} onChange={e=>setTone(e.target.value)} options={[
              {value:"professionnel",label:"💼 Professionnel"},
              {value:"commercial",label:"🎯 Commercial / Dynamique"},
              {value:"local",label:"🏘️ Local / Proche"},
              {value:"urgent",label:"⚡ Urgent / Offre limitée"},
            ]}/>
            <Btn onClick={generate} icon={loading?"⏳":"✨"} size="lg" style={{width:"100%"}} disabled={loading}>
              {loading?"Génération...":"Générer le contenu"}
            </Btn>
          </Card>
          <Card style={{marginTop:16}}>
            <H2 style={{marginBottom:12}}>💡 Idées de Campagnes</H2>
            {[
              "Collecte de printemps dans votre quartier",
              "Hausse des cours — vendez maintenant",
              "Partenariat auto-entrepreneur",
              "Journée portes ouvertes centre de tri",
              "Rachat spécial VHU ce mois-ci",
            ].map((idea,i)=>(
              <div key={i} style={{padding:"8px 0",borderBottom:`1px solid ${C.border}`,fontSize:13,color:C.steel,cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.color=C.orange}
                onMouseLeave={e=>e.currentTarget.style.color=C.steel}>
                💡 {idea}
              </div>
            ))}
          </Card>
        </div>
        <Card>
          <H2 style={{marginBottom:16}}>📄 Contenu Généré</H2>
          {result ? (
            <>
              <div style={{background:"#0e0e0e",borderRadius:8,padding:16,fontSize:13,color:C.text,lineHeight:1.8,whiteSpace:"pre-wrap",minHeight:300,fontFamily:"'Barlow',sans-serif"}}>
                {result}
              </div>
              <div style={{display:"flex",gap:10,marginTop:14}}>
                <Btn icon="📋" style={{flex:1}} onClick={()=>navigator.clipboard?.writeText(result)}>Copier</Btn>
                <Btn variant="secondary" icon="📧">Ouvrir dans Email</Btn>
                <Btn variant="secondary" icon="🔄" onClick={generate}>Regénérer</Btn>
              </div>
            </>
          ) : (
            <div style={{minHeight:300,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12,color:C.muted}}>
              <span style={{fontSize:48}}>✨</span>
              <p style={{fontSize:14}}>Configurez les paramètres et cliquez sur "Générer"</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════ */
const PAGES = [
  {id:"dashboard",icon:"🏠",label:"Tableau de Bord",component:Dashboard},
  {id:"email",icon:"✉️",label:"Email Marketing",component:EmailBuilder},
  {id:"sms",icon:"📱",label:"SMS Campagnes",component:SmsMarketing},
  {id:"pub",icon:"📣",label:"Publicité Multi-Canal",component:PubMultiCanal},
  {id:"vhu",icon:"🚗",label:"Rachat Véhicules",component:RachatVehicules},
  {id:"outils",icon:"🛠️",label:"Outils Web & Digital",component:OutilsWeb},
  {id:"contacts",icon:"👥",label:"Contacts & Segments",component:Contacts},
  {id:"ia",icon:"🤖",label:"Générateur de Contenu",component:GenerateurIA},
];

export default function App() {
  const [page,setPage]=useState("dashboard");
  const [collapsed,setCollapsed]=useState(false);
  const Page = PAGES.find(p=>p.id===page)?.component || Dashboard;

  return (
    <>
      <style>{css}</style>
      <div style={{display:"flex",minHeight:"100vh",background:C.bg,fontFamily:"'Barlow',sans-serif"}}>
        {/* Sidebar */}
        <div style={{width:collapsed?64:240,background:C.panel,borderRight:`1px solid ${C.border}`,
          display:"flex",flexDirection:"column",transition:"width .25s",flexShrink:0,position:"sticky",top:0,height:"100vh",overflowY:"auto"}}>
          {/* Logo */}
          <div style={{padding:collapsed?"16px 12px":"20px 20px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:collapsed?"center":"space-between"}}>
            {!collapsed&&(
              <div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:22,color:C.orange,letterSpacing:1}}>⚙️ METAL</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:C.steel,letterSpacing:3}}>MARKETING PRO</div>
              </div>
            )}
            <button onClick={()=>setCollapsed(!collapsed)}
              style={{background:"none",border:`1px solid ${C.border}`,borderRadius:6,color:C.steel,cursor:"pointer",padding:"6px 8px",fontSize:14}}>
              {collapsed?"→":"←"}
            </button>
          </div>
          {/* Nav */}
          <nav style={{flex:1,padding:"12px 8px"}}>
            {PAGES.map(p=>{
              const active = page===p.id;
              return (
                <button key={p.id} onClick={()=>setPage(p.id)}
                  style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:collapsed?"12px":"10px 14px",
                    borderRadius:8,border:"none",background:active?`${C.orange}18`:"transparent",
                    color:active?C.orange:C.steel,cursor:"pointer",marginBottom:2,
                    borderLeft:active?`3px solid ${C.orange}`:"3px solid transparent",
                    justifyContent:collapsed?"center":"flex-start",transition:"all .15s"}}>
                  <span style={{fontSize:18}}>{p.icon}</span>
                  {!collapsed&&<span style={{fontSize:13,fontWeight:active?700:400}}>{p.label}</span>}
                </button>
              );
            })}
          </nav>
          {/* Bottom */}
          {!collapsed&&(
            <div style={{padding:16,borderTop:`1px solid ${C.border}`}}>
              <div style={{background:"#FF550018",border:`1px solid ${C.orange}44`,borderRadius:8,padding:12}}>
                <div style={{fontSize:12,fontWeight:700,color:C.orange,marginBottom:4}}>⚡ Statut</div>
                <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.steel}}>
                  <Dot/> Toutes campagnes actives
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main */}
        <main style={{flex:1,padding:28,overflowY:"auto",maxHeight:"100vh"}}>
          {/* Top bar */}
          <div style={{display:"flex",justifyContent:"flex-end",alignItems:"center",marginBottom:20,gap:12}}>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 16px",fontSize:13,color:C.steel,display:"flex",alignItems:"center",gap:8}}>
              <Dot/> <span style={{color:C.green,fontWeight:600}}>12 campagnes actives</span>
            </div>
            <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 16px",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:16}}>👤</span>
              <span style={{fontSize:13,color:C.text,fontWeight:600}}>MetalPro Admin</span>
            </div>
          </div>
          <Page/>
        </main>
      </div>
    </>
  );
}

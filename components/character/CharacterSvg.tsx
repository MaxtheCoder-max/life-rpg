'use client'

import type { Outfit, BackgroundKey } from '@/types/character'
import { SLOT_COLORS } from '@/lib/slotData'

const SKIN  = '#f2dfc6'
const SKIN2 = '#e8cba8'  // shadow

function cg(idx: number) { return Math.floor(idx / 3) }  // category → shape group 0-3

// ── Backgrounds ───────────────────────────────────────────────────
function BgRoom() {
  return (
    <>
      <rect width={200} height={380} fill="#0d0b16" />
      <rect x={0} y={0} width={200} height={275} fill="#100e1a" />
      {/* Window */}
      <rect x={116} y={28} width={66} height={80} rx={4} fill="rgba(140,165,220,0.05)"
        stroke="rgba(180,200,240,0.1)" strokeWidth={1} />
      <line x1={149} y1={28} x2={149} y2={108} stroke="rgba(180,200,240,0.07)" strokeWidth={1}/>
      <line x1={116} y1={68} x2={182} y2={68} stroke="rgba(180,200,240,0.07)" strokeWidth={1}/>
      {/* Ambient window glow */}
      <ellipse cx={149} cy={68} rx={50} ry={40} fill="rgba(130,155,220,0.03)" />
      {/* Shelf */}
      <rect x={2} y={55} width={34} height={145} rx={2} fill="rgba(100,80,60,0.12)"
        stroke="rgba(255,255,255,0.04)" strokeWidth={0.5} />
      {[68,86,104,122,140,158].map((y,i)=>(
        <rect key={i} x={4} y={y} width={30} height={16} rx={1}
          fill={['#50304080','#30405060','#504030aa','#3a504050','#503830aa','#4050306a'][i]} />
      ))}
      {/* Floor */}
      <rect x={0} y={275} width={200} height={105} fill="#0a0810" />
      <line x1={0} y1={275} x2={200} y2={275} stroke="rgba(255,255,255,0.05)" strokeWidth={1}/>
      {/* Floor reflection strip */}
      <rect x={0} y={275} width={200} height={8} fill="rgba(150,170,220,0.02)" />
    </>
  )
}

function BgGreenhouse() {
  return (
    <>
      <rect width={200} height={380} fill="#0a1410" />
      {/* Glass ceiling */}
      <rect x={0} y={0} width={200} height={40} fill="rgba(80,160,100,0.05)"
        stroke="rgba(100,180,120,0.08)" strokeWidth={1} />
      {[30,60,90,120,150,170].map((x,i)=>(
        <line key={i} x1={x} y1={0} x2={x} y2={40}
          stroke="rgba(100,180,120,0.06)" strokeWidth={0.8} />
      ))}
      {/* Ambient green glow */}
      <ellipse cx={100} cy={200} rx={120} ry={200} fill="rgba(50,120,70,0.04)" />
      {/* BG plants left */}
      <ellipse cx={16} cy={260} rx={16} ry={40} fill="rgba(50,110,60,0.15)" />
      <line x1={16} y1={260} x2={16} y2={180} stroke="rgba(60,130,70,0.12)" strokeWidth={2}/>
      {/* BG plants right */}
      <ellipse cx={184} cy={255} rx={16} ry={45} fill="rgba(50,110,60,0.15)" />
      <line x1={184} y1={255} x2={184} y2={170} stroke="rgba(60,130,70,0.12}" strokeWidth={2}/>
      {/* Floor */}
      <rect x={0} y={310} width={200} height={70} fill="rgba(30,60,35,0.5)" />
      <line x1={0} y1={310} x2={200} y2={310} stroke="rgba(80,160,90,0.08)" strokeWidth={1}/>
    </>
  )
}

function BgNight() {
  return (
    <>
      <rect width={200} height={380} fill="#06060e" />
      {/* Stars */}
      {[14,37,62,83,105,128,152,173,19,45,78,110,140,165,31,55,95,125,158].map((x,i)=>(
        <circle key={i} cx={x} cy={(i*17+8)%170} r={0.7+((i*7)%3)*0.3}
          fill={`rgba(200,215,255,${0.25+((i*11)%4)*0.12})`} />
      ))}
      {/* City skyline */}
      <path d={`M0,300 L20,250 L28,300 L40,230 L52,300 L65,245 L72,300 L88,220 L96,300 L110,238 L118,300 L130,248 L138,300 L155,228 L162,300 L178,240 L185,300 L200,300 L200,380 L0,380Z`}
        fill="#0c0c1a" />
      {/* City lights glow */}
      <rect x={0} y={295} width={200} height={85} fill="rgba(50,70,130,0.08)" />
      {/* Window lights in skyline */}
      {[22,42,70,92,114,134,158,180].map((x,i)=>(
        <rect key={i} x={x} y={230+(i%3)*8} width={4} height={3} rx={0.5}
          fill={`rgba(${i%2?200:180},${i%3?180:200},100,0.25)`} />
      ))}
    </>
  )
}

function BgLibrary() {
  return (
    <>
      <rect width={200} height={380} fill="#0e0a06" />
      {/* Warm amber light from above */}
      <ellipse cx={100} cy={-20} rx={100} ry={80} fill="rgba(200,150,60,0.06)" />
      {/* Left shelf */}
      <rect x={0} y={10} width={28} height={310} fill="rgba(70,50,30,0.35)"
        stroke="rgba(255,220,150,0.06)" strokeWidth={0.5}/>
      {[30,55,80,105,130,155,180,205,230,255].map((y,i)=>(
        <rect key={i} x={2} y={y} width={24} height={20} rx={1}
          fill={['#6a302080','#405a3060','#6050286a','#4a5a4060','#604a306a',
                 '#3a5060aa','#5a403060','#404a6060','#5a503040','#4a603060'][i%10]} />
      ))}
      {/* Right shelf */}
      <rect x={172} y={10} width={28} height={310} fill="rgba(70,50,30,0.35)"
        stroke="rgba(255,220,150,0.06)" strokeWidth={0.5}/>
      {[30,55,80,105,130,155,180,205,230,255].map((y,i)=>(
        <rect key={i} x={174} y={y} width={24} height={20} rx={1}
          fill={['#503060aa','#5a402080','#3a506060','#604a3060','#405a4060',
                 '#5a303080','#4060506a','#6a403040','#3a5a4060','#604a5040'][i%10]} />
      ))}
      {/* Floor */}
      <rect x={0} y={318} width={200} height={62} fill="rgba(50,35,20,0.45)" />
      <line x1={0} y1={318} x2={200} y2={318} stroke="rgba(200,160,80,0.07)" strokeWidth={1}/>
    </>
  )
}

function BgBalcony() {
  return (
    <>
      {/* Pre-dawn sky */}
      <rect width={200} height={310} fill="#0c1220" />
      {/* Horizon glow */}
      <ellipse cx={100} cy={260} rx={150} ry={60} fill="rgba(200,130,60,0.07)" />
      <rect x={0} y={240} width={200} height={70} fill="rgba(180,120,50,0.04)" />
      {/* Stars fading */}
      {[18,45,72,100,128,155,182,30,60,90,120,148,170].map((x,i)=>(
        <circle key={i} cx={x} cy={(i*13+5)%220} r={0.6}
          fill={`rgba(200,220,255,${0.15+((i*7)%3)*0.1})`} />
      ))}
      {/* Railing */}
      <rect x={0} y={310} width={200} height={14} rx={3}
        fill="rgba(110,90,70,0.5)" stroke="rgba(200,180,140,0.12)" strokeWidth={1}/>
      {[12,32,52,72,92,112,132,152,172,192].map((x,i)=>(
        <rect key={i} x={x} y={308} width={3} height={18} rx={1}
          fill="rgba(110,90,70,0.4)" />
      ))}
      {/* Balcony floor */}
      <rect x={0} y={322} width={200} height={58} fill="rgba(55,45,35,0.55)" />
      {/* Small plant pot */}
      <ellipse cx={18} cy={322} rx={12} ry={5} fill="rgba(70,110,75,0.15)" />
      <rect x={12} y={306} width={12} height={16} rx={2} fill="rgba(90,65,45,0.3)" />
    </>
  )
}

// ── Slot layer components ─────────────────────────────────────────

function HairBack({ g, color }: { g: number; color: string }) {
  if (g === 0) return null  // short — no back hair
  if (g === 1) return (     // long straight
    <>
      <path d="M72,62 Q55,145 60,230 Q74,228 80,215 Q82,165 100,92" fill={color} opacity={0.82}/>
      <path d="M128,62 Q145,145 140,230 Q126,228 120,215 Q118,165 100,92" fill={color} opacity={0.82}/>
    </>
  )
  if (g === 2) return (     // wavy/medium
    <>
      <path d="M73,64 Q60,135 68,185 Q80,182 86,170 Q83,130 100,90" fill={color} opacity={0.8}/>
      <path d="M127,64 Q140,135 132,185 Q120,182 114,170 Q117,130 100,90" fill={color} opacity={0.8}/>
    </>
  )
  return (                  // tied/specialty — slight tail
    <path d="M116,80 Q126,100 120,140" stroke={color} strokeWidth={9}
      fill="none" strokeLinecap="round" opacity={0.78}/>
  )
}

function HairFront({ g, v, color }: { g: number; v: number; color: string }) {
  const caps: Record<number, string[]> = {
    0: [
      "M73,62 Q73,30 100,28 Q127,30 127,62 Q118,52 108,55 Q100,52 92,55 Q82,52 73,62Z",
      "M73,60 Q74,28 100,26 Q126,28 127,60 Q120,49 110,53 Q100,50 90,53 Q80,49 73,60Z",
      "M74,64 Q75,31 100,29 Q125,31 126,64 Q116,53 104,57 Q100,55 96,57 Q84,53 74,64Z",
    ],
    1: [
      "M73,70 Q72,26 100,24 Q128,26 127,70 Q118,58 107,62 Q100,59 93,62 Q82,58 73,70Z",
      "M72,72 Q72,25 100,23 Q128,25 128,72 Q118,58 105,63 Q100,60 95,63 Q82,58 72,72Z",
      "M73,68 Q73,26 100,24 Q127,26 127,68 Q116,56 104,61 Q100,58 96,61 Q84,56 73,68Z",
    ],
    2: [
      "M73,66 Q72,28 100,26 Q128,28 127,66 Q120,55 110,58 Q100,55 90,58 Q80,55 73,66Z",
      "M73,64 Q73,28 100,26 Q127,28 127,64 Q118,54 108,57 Q100,54 92,57 Q82,54 73,64Z",
      "M72,68 Q72,27 100,25 Q128,27 128,68 Q118,56 106,60 Q100,57 94,60 Q82,56 72,68Z",
    ],
    3: [
      "M73,65 Q73,29 100,27 Q127,29 127,65 Q118,55 108,58 Q100,55 92,58 Q82,55 73,65Z",
      "M74,67 Q74,29 100,27 Q126,29 126,67 Q116,55 105,59 Q100,56 95,59 Q84,55 74,67Z",
      "M73,63 Q73,28 100,26 Q127,28 127,63 Q118,53 107,57 Q100,54 93,57 Q82,53 73,63Z",
    ],
  }
  const d = caps[g]?.[v] ?? caps[0][0]
  if (g === 3) return (  // tied — add band
    <>
      <path d={d} fill={color}/>
      <ellipse cx={112} cy={74} rx={5} ry={3} fill={color} opacity={0.65}
        transform="rotate(-12 112 74)"/>
    </>
  )
  return <path d={d} fill={color}/>
}

function HeadDecorLayer({ g, v, color }: { g: number; v: number; color: string }) {
  if (g === 0) return v === 0 ? (  // hair accessories
    <ellipse cx={100} cy={27} rx={22} ry={5} fill="none"
      stroke={color} strokeWidth={1.5} opacity={0.8}/>
  ) : v === 1 ? (
    <rect x={82} y={26} width={18} height={5} rx={2.5} fill={color} opacity={0.8}/>
  ) : (
    <>
      {[88,100,112].map((cx,i)=>(
        <ellipse key={i} cx={cx} cy={30-(i===1?4:0)} rx={4.5} ry={4.5}
          fill={color} opacity={0.55+i*0.05}/>
      ))}
    </>
  )
  if (g === 1) return (  // audio/tech
    <>
      <path d="M73,60 Q73,36 100,34 Q127,36 127,60"
        fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.82}/>
      <rect x={70} y={57} width={8} height={12} rx={3} fill={color} opacity={0.8}/>
      <rect x={122} y={57} width={8} height={12} rx={3} fill={color} opacity={0.8}/>
    </>
  )
  if (g === 2) return v === 0 ? (  // nature/soft
    <ellipse cx={100} cy={21} rx={24} ry={5} fill="none"
      stroke={color} strokeWidth={1.2}
      style={{ filter: `drop-shadow(0 0 5px ${color})` }} opacity={0.72}/>
  ) : v === 1 ? (
    <path d="M86,34 Q80,20 84,12 Q90,22 86,34Z" fill={color} opacity={0.7}/>
  ) : (
    <>
      {[0,60,120,180,240,300].map((deg,i)=>(
        <ellipse key={i} cx={100} cy={26} rx={3.5} ry={5.5}
          fill={color} opacity={0.55}
          transform={`rotate(${deg} 100 26) translate(0 -7)`}/>
      ))}
      <circle cx={100} cy={26} r={3} fill={color} opacity={0.9}/>
    </>
  )
  return v === 0 ? (  // structured: hat
    <>
      <ellipse cx={100} cy={30} rx={28} ry={6} fill={color} opacity={0.72}/>
      <rect x={79} y={6} width={42} height={26} rx={6} fill={color} opacity={0.68}/>
    </>
  ) : v === 1 ? (     // crown
    <path d="M76,36 L82,22 L88,32 L100,14 L112,32 L118,22 L124,36Z"
      fill={color} opacity={0.72}/>
  ) : (               // visor/goggles
    <>
      <path d="M78,60 Q78,50 100,50 Q122,50 122,60"
        fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" opacity={0.6}/>
      <rect x={76} y={54} width={20} height={9} rx={4.5} fill={color} opacity={0.38}/>
      <rect x={104} y={54} width={20} height={9} rx={4.5} fill={color} opacity={0.38}/>
    </>
  )
}

function FaceDecorLayer({ g, v, color }: { g: number; v: number; color: string }) {
  if (g === 0) return (  // glasses
    <>
      <rect x={79} y={59} width={15} height={9} rx={v===0?2:4.5}
        fill="none" stroke={color} strokeWidth={v===1?0.9:1.2} opacity={0.72}/>
      <rect x={106} y={59} width={15} height={9} rx={v===0?2:4.5}
        fill="none" stroke={color} strokeWidth={v===1?0.9:1.2} opacity={0.72}/>
      <line x1={94} y1={63.5} x2={106} y2={63.5} stroke={color} strokeWidth={1} opacity={0.55}/>
      <line x1={79} y1={63.5} x2={75} y2={62} stroke={color} strokeWidth={0.8} opacity={0.5}/>
      <line x1={121} y1={63.5} x2={125} y2={62} stroke={color} strokeWidth={0.8} opacity={0.5}/>
    </>
  )
  if (g === 1) return v === 0 ? (  // tear mole
    <circle cx={117} cy={75} r={2} fill={color} opacity={0.8}/>
  ) : v === 1 ? (    // bandage
    <rect x={91} y={62} width={16} height={8} rx={3} fill={color} opacity={0.58}/>
  ) : (              // star sticker
    <path d="M112,67 L113.5,71.5 L118,71.5 L114.5,74.2 L116,78.5 L112,76 L108,78.5 L109.5,74.2 L106,71.5 L110.5,71.5Z"
      fill={color} opacity={0.7}/>
  )
  if (g === 2) return v === 0 ? (  // mask
    <rect x={78} y={72} width={44} height={18} rx={8} fill={color} opacity={0.32}/>
  ) : v === 1 ? (    // scarf wrap
    <path d="M75,76 Q100,90 125,76 L126,92 Q100,108 74,92Z" fill={color} opacity={0.3}/>
  ) : (
    <path d="M82,80 Q100,92 118,80 Q118,90 100,96 Q82,90 82,80Z" fill={color} opacity={0.35}/>
  )
  return v === 0 ? (  // earring drops
    <>
      {[73,127].map((cx,i)=>(
        <g key={i}>
          <circle cx={cx} cy={67} r={2} fill={color} opacity={0.8}/>
          <line x1={cx} y1={69} x2={cx} y2={76} stroke={color} strokeWidth={1} opacity={0.6}/>
          <circle cx={cx} cy={77} r={2.5} fill={color} opacity={0.7}/>
        </g>
      ))}
    </>
  ) : v === 1 ? (     // ear comm
    <ellipse cx={73} cy={68} rx={4} ry={6} fill={color} opacity={0.48}/>
  ) : (               // face flower
    <ellipse cx={74} cy={72} rx={4} ry={4} fill={color} opacity={0.52}/>
  )
}

function InnerTopLayer({ g, v, color }: { g: number; v: number; color: string }) {
  const sleeve = (side: 'L'|'R') => side === 'L'
    ? { x1: 70, y1: 108, x2: 52, y2: 165 }
    : { x1: 130, y1: 108, x2: 148, y2: 165 }
  const sl = sleeve('L'); const sr = sleeve('R')
  const paths = [
    { torso:"M70,105 L130,105 L132,200 L68,200Z",
      armL:`M${sl.x1},${sl.y1} L${sl.x2},${sl.y2} L${sl.x2+10},${sl.y2+5} L${sl.x1+8},${sl.y1+12}Z`,
      armR:`M${sr.x1},${sr.y1} L${sr.x2},${sr.y2} L${sr.x2-10},${sr.y2+5} L${sr.x1-8},${sr.y1+12}Z` },
    { torso:"M67,105 L133,105 L135,200 L65,200Z",
      armL:"M70,105 L46,162 L60,167 L74,118Z",
      armR:"M130,105 L154,162 L140,167 L126,118Z" },
    { torso:"M72,105 L128,105 L130,200 L70,200Z",
      armL:"M72,105 L58,152 L70,156 L80,118Z",
      armR:"M128,105 L142,152 L130,156 L120,118Z" },
    { torso:"M65,105 L135,105 L137,200 L63,200Z",
      armL:"M65,105 L44,165 L60,170 L72,118Z",
      armR:"M135,105 L156,165 L140,170 L128,118Z" },
  ]
  const p = paths[g] ?? paths[0]
  return (
    <g opacity={0.78}>
      <path d={p.torso} fill={color}/>
      <path d={p.armL}  fill={color}/>
      <path d={p.armR}  fill={color}/>
      {g === 0 && v === 0 && (
        /* turtleneck extension */
        <rect x={91} y={87} width={18} height={20} rx={4} fill={color} opacity={0.72}/>
      )}
      {g === 1 && (
        /* loose crease lines */
        <>
          <line x1={88} y1={130} x2={86} y2={195} stroke="rgba(0,0,0,0.1)" strokeWidth={2}/>
          <line x1={112} y1={130} x2={114} y2={195} stroke="rgba(0,0,0,0.1)" strokeWidth={2}/>
        </>
      )}
      {g === 2 && (
        /* athletic stripe */
        <>
          <rect x={76} y={120} width={4} height={75} rx={2} fill="rgba(255,255,255,0.08)"/>
          <rect x={120} y={120} width={4} height={75} rx={2} fill="rgba(255,255,255,0.08)"/>
        </>
      )}
    </g>
  )
}

function OuterTopLayer({ g, v, color }: { g: number; v: number; color: string }) {
  if (g === 0) return (  // long coat
    <g opacity={0.72}>
      <path d="M62,105 L138,105 L142,268 L58,268Z" fill={color}/>
      <path d="M62,105 L40,205 L58,210 L70,120Z" fill={color}/>
      <path d="M138,105 L160,205 L142,210 L130,120Z" fill={color}/>
      <path d="M88,105 L95,135 L100,130 L105,135 L112,105" fill="rgba(0,0,0,0.1)"/>
      <line x1={80} y1={188} x2={120} y2={188} stroke="rgba(0,0,0,0.12)" strokeWidth={2}/>
    </g>
  )
  if (g === 1) return (  // medium jacket
    <g opacity={0.74}>
      <path d="M64,105 L136,105 L138,218 L62,218Z" fill={color}/>
      <path d="M64,105 L44,180 L62,185 L72,120Z" fill={color}/>
      <path d="M136,105 L156,180 L138,185 L128,120Z" fill={color}/>
      <path d="M90,105 L96,128 L100,124 L104,128 L110,105" fill="rgba(0,0,0,0.1)"/>
    </g>
  )
  if (g === 2) return (  // short cardigan
    <g opacity={0.74}>
      <path d="M66,105 L134,105 L134,168 L66,168Z" fill={color}/>
      <path d="M66,105 L50,162 L64,165 L72,118Z" fill={color}/>
      <path d="M134,105 L150,162 L136,165 L128,118Z" fill={color}/>
      <line x1={97} y1={105} x2={95} y2={168} stroke="rgba(0,0,0,0.1)" strokeWidth={2}/>
      <line x1={103} y1={105} x2={105} y2={168} stroke="rgba(0,0,0,0.1)" strokeWidth={2}/>
    </g>
  )
  return (  // draping cape
    <g opacity={0.65}>
      <path d="M58,102 Q100,112 142,102 Q150,165 140,228 Q100,238 60,228 Q50,165 58,102Z"
        fill={color}/>
      <path d="M58,102 Q78,185 68,245" stroke="rgba(0,0,0,0.08)" strokeWidth={4} fill="none"/>
      <path d="M142,102 Q122,185 132,245" stroke="rgba(0,0,0,0.08)" strokeWidth={4} fill="none"/>
    </g>
  )
}

function LegsLayer({ g, v, color }: { g: number; v: number; color: string }) {
  if (g === 0) {  // pants
    const short = v === 2
    const bot = short ? 245 : 348
    return (
      <g opacity={0.82}>
        <path d={`M80,200 Q82,${short?218:245} 81,${bot} L90,${bot} Q92,${short?218:245} 92,200Z`} fill={color}/>
        <path d={`M108,200 Q117,${short?218:245} 118,${bot} L110,${bot} Q108,${short?218:245} 108,200Z`} fill={color}/>
      </g>
    )
  }
  if (g === 1) {  // skirt
    const long = v !== 2
    return (
      <path d={`M68,200 Q100,${long?212:208} 132,200 Q138,${long?324:285} 128,${long?344:306} Q100,${long?354:316} 72,${long?344:306} Q62,${long?324:285} 68,200Z`}
        fill={color} opacity={0.72}/>
    )
  }
  if (g === 2) {  // athletic/cargo
    return (
      <g opacity={0.82}>
        <path d="M80,200 Q82,244 81,348 L90,348 Q92,244 92,200Z" fill={color}/>
        <path d="M108,200 Q117,244 118,348 L110,348 Q108,244 108,200Z" fill={color}/>
        <rect x={82} y={248} width={8} height={12} rx={1.5} fill="rgba(0,0,0,0.12)"/>
      </g>
    )
  }
  return (  // loose homewear
    <g opacity={0.75}>
      <path d="M76,200 Q79,244 78,348 L90,348 Q92,244 92,200Z" fill={color}/>
      <path d="M108,200 Q119,244 122,348 L110,348 Q108,244 108,200Z" fill={color}/>
      <line x1={80} y1={228} x2={82} y2={342} stroke="rgba(255,255,255,0.06)" strokeWidth={1.5}/>
    </g>
  )
}

function HandsLayer({ g, color }: { g: number; color: string }) {
  if (g === 0) return (  // jewelry
    <>
      {[56,144].map((cx,i)=>(
        <circle key={i} cx={cx} cy={215} r={4} fill="none"
          stroke={color} strokeWidth={1.5} opacity={0.72}/>
      ))}
    </>
  )
  if (g === 1) return (  // watch/functional
    <>
      {[50,138].map((x,i)=>(
        <g key={i}>
          <rect x={x} y={204} width={12} height={7} rx={2} fill={color} opacity={0.72}/>
          <rect x={x+3} y={206} width={6} height={4} rx={1} fill="rgba(0,0,0,0.3)"/>
        </g>
      ))}
    </>
  )
  if (g === 2) return (  // gloves
    <>
      <path d="M50,197 Q44,215 52,227 Q58,227 62,216 Q62,197 56,195Z" fill={color} opacity={0.62}/>
      <path d="M150,197 Q156,215 148,227 Q142,227 138,216 Q138,197 144,195Z" fill={color} opacity={0.62}/>
    </>
  )
  return (  // glow/special
    <>
      {[56,144].map((cx,i)=>(
        <circle key={i} cx={cx} cy={215} r={5} fill={color} opacity={0.38}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}/>
      ))}
    </>
  )
}

function FeetLayer({ g, v, color }: { g: number; v: number; color: string }) {
  if (g === 0) return (  // sneakers
    <>
      <path d="M78,348 Q76,354 72,358 Q80,362 92,360 L92,348Z" fill={color} opacity={0.85}/>
      <path d="M122,348 Q124,354 128,358 Q120,362 108,360 L108,348Z" fill={color} opacity={0.85}/>
    </>
  )
  if (g === 1) {  // boots
    const tall = v === 0
    return (
      <>
        <path d={tall?"M80,298 Q78,347 74,358 Q82,363 90,360 L92,298Z":"M80,322 Q78,346 74,358 Q82,363 90,360 L92,322Z"}
          fill={color} opacity={0.8}/>
        <path d={tall?"M120,298 Q122,347 126,358 Q118,363 110,360 L108,298Z":"M120,322 Q122,346 126,358 Q118,363 110,360 L108,322Z"}
          fill={color} opacity={0.8}/>
      </>
    )
  }
  if (g === 2) return (  // casual
    <>
      <ellipse cx={83} cy={356} rx={14} ry={6} fill={color} opacity={0.82}/>
      <ellipse cx={117} cy={356} rx={14} ry={6} fill={color} opacity={0.82}/>
    </>
  )
  return (  // platform/special
    <>
      <path d="M76,348 Q74,354 72,360 Q80,366 92,364 L92,348Z" fill={color} opacity={0.85}/>
      <path d="M124,348 Q126,354 128,360 Q120,366 108,364 L108,348Z" fill={color} opacity={0.85}/>
      <rect x={72} y={358} width={20} height={5} rx={1} fill="rgba(0,0,0,0.22)"/>
      <rect x={108} y={358} width={20} height={5} rx={1} fill="rgba(0,0,0,0.22)"/>
    </>
  )
}

// ── State particles (high SAN) ────────────────────────────────────
function Particles({ count }: { count: number }) {
  const particles = Array.from({ length: count })
  return (
    <g>
      {particles.map((_, i) => (
        <circle key={i}
          cx={65 + (i * 37) % 70}
          cy={180 + (i * 23) % 100}
          r={1.2 + (i % 3) * 0.6}
          fill={`rgba(192,132,252,${0.35 + (i % 4) * 0.12})`}
          className="particle"
          style={{
            ['--dur' as string]: `${2.5 + (i % 5) * 0.6}s`,
            ['--delay' as string]: `${(i * 0.4) % 2.5}s`,
            ['--drift-x' as string]: `${-10 + (i * 13) % 20}px`,
          }}
        />
      ))}
    </g>
  )
}

// ── Main component ────────────────────────────────────────────────
interface Props {
  outfit: Outfit
  background: BackgroundKey
  hp: number
  ap: number
  san: number
  animate?: boolean
}

const BG_MAP: Record<BackgroundKey, () => React.ReactNode> = {
  room:       () => <BgRoom />,
  greenhouse: () => <BgGreenhouse />,
  night:      () => <BgNight />,
  library:    () => <BgLibrary />,
  balcony:    () => <BgBalcony />,
}

export function CharacterSvg({ outfit, background, hp, ap, san, animate = true }: Props) {
  const c = (slot: keyof Outfit) => SLOT_COLORS[slot][outfit[slot].colorIndex]
  const g = (slot: keyof Outfit) => cg(outfit[slot].categoryIndex)
  const v = (slot: keyof Outfit) => outfit[slot].categoryIndex % 3

  const particleCount = san > 30 ? 10 : san > 20 ? 6 : san > 12 ? 3 : 0
  const glowOpacity   = hp > 55 ? 0.25 : hp > 35 ? 0.14 : 0.05
  const energyVisible = ap > 70

  const hairLong = g('hair') >= 1
  const hairFloatClass = animate ? (hairLong ? 'hair-sway-long' : 'hair-sway') : ''

  return (
    <svg viewBox="0 0 200 380" className="w-full h-full" style={{ display: 'block' }}>
      <defs>
        <filter id="glow-warm">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <filter id="glow-elec">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      {/* ── Background ── */}
      {BG_MAP[background]?.()}

      {/* ── State glow on floor ── */}
      <ellipse cx={100} cy={358} rx={55} ry={12}
        fill={`rgba(16,185,129,${glowOpacity})`}
        style={{ filter: 'blur(8px)' }}/>

      {/* ── Character group (floating) ── */}
      <g className={animate ? 'char-float' : ''}>

        {/* ── Hair back (behind everything) ── */}
        <g className={animate ? hairFloatClass : ''}>
          <HairBack g={g('hair')} color={c('hair')}/>
        </g>

        {/* ── Legs ── */}
        <LegsLayer g={g('legs')} v={v('legs')} color={c('legs')}/>

        {/* ── Feet ── */}
        <FeetLayer g={g('feet')} v={v('feet')} color={c('feet')}/>

        {/* ── Inner top ── */}
        <InnerTopLayer g={g('innerTop')} v={v('innerTop')} color={c('innerTop')}/>

        {/* ── Outer top (over inner) ── */}
        <OuterTopLayer g={g('outerTop')} v={v('outerTop')} color={c('outerTop')}/>

        {/* ── Breathing torso group ── */}
        <g className={animate ? 'char-breathe' : ''}>

          {/* Body/skin: arms */}
          <path d="M70,105 L52,168 L64,172 L74,118Z" fill={SKIN}/>
          <path d="M130,105 L148,168 L136,172 L126,118Z" fill={SKIN}/>
          {/* Elbow shadow */}
          <ellipse cx={54} cy={170} rx={7} ry={5} fill={SKIN2} opacity={0.5}/>
          <ellipse cx={146} cy={170} rx={7} ry={5} fill={SKIN2} opacity={0.5}/>
          {/* Forearms */}
          <path d="M54,168 L56,215 L64,215 L62,170Z" fill={SKIN}/>
          <path d="M146,168 L144,215 L136,215 L138,170Z" fill={SKIN}/>
          {/* Hands */}
          <ellipse cx={58} cy={218} rx={8} ry={6} fill={SKIN}/>
          <ellipse cx={142} cy={218} rx={8} ry={6} fill={SKIN}/>

          {/* Hands layer */}
          <HandsLayer g={g('hands')} color={c('hands')}/>

          {/* Neck */}
          <rect x={93} y={88} width={14} height={18} rx={4} fill={SKIN}/>

          {/* Head */}
          <ellipse cx={100} cy={60} rx={28} ry={31} fill={SKIN}/>
          {/* Subtle face shading */}
          <ellipse cx={100} cy={68} rx={22} ry={18} fill={SKIN2} opacity={0.18}/>

          {/* AP energy eyes (high AP) */}
          {energyVisible && (
            <>
              <ellipse cx={90} cy={60} rx={3} ry={2} fill="rgba(96,165,250,0.5)"
                style={{ filter: 'drop-shadow(0 0 3px #3b82f6)' }}/>
              <ellipse cx={110} cy={60} rx={3} ry={2} fill="rgba(96,165,250,0.5)"
                style={{ filter: 'drop-shadow(0 0 3px #3b82f6)' }}/>
            </>
          )}

          {/* Face decor */}
          <FaceDecorLayer g={g('faceDecor')} v={v('faceDecor')} color={c('faceDecor')}/>

          {/* Hair front */}
          <g className={animate ? 'hair-sway' : ''}>
            <HairFront g={g('hair')} v={v('hair')} color={c('hair')}/>
          </g>

          {/* Head decor */}
          <HeadDecorLayer g={g('headDecor')} v={v('headDecor')} color={c('headDecor')}/>

        </g>{/* end breathe */}

        {/* SAN particles */}
        {particleCount > 0 && <Particles count={particleCount}/>}

      </g>{/* end float */}
    </svg>
  )
}

import { ImageResponse } from 'next/og';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';
export default function AppleIcon() { return new ImageResponse(<div style={{ width:'100%',height:'100%',background:'#173c2e',color:'#f8f6ef',display:'flex',alignItems:'center',justifyContent:'center',fontSize:130,fontFamily:'serif',border:'8px solid #a78c51',borderRadius:30 }}>B</div>,size); }

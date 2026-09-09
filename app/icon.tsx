import { ImageResponse } from 'next/og';
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';
export default function Icon() { return new ImageResponse(<div style={{ width:'100%',height:'100%',background:'#173c2e',color:'#f8f6ef',display:'flex',alignItems:'center',justifyContent:'center',fontSize:48,fontFamily:'serif',border:'3px solid #a78c51',borderRadius:12 }}>B</div>,size); }

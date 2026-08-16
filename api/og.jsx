import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#09090C',
          color: '#F5F3EE',
          fontFamily: 'Arial, sans-serif',
          padding: '68px 72px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: '-90px',
            top: '-110px',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: 'rgba(108,99,255,.18)',
            filter: 'blur(12px)',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', width: '56%', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 48 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#6C63FF',
                marginRight: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              V
            </div>
            <div style={{ fontSize: 38, fontWeight: 700 }}>VendorLair</div>
          </div>

          <div style={{ fontSize: 58, lineHeight: 1.08, fontWeight: 800, display: 'flex', flexDirection: 'column' }}>
            <span>Know every vendor.</span>
            <span>Know what needs</span>
            <span style={{ color: '#6C63FF' }}>your attention.</span>
          </div>

          <div style={{ fontSize: 25, lineHeight: 1.45, color: '#AAA9B4', marginTop: 30 }}>
            Simple vendor management for growing companies.
          </div>

          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 'auto' }}>vendorlair.com</div>
        </div>

        <div
          style={{
            width: '39%',
            marginLeft: '5%',
            alignSelf: 'center',
            height: 355,
            border: '2px solid #2D2D3A',
            borderRadius: 24,
            background: '#111118',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 2,
          }}
        >
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 18 }}>Action Centre</div>
          {[
            ['Apex Cloud', 'Renewal in 21 days', 'Review'],
            ['BrightWorks', 'Contract check', 'Due'],
            ['Northstar IT', 'Quarterly review', 'Open'],
          ].map(([name, status, tag]) => (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#181821',
                borderRadius: 14,
                padding: '14px 14px',
                marginBottom: 12,
              }}
            >
              <div style={{ width: 30, height: 30, borderRadius: 15, background: '#6C63FF', marginRight: 12 }} />
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{name}</div>
                <div style={{ fontSize: 14, color: '#AAA9B4', marginTop: 3 }}>{status}</div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#C0BCFF',
                  background: '#262350',
                  borderRadius: 9,
                  padding: '7px 9px',
                }}
              >
                {tag}
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        'Cache-Control': 'public, max-age=0, s-maxage=86400',
      },
    }
  );
}

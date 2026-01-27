'use client';

export default function PlanetGlow() {
  return (
    <>
      {/* Planet/Sphere Glow Effect */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2">
        {/* Main planet sphere with blue atmospheric glow */}
        <div
          className="relative"
          style={{
            width: 'clamp(664px, 90vw, 1440px)',
            height: 'clamp(332px, 45vw, 720px)',
          }}
        >
          {/* Central bright core */}
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 'clamp(400px, 60vw, 800px)',
              height: 'clamp(400px, 60vw, 800px)',
              background:
                'radial-gradient(circle, rgba(66, 133, 244, 0.4) 0%, rgba(66, 133, 244, 0.2) 25%, rgba(66, 133, 244, 0.1) 40%, transparent 60%)',
              filter: 'blur(40px)',
            }}
          />

          {/* Outer atmospheric glow */}
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: 'clamp(600px, 80vw, 1200px)',
              height: 'clamp(600px, 80vw, 1200px)',
              background:
                'radial-gradient(circle, rgba(66, 133, 244, 0.15) 0%, rgba(30, 94, 255, 0.08) 35%, transparent 55%)',
              filter: 'blur(60px)',
            }}
          />

          {/* Edge lighting effect */}
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 rounded-full"
            style={{
              width: 'clamp(500px, 70vw, 1000px)',
              height: 'clamp(250px, 35vw, 500px)',
              background:
                'radial-gradient(ellipse 100% 50% at 50% 0%, rgba(66, 133, 244, 0.25) 0%, rgba(30, 94, 255, 0.1) 30%, transparent 50%)',
              filter: 'blur(30px)',
            }}
          />
        </div>
      </div>

      {/* Additional ambient light overlays for depth */}
      <div className="absolute left-0 top-0 h-96 w-96 opacity-30">
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(66, 133, 244, 0.2) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="absolute right-0 top-0 h-96 w-96 opacity-30">
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(30, 94, 255, 0.2) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>
    </>
  );
}

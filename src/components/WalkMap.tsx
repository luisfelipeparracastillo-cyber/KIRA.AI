import { useEffect, useRef } from 'react';

interface Coordinate {
  lat: number;
  lng: number;
  simulated?: boolean;
}

interface WalkMapProps {
  coordinates: Coordinate[];
  isActive: boolean;
}

export default function WalkMap({ coordinates, isActive }: WalkMapProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    canvas.width = canvas.parentElement?.clientWidth || 600;
    canvas.height = 300;

    const width = canvas.width;
    const height = canvas.height;

    // Draw stylized map background (Soft Modernism styling: slate, green park, streets)
    ctx.clearRect(0, 0, width, height);

    // 1. Draw grid / grass base
    ctx.fillStyle = '#eff4ff'; // Soft cream/slate blue
    ctx.fillRect(0, 0, width, height);

    // 2. Clear park circles
    ctx.fillStyle = '#10b981/10'; // Soft Green
    ctx.beginPath();
    ctx.arc(width * 0.3, height * 0.4, 80, 0, Math.PI * 2);
    ctx.arc(width * 0.8, height * 0.7, 110, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.globalAlpha = 0.08;
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // 3. Draw simulated roads and street lines
    ctx.strokeStyle = '#bbcabf';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Horizontal street
    ctx.beginPath();
    ctx.moveTo(0, height * 0.5);
    ctx.lineTo(width, height * 0.5);
    ctx.stroke();

    // Cross streets
    ctx.beginPath();
    ctx.moveTo(width * 0.25, 0);
    ctx.lineTo(width * 0.25, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(width * 0.75, 0);
    ctx.lineTo(width * 0.75, height);
    ctx.stroke();

    // Reset stroke style
    ctx.lineWidth = 1;

    // 4. Draw street names / decals
    ctx.fillStyle = '#6c7a71';
    ctx.font = 'bold 9px Inter';
    ctx.fillText('AVENIDA DEL PARQUE', width * 0.05, height * 0.46);
    ctx.fillText('CALLE ROBLES', width * 0.27, height * 0.1);
    ctx.fillText('ZONA DE ENTRENAMIENTO', width * 0.65, height * 0.95);

    // 5. Plot Walk trace if coordinates are logged
    if (coordinates.length > 1) {
      ctx.strokeStyle = '#006c49'; // Vibrant Park Green route line
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      // Shadow glow for visual high quality
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 8;

      ctx.beginPath();
      // Map lat/long delta relatively into coordinate offsets on canvas
      const padding = 40;
      const xRange = width - padding * 2;
      const yRange = height - padding * 2;

      // Extract Bounds
      const lats = coordinates.map(c => c.lat);
      const lngs = coordinates.map(c => c.lng);
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);

      const latDiff = maxLat - minLat || 0.001;
      const lngDiff = maxLng - minLng || 0.001;

      // Draw path line
      coordinates.forEach((coord, index) => {
        const xNormalized = (coord.lng - minLng) / lngDiff;
        const yNormalized = (coord.lat - minLat) / latDiff;

        // Invert Y axes for lat limits
        const px = padding + xNormalized * xRange;
        const py = height - (padding + yNormalized * yRange);

        if (index === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      });
      ctx.stroke();

      // Reset shadow for subsequent drawings
      ctx.shadowBlur = 0;

      // Draw start point circle (amber/blue)
      const startXNorm = (coordinates[0].lng - minLng) / lngDiff;
      const startYNorm = (coordinates[0].lat - minLat) / latDiff;
      const startX = padding + startXNorm * xRange;
      const startY = height - (padding + startYNorm * yRange);

      ctx.fillStyle = '#465e8e'; // Navy
      ctx.beginPath();
      ctx.arc(startX, startY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Draw active end point (pulsing beacon)
      const lastIndex = coordinates.length - 1;
      const endXNorm = (coordinates[lastIndex].lng - minLng) / lngDiff;
      const endYNorm = (coordinates[lastIndex].lat - minLat) / latDiff;
      const endX = padding + endXNorm * xRange;
      const endY = height - (padding + endYNorm * yRange);

      // Pulse ring
      if (isActive) {
        ctx.fillStyle = '#10b981';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(endX, endY, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      ctx.fillStyle = '#ba1a1a'; // Red puppy beacon
      ctx.beginPath();
      ctx.arc(endX, endY, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

    } else {
      // Draw empty path tracking simulation notification
      ctx.fillStyle = '#465e8e';
      ctx.font = 'bold 11px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(isActive ? 'ESPERANDO SEÑAL GPS...' : 'GPS SATÉLITE LISTO', width / 2, height / 2 + 10);
    }

  }, [coordinates, isActive]);

  return (
    <div className="w-full bg-[#f8f9ff] rounded-2xl overflow-hidden border border-[#e5eeff] shadow-inner relative">
      <canvas ref={canvasRef} className="block w-full" />
      <div className="absolute bottom-3 left-3 bg-[#0b1c30]/80 rounded-lg px-2.5 py-1 text-[10px] font-black text-white uppercase tracking-wider flex items-center gap-1.5 shadow">
        <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-[#10b981] animate-ping' : 'bg-[#6c7a71]'}`} />
        Monitoreo GPS Activo
      </div>
    </div>
  );
}

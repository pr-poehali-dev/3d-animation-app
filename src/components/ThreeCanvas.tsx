import { useRef, useEffect, useState } from 'react';
import { SceneObject, TransformMode } from '@/pages/Index';

interface ThreeCanvasProps {
  objects: SceneObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string | null) => void;
  transformMode: TransformMode;
  onUpdateObject: (id: string, updates: Partial<SceneObject>) => void;
}

const ThreeCanvas = ({
  objects,
  selectedObjectId,
  onSelectObject,
  transformMode,
  onUpdateObject,
}: ThreeCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [cameraRotation, setCameraRotation] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / window.devicePixelRatio / 2;
      const centerY = canvas.height / window.devicePixelRatio / 2;

      ctx.fillStyle = '#1a2332';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const gridSize = 20;
      const gridSpacing = 30;
      ctx.strokeStyle = '#2a3442';
      ctx.lineWidth = 1;

      for (let i = -gridSize; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(centerX + i * gridSpacing, centerY - gridSize * gridSpacing);
        ctx.lineTo(centerX + i * gridSpacing, centerY + gridSize * gridSpacing);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(centerX - gridSize * gridSpacing, centerY + i * gridSpacing);
        ctx.lineTo(centerX + gridSize * gridSpacing, centerY + i * gridSpacing);
        ctx.stroke();
      }

      ctx.strokeStyle = '#0EA5E9';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, 0);
      ctx.lineTo(centerX, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(canvas.width, centerY);
      ctx.stroke();

      objects.forEach(obj => {
        const isSelected = obj.id === selectedObjectId;
        const x = centerX + obj.position[0] * 50;
        const y = centerY - obj.position[1] * 50;
        const size = 40 * obj.scale[0];

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(obj.rotation[2]);

        if (obj.type === 'box') {
          ctx.fillStyle = obj.color;
          ctx.fillRect(-size / 2, -size / 2, size, size);
          
          if (isSelected) {
            ctx.strokeStyle = '#8B5CF6';
            ctx.lineWidth = 3;
            ctx.strokeRect(-size / 2, -size / 2, size, size);
          }
          
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          ctx.strokeRect(-size / 2, -size / 2, size, size);
        } else if (obj.type === 'sphere') {
          ctx.fillStyle = obj.color;
          ctx.beginPath();
          ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
          ctx.fill();
          
          if (isSelected) {
            ctx.strokeStyle = '#8B5CF6';
            ctx.lineWidth = 3;
            ctx.stroke();
          }
          
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (obj.type === 'cylinder') {
          ctx.fillStyle = obj.color;
          ctx.fillRect(-size / 3, -size / 2, size / 1.5, size);
          
          if (isSelected) {
            ctx.strokeStyle = '#8B5CF6';
            ctx.lineWidth = 3;
            ctx.strokeRect(-size / 3, -size / 2, size / 1.5, size);
          }
          
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          ctx.strokeRect(-size / 3, -size / 2, size / 1.5, size);
        } else if (obj.type === 'robot' || obj.type === 'character' || obj.type === 'animal' || obj.type === 'vehicle') {
          ctx.fillStyle = obj.color;
          ctx.fillRect(-size / 2, -size / 2, size, size * 1.2);
          ctx.fillStyle = '#000';
          ctx.font = `${size * 0.6}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const emoji = obj.type === 'robot' ? '🤖' : obj.type === 'character' ? '🧍' : obj.type === 'animal' ? '🐕' : '🚗';
          ctx.fillText(emoji, 0, 0);
          
          if (isSelected) {
            ctx.strokeStyle = '#8B5CF6';
            ctx.lineWidth = 3;
            ctx.strokeRect(-size / 2, -size / 2, size, size * 1.2);
          }
        } else if (obj.isEffect) {
          const effectSize = size * 1.5;
          ctx.globalAlpha = 0.8;
          
          if (obj.type === 'fire') {
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, effectSize / 2);
            gradient.addColorStop(0, '#FF4500');
            gradient.addColorStop(0.5, '#FFA500');
            gradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, effectSize / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (obj.type === 'explosion') {
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, effectSize / 2);
            gradient.addColorStop(0, '#FFF');
            gradient.addColorStop(0.3, '#FFA500');
            gradient.addColorStop(0.6, '#FF4500');
            gradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, effectSize / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (obj.type === 'smoke') {
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, effectSize / 2);
            gradient.addColorStop(0, 'rgba(136, 136, 136, 0.8)');
            gradient.addColorStop(1, 'rgba(136, 136, 136, 0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, effectSize / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (obj.type === 'sparkle') {
            ctx.fillStyle = '#FFD700';
            for (let i = 0; i < 8; i++) {
              const angle = (i * Math.PI) / 4;
              ctx.fillRect(Math.cos(angle) * effectSize / 3, Math.sin(angle) * effectSize / 3, 4, 4);
            }
          } else if (obj.type === 'rain') {
            ctx.strokeStyle = '#4169E1';
            ctx.lineWidth = 2;
            for (let i = 0; i < 10; i++) {
              const rx = (Math.random() - 0.5) * effectSize;
              const ry = (Math.random() - 0.5) * effectSize;
              ctx.beginPath();
              ctx.moveTo(rx, ry);
              ctx.lineTo(rx, ry + 10);
              ctx.stroke();
            }
          }
          
          ctx.globalAlpha = 1;
          
          if (isSelected) {
            ctx.strokeStyle = '#8B5CF6';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(0, 0, effectSize / 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }

        ctx.restore();
      });
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [objects, selectedObjectId, cameraRotation]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    let clickedObjectId: string | null = null;

    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i];
      const objX = centerX + obj.position[0] * 50;
      const objY = centerY - obj.position[1] * 50;
      const size = 40 * obj.scale[0];

      if (
        x >= objX - size / 2 &&
        x <= objX + size / 2 &&
        y >= objY - size / 2 &&
        y <= objY + size / 2
      ) {
        clickedObjectId = obj.id;
        break;
      }
    }

    if (clickedObjectId) {
      onSelectObject(clickedObjectId);
      setIsDragging(true);
      setDragStart({ x, y });
    } else {
      onSelectObject(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !selectedObjectId) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const deltaX = (x - dragStart.x) / 50;
    const deltaY = -(y - dragStart.y) / 50;

    const selectedObject = objects.find(obj => obj.id === selectedObjectId);
    if (!selectedObject) return;

    if (transformMode === 'translate') {
      onUpdateObject(selectedObjectId, {
        position: [
          selectedObject.position[0] + deltaX,
          selectedObject.position[1] + deltaY,
          selectedObject.position[2],
        ],
      });
    } else if (transformMode === 'rotate') {
      onUpdateObject(selectedObjectId, {
        rotation: [
          selectedObject.rotation[0],
          selectedObject.rotation[1],
          selectedObject.rotation[2] + deltaX * 0.1,
        ],
      });
    } else if (transformMode === 'scale') {
      const scaleDelta = deltaX * 0.1;
      onUpdateObject(selectedObjectId, {
        scale: [
          Math.max(0.1, selectedObject.scale[0] + scaleDelta),
          Math.max(0.1, selectedObject.scale[1] + scaleDelta),
          Math.max(0.1, selectedObject.scale[2] + scaleDelta),
        ],
      });
    }

    setDragStart({ x, y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-crosshair"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default ThreeCanvas;
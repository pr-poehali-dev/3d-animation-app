import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { SceneObject, Keyframe } from '@/pages/Index';
import Icon from '@/components/ui/icon';

interface TimelineProps {
  currentTime: number;
  onTimeChange: (time: number) => void;
  keyframes: Keyframe[];
  objects: SceneObject[];
  isPlaying: boolean;
  onPlayToggle: () => void;
  onAddKeyframe: () => void;
}

const Timeline = ({
  currentTime,
  onTimeChange,
  keyframes,
  objects,
  isPlaying,
  onPlayToggle,
  onAddKeyframe,
}: TimelineProps) => {
  const [duration, setDuration] = useState(10);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      onTimeChange((currentTime + 0.1) % duration);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, currentTime, duration, onTimeChange]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const frames = Math.floor((time % 1) * 30);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="h-32 border-border flex flex-col">
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPlayToggle}
          className="h-8 w-8"
        >
          <Icon name={isPlaying ? 'Pause' : 'Play'} size={16} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onTimeChange(0)}
          className="h-8 w-8"
        >
          <Icon name="SkipBack" size={16} />
        </Button>

        <div className="h-6 w-px bg-border mx-1" />

        <span className="text-sm font-mono text-muted-foreground min-w-[80px]">
          {formatTime(currentTime)}
        </span>

        <div className="h-6 w-px bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onAddKeyframe}
          className="h-8"
        >
          <Icon name="Plus" size={16} className="mr-1" />
          Ключ
        </Button>

        <div className="flex-1" />

        <span className="text-xs text-muted-foreground">
          {keyframes.length} ключей
        </span>
      </div>

      <div className="flex-1 relative px-4 py-2">
        <div className="relative h-full">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full relative">
              <Slider
                value={[currentTime]}
                onValueChange={(value) => onTimeChange(value[0])}
                max={duration}
                step={0.01}
                className="w-full"
              />

              <div className="absolute top-0 left-0 right-0 h-2 flex items-center pointer-events-none">
                {keyframes.map((kf, index) => (
                  <div
                    key={index}
                    className="absolute w-2 h-2 bg-secondary rounded-full border-2 border-background"
                    style={{
                      left: `${(kf.time / duration) * 100}%`,
                      transform: 'translateX(-50%)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
            <span>0:00</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Timeline;

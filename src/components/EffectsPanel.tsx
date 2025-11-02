import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';
import { EffectType } from '@/pages/Index';

interface EffectsPanelProps {
  onAddEffect: (type: EffectType, duration: number) => void;
}

interface EffectAsset {
  type: EffectType;
  name: string;
  description: string;
  icon: string;
  preview: string;
  defaultDuration: number;
  color: string;
}

const effects: EffectAsset[] = [
  {
    type: 'fire',
    name: 'Огонь',
    description: 'Пламя с частицами',
    icon: 'Flame',
    preview: '🔥',
    defaultDuration: 3,
    color: '#FF4500',
  },
  {
    type: 'explosion',
    name: 'Взрыв',
    description: 'Быстрый взрыв с волной',
    icon: 'Zap',
    preview: '💥',
    defaultDuration: 1.5,
    color: '#FFA500',
  },
  {
    type: 'smoke',
    name: 'Дым',
    description: 'Поднимающийся дым',
    icon: 'Cloud',
    preview: '💨',
    defaultDuration: 4,
    color: '#888888',
  },
  {
    type: 'sparkle',
    name: 'Искры',
    description: 'Блестящие частицы',
    icon: 'Sparkles',
    preview: '✨',
    defaultDuration: 2,
    color: '#FFD700',
  },
  {
    type: 'rain',
    name: 'Дождь',
    description: 'Падающие капли',
    icon: 'CloudRain',
    preview: '🌧️',
    defaultDuration: 5,
    color: '#4169E1',
  },
];

const EffectsPanel = ({ onAddEffect }: EffectsPanelProps) => {
  const [duration, setDuration] = useState(2);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold flex items-center gap-2">
          <Icon name="Sparkles" size={18} />
          Эффекты
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Временные эффекты с автоматическим исчезновением
        </p>
      </div>

      <div className="p-4 border-b border-border space-y-3">
        <div>
          <Label className="text-sm">
            Длительность: {duration.toFixed(1)}с
          </Label>
          <Slider
            value={[duration]}
            onValueChange={(val) => setDuration(val[0])}
            min={0.5}
            max={10}
            step={0.5}
            className="mt-2"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {effects.map((effect) => (
            <Card
              key={effect.type}
              className="p-4 border-border hover:border-primary/50 transition-colors cursor-pointer group"
              onClick={() => onAddEffect(effect.type, duration)}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${effect.color}20` }}
                >
                  {effect.preview}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{effect.name}</h4>
                    <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-600 text-xs rounded">
                      {effect.defaultDuration}с
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {effect.description}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddEffect(effect.type, duration);
                  }}
                >
                  <Icon name="Plus" size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={16} className="mt-0.5 text-primary" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Особенности эффектов:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Автоматически исчезают через заданное время</li>
                <li>Можно анимировать до исчезновения</li>
                <li>Добавляйте в нужный момент времени</li>
                <li>Настройте длительность перед добавлением</li>
              </ul>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default EffectsPanel;

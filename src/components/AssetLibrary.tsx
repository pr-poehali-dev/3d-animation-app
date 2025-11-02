import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';
import { ModelType } from '@/pages/Index';

interface AssetLibraryProps {
  onAddModel: (type: ModelType, name: string) => void;
}

interface ModelAsset {
  type: ModelType;
  name: string;
  description: string;
  icon: string;
  hasBones: boolean;
  preview: string;
}

const models: ModelAsset[] = [
  {
    type: 'robot',
    name: 'Робот-гуманоид',
    description: 'Скелет: голова, туловище, руки, ноги',
    icon: 'Bot',
    hasBones: true,
    preview: '🤖',
  },
  {
    type: 'character',
    name: 'Персонаж',
    description: 'Полный скелет для анимации',
    icon: 'User',
    hasBones: true,
    preview: '🧍',
  },
  {
    type: 'animal',
    name: 'Животное',
    description: 'Скелет: голова, тело, 4 лапы, хвост',
    icon: 'Dog',
    hasBones: true,
    preview: '🐕',
  },
  {
    type: 'vehicle',
    name: 'Транспорт',
    description: 'Колёса, двери, подвижные части',
    icon: 'Car',
    hasBones: true,
    preview: '🚗',
  },
];

const AssetLibrary = ({ onAddModel }: AssetLibraryProps) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold flex items-center gap-2">
          <Icon name="Package" size={18} />
          Библиотека моделей
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Готовые модели с костями для анимации
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {models.map((model) => (
            <Card
              key={model.type}
              className="p-4 border-border hover:border-primary/50 transition-colors cursor-pointer group"
              onClick={() => onAddModel(model.type, model.name)}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {model.preview}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{model.name}</h4>
                    {model.hasBones && (
                      <span className="px-1.5 py-0.5 bg-green-500/10 text-green-600 text-xs rounded">
                        Кости
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {model.description}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddModel(model.type, model.name);
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
              <p className="font-medium text-foreground mb-1">Как использовать:</p>
              <ol className="space-y-1 list-decimal list-inside">
                <li>Нажмите на модель чтобы добавить</li>
                <li>Выберите кость в списке объектов</li>
                <li>Создайте ключевые кадры (К)</li>
                <li>Анимируйте движение костей</li>
              </ol>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AssetLibrary;

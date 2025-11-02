import { Button } from '@/components/ui/button';
import { SceneObject } from '@/pages/Index';
import Icon from '@/components/ui/icon';

interface ObjectsListProps {
  objects: SceneObject[];
  selectedObjectId: string | null;
  onSelectObject: (id: string) => void;
  onDeleteObject: (id: string) => void;
}

const ObjectsList = ({
  objects,
  selectedObjectId,
  onSelectObject,
  onDeleteObject,
}: ObjectsListProps) => {
  if (objects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Icon name="Box" size={48} className="mb-4 opacity-50" />
        <p className="text-center">Нет объектов</p>
        <p className="text-sm text-center mt-2">Добавьте примитивы с панели слева</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {objects.map(obj => (
        <div
          key={obj.id}
          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
            selectedObjectId === obj.id
              ? 'bg-primary/10 border-primary'
              : 'bg-card border-border hover:bg-muted'
          }`}
          onClick={() => onSelectObject(obj.id)}
        >
          <div
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ backgroundColor: obj.color }}
          >
            {obj.type === 'box' && <Icon name="Box" size={16} className="text-white" />}
            {obj.type === 'sphere' && <Icon name="Circle" size={16} className="text-white" />}
            {obj.type === 'cylinder' && <Icon name="Cylinder" size={16} className="text-white" />}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{obj.name}</p>
            <p className="text-xs text-muted-foreground">
              {obj.type.charAt(0).toUpperCase() + obj.type.slice(1)}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteObject(obj.id);
            }}
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default ObjectsList;

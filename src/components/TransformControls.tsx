import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { SceneObject } from '@/pages/Index';
import { Separator } from '@/components/ui/separator';

interface TransformControlsProps {
  object: SceneObject;
  onUpdate: (updates: Partial<SceneObject>) => void;
}

const TransformControls = ({ object, onUpdate }: TransformControlsProps) => {
  const handlePositionChange = (index: number, value: string) => {
    const newPosition = [...object.position] as [number, number, number];
    newPosition[index] = parseFloat(value) || 0;
    onUpdate({ position: newPosition });
  };

  const handleRotationChange = (index: number, value: string) => {
    const newRotation = [...object.rotation] as [number, number, number];
    newRotation[index] = parseFloat(value) || 0;
    onUpdate({ rotation: newRotation });
  };

  const handleScaleChange = (index: number, value: string) => {
    const newScale = [...object.scale] as [number, number, number];
    newScale[index] = Math.max(0.1, parseFloat(value) || 1);
    onUpdate({ scale: newScale });
  };

  const handleColorChange = (value: string) => {
    onUpdate({ color: value });
  };

  const handleNameChange = (value: string) => {
    onUpdate({ name: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="name" className="text-sm font-medium">
          Название
        </Label>
        <Input
          id="name"
          value={object.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className="mt-2"
        />
      </div>

      <Separator />

      <div>
        <Label className="text-sm font-medium mb-3 block">Позиция</Label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label htmlFor="pos-x" className="text-xs text-muted-foreground">
              X
            </Label>
            <Input
              id="pos-x"
              type="number"
              step="0.1"
              value={object.position[0].toFixed(2)}
              onChange={(e) => handlePositionChange(0, e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="pos-y" className="text-xs text-muted-foreground">
              Y
            </Label>
            <Input
              id="pos-y"
              type="number"
              step="0.1"
              value={object.position[1].toFixed(2)}
              onChange={(e) => handlePositionChange(1, e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="pos-z" className="text-xs text-muted-foreground">
              Z
            </Label>
            <Input
              id="pos-z"
              type="number"
              step="0.1"
              value={object.position[2].toFixed(2)}
              onChange={(e) => handlePositionChange(2, e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Вращение</Label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label htmlFor="rot-x" className="text-xs text-muted-foreground">
              X
            </Label>
            <Input
              id="rot-x"
              type="number"
              step="0.1"
              value={object.rotation[0].toFixed(2)}
              onChange={(e) => handleRotationChange(0, e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="rot-y" className="text-xs text-muted-foreground">
              Y
            </Label>
            <Input
              id="rot-y"
              type="number"
              step="0.1"
              value={object.rotation[1].toFixed(2)}
              onChange={(e) => handleRotationChange(1, e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="rot-z" className="text-xs text-muted-foreground">
              Z
            </Label>
            <Input
              id="rot-z"
              type="number"
              step="0.1"
              value={object.rotation[2].toFixed(2)}
              onChange={(e) => handleRotationChange(2, e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">Масштаб</Label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label htmlFor="scale-x" className="text-xs text-muted-foreground">
              X
            </Label>
            <Input
              id="scale-x"
              type="number"
              step="0.1"
              min="0.1"
              value={object.scale[0].toFixed(2)}
              onChange={(e) => handleScaleChange(0, e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="scale-y" className="text-xs text-muted-foreground">
              Y
            </Label>
            <Input
              id="scale-y"
              type="number"
              step="0.1"
              min="0.1"
              value={object.scale[1].toFixed(2)}
              onChange={(e) => handleScaleChange(1, e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="scale-z" className="text-xs text-muted-foreground">
              Z
            </Label>
            <Input
              id="scale-z"
              type="number"
              step="0.1"
              min="0.1"
              value={object.scale[2].toFixed(2)}
              onChange={(e) => handleScaleChange(2, e.target.value)}
              className="mt-1"
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <Label htmlFor="color" className="text-sm font-medium">
          Цвет
        </Label>
        <div className="flex gap-2 mt-2">
          <Input
            id="color"
            type="color"
            value={object.color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-16 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={object.color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default TransformControls;

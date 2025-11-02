import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import ThreeCanvas from '@/components/ThreeCanvas';
import Timeline from '@/components/Timeline';
import ObjectsList from '@/components/ObjectsList';
import TransformControls from '@/components/TransformControls';

export type PrimitiveType = 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus';
export type TransformMode = 'translate' | 'rotate' | 'scale';

export interface SceneObject {
  id: string;
  type: PrimitiveType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  name: string;
}

export interface Keyframe {
  time: number;
  objectId: string;
  property: 'position' | 'rotation' | 'scale';
  value: [number, number, number];
}

const Index = () => {
  const [objects, setObjects] = useState<SceneObject[]>([]);
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [transformMode, setTransformMode] = useState<TransformMode>('translate');
  const [currentTime, setCurrentTime] = useState(0);
  const [keyframes, setKeyframes] = useState<Keyframe[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const addObject = (type: PrimitiveType) => {
    const newObject: SceneObject = {
      id: `obj-${Date.now()}`,
      type,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#0EA5E9',
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${objects.length + 1}`,
    };
    setObjects([...objects, newObject]);
    setSelectedObjectId(newObject.id);
  };

  const updateObject = (id: string, updates: Partial<SceneObject>) => {
    setObjects(objects.map(obj => obj.id === id ? { ...obj, ...updates } : obj));
  };

  const deleteObject = (id: string) => {
    setObjects(objects.filter(obj => obj.id !== id));
    if (selectedObjectId === id) {
      setSelectedObjectId(null);
    }
  };

  const addKeyframe = () => {
    if (!selectedObjectId) return;
    
    const selectedObject = objects.find(obj => obj.id === selectedObjectId);
    if (!selectedObject) return;

    const newKeyframe: Keyframe = {
      time: currentTime,
      objectId: selectedObjectId,
      property: transformMode === 'translate' ? 'position' : transformMode === 'rotate' ? 'rotation' : 'scale',
      value: selectedObject[transformMode === 'translate' ? 'position' : transformMode === 'rotate' ? 'rotation' : 'scale'],
    };

    setKeyframes([...keyframes, newKeyframe]);
  };

  const selectedObject = objects.find(obj => obj.id === selectedObjectId);

  return (
    <div className="h-screen w-screen bg-background flex flex-col overflow-hidden">
      <header className="h-14 border-b border-border bg-card px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Box" size={20} className="text-primary-foreground" />
            </div>
            <h1 className="text-xl font-semibold">3D Animator</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Icon name="Settings" size={20} />
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <Card className="w-16 m-2 p-2 flex flex-col gap-2 border-border">
          <Button
            variant={transformMode === 'translate' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setTransformMode('translate')}
            title="Переместить"
          >
            <Icon name="Move" size={20} />
          </Button>
          <Button
            variant={transformMode === 'rotate' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setTransformMode('rotate')}
            title="Вращать"
          >
            <Icon name="RotateCw" size={20} />
          </Button>
          <Button
            variant={transformMode === 'scale' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setTransformMode('scale')}
            title="Масштаб"
          >
            <Icon name="Maximize" size={20} />
          </Button>

          <div className="h-px bg-border my-2" />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => addObject('box')}
            title="Куб"
          >
            <Icon name="Box" size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => addObject('sphere')}
            title="Сфера"
          >
            <Icon name="Circle" size={20} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => addObject('cylinder')}
            title="Цилиндр"
          >
            <Icon name="Cylinder" size={20} />
          </Button>
        </Card>

        <div className="flex-1 flex flex-col m-2 gap-2">
          <Card className="flex-1 border-border overflow-hidden relative">
            <ThreeCanvas
              objects={objects}
              selectedObjectId={selectedObjectId}
              onSelectObject={setSelectedObjectId}
              transformMode={transformMode}
              onUpdateObject={updateObject}
            />
          </Card>

          <Timeline
            currentTime={currentTime}
            onTimeChange={setCurrentTime}
            keyframes={keyframes}
            objects={objects}
            isPlaying={isPlaying}
            onPlayToggle={() => setIsPlaying(!isPlaying)}
            onAddKeyframe={addKeyframe}
          />
        </div>

        <Card className="w-80 m-2 border-border overflow-hidden">
          <Tabs defaultValue="objects" className="h-full flex flex-col">
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger value="objects" className="flex-1">
                <Icon name="Layers" size={16} className="mr-2" />
                Объекты
              </TabsTrigger>
              <TabsTrigger value="properties" className="flex-1">
                <Icon name="Sliders" size={16} className="mr-2" />
                Свойства
              </TabsTrigger>
            </TabsList>

            <TabsContent value="objects" className="flex-1 p-4 overflow-auto">
              <ObjectsList
                objects={objects}
                selectedObjectId={selectedObjectId}
                onSelectObject={setSelectedObjectId}
                onDeleteObject={deleteObject}
              />
            </TabsContent>

            <TabsContent value="properties" className="flex-1 p-4 overflow-auto">
              {selectedObject ? (
                <TransformControls
                  object={selectedObject}
                  onUpdate={(updates) => updateObject(selectedObject.id, updates)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <Icon name="MousePointer" size={48} className="mb-4 opacity-50" />
                  <p>Выберите объект</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Index;

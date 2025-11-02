import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import ThreeScene from '@/components/ThreeScene';
import Timeline from '@/components/Timeline';
import ObjectsList from '@/components/ObjectsList';
import TransformControls from '@/components/TransformControls';
import AssetLibrary from '@/components/AssetLibrary';
import EffectsPanel from '@/components/EffectsPanel';
import ExportPanel from '@/components/ExportPanel';

export type PrimitiveType = 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus';
export type ModelType = 'robot' | 'character' | 'animal' | 'vehicle';
export type EffectType = 'fire' | 'explosion' | 'smoke' | 'sparkle' | 'rain';
export type TransformMode = 'translate' | 'rotate' | 'scale';

export interface SceneObject {
  id: string;
  type: PrimitiveType | ModelType | EffectType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  name: string;
  isEffect?: boolean;
  effectDuration?: number;
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

  useEffect(() => {
    if (!isPlaying) return;

    const fps = 60;
    const interval = setInterval(() => {
      setCurrentTime((prevTime) => {
        const newTime = prevTime + (1 / fps);
        return newTime;
      });
    }, 1000 / fps);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (keyframes.length === 0 || !isPlaying) return;

    const updatedObjects = objects.map(obj => {
      const objKeyframes = keyframes
        .filter(kf => kf.objectId === obj.id)
        .sort((a, b) => a.time - b.time);

      if (objKeyframes.length === 0) return obj;

      const positionKfs = objKeyframes.filter(kf => kf.property === 'position');
      const rotationKfs = objKeyframes.filter(kf => kf.property === 'rotation');
      const scaleKfs = objKeyframes.filter(kf => kf.property === 'scale');

      const interpolate = (kfs: Keyframe[], property: 'position' | 'rotation' | 'scale') => {
        if (kfs.length === 0) return obj[property];

        const beforeKf = kfs.filter(kf => kf.time <= currentTime).pop();
        const afterKf = kfs.find(kf => kf.time > currentTime);

        if (!beforeKf) return kfs[0].value;
        if (!afterKf) return beforeKf.value;

        const progress = (currentTime - beforeKf.time) / (afterKf.time - beforeKf.time);
        return [
          beforeKf.value[0] + (afterKf.value[0] - beforeKf.value[0]) * progress,
          beforeKf.value[1] + (afterKf.value[1] - beforeKf.value[1]) * progress,
          beforeKf.value[2] + (afterKf.value[2] - beforeKf.value[2]) * progress,
        ] as [number, number, number];
      };

      return {
        ...obj,
        position: interpolate(positionKfs, 'position'),
        rotation: interpolate(rotationKfs, 'rotation'),
        scale: interpolate(scaleKfs, 'scale'),
      };
    });

    setObjects(updatedObjects);
  }, [currentTime, keyframes, isPlaying]);

  const addObject = (type: PrimitiveType | ModelType, name?: string) => {
    const newObject: SceneObject = {
      id: `obj-${Date.now()}`,
      type,
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: '#0EA5E9',
      name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} ${objects.length + 1}`,
    };
    setObjects([...objects, newObject]);
    setSelectedObjectId(newObject.id);
  };

  const addEffect = (type: EffectType, duration: number = 2) => {
    const newEffect: SceneObject = {
      id: `effect-${Date.now()}`,
      type,
      position: [0, 1, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: type === 'fire' ? '#FF4500' : type === 'explosion' ? '#FFA500' : '#888888',
      name: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      isEffect: true,
      effectDuration: duration,
    };
    
    setObjects([...objects, newEffect]);
    setSelectedObjectId(newEffect.id);

    setTimeout(() => {
      setObjects(prev => prev.filter(obj => obj.id !== newEffect.id));
      if (selectedObjectId === newEffect.id) {
        setSelectedObjectId(null);
      }
    }, duration * 1000);
  };

  const updateObject = (id: string, updates: Partial<SceneObject>) => {
    setObjects(objects.map(obj => obj.id === id ? { ...obj, ...updates } : obj));
  };

  const deleteObject = (id: string) => {
    setObjects(objects.filter(obj => obj.id !== id));
    setKeyframes(keyframes.filter(kf => kf.objectId !== id));
    if (selectedObjectId === id) {
      setSelectedObjectId(null);
    }
  };

  const addKeyframe = () => {
    if (!selectedObjectId) return;
    
    const selectedObject = objects.find(obj => obj.id === selectedObjectId);
    if (!selectedObject) return;

    const properties: ('position' | 'rotation' | 'scale')[] = ['position', 'rotation', 'scale'];
    
    const newKeyframes = properties.map(property => ({
      time: currentTime,
      objectId: selectedObjectId,
      property,
      value: [...selectedObject[property]] as [number, number, number],
    }));

    setKeyframes([...keyframes, ...newKeyframes]);
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
            <h1 className="text-xl font-semibold">3D Animator Pro</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Icon name="Download" size={16} className="mr-2" />
                Экспорт
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <ExportPanel objects={objects} keyframes={keyframes} duration={10} />
            </DialogContent>
          </Dialog>
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
            title="Переместить (G)"
          >
            <Icon name="Move" size={20} />
          </Button>
          <Button
            variant={transformMode === 'rotate' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setTransformMode('rotate')}
            title="Вращать (R)"
          >
            <Icon name="RotateCw" size={20} />
          </Button>
          <Button
            variant={transformMode === 'scale' ? 'default' : 'ghost'}
            size="icon"
            onClick={() => setTransformMode('scale')}
            title="Масштаб (S)"
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
            <ThreeScene
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
            isPlaying={isPlaying}
            onPlayToggle={() => setIsPlaying(!isPlaying)}
            onAddKeyframe={addKeyframe}
          />
        </div>

        <Card className="w-80 m-2 border-border overflow-hidden">
          <Tabs defaultValue="objects" className="h-full flex flex-col">
            <TabsList className="w-full rounded-none border-b grid grid-cols-4">
              <TabsTrigger value="objects">
                <Icon name="Layers" size={16} />
              </TabsTrigger>
              <TabsTrigger value="properties">
                <Icon name="Sliders" size={16} />
              </TabsTrigger>
              <TabsTrigger value="library">
                <Icon name="Package" size={16} />
              </TabsTrigger>
              <TabsTrigger value="effects">
                <Icon name="Sparkles" size={16} />
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

            <TabsContent value="library" className="flex-1 overflow-auto">
              <AssetLibrary onAddModel={addObject} />
            </TabsContent>

            <TabsContent value="effects" className="flex-1 overflow-auto">
              <EffectsPanel onAddEffect={addEffect} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Index;
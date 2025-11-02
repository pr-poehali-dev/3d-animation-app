import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { SceneObject, Keyframe } from '@/pages/Index';

interface ExportPanelProps {
  objects: SceneObject[];
  keyframes: Keyframe[];
  duration: number;
}

const ExportPanel = ({ objects, keyframes, duration }: ExportPanelProps) => {
  const [exportFormat, setExportFormat] = useState<'mp4' | 'gif' | 'json'>('mp4');
  const [fps, setFps] = useState(30);
  const [resolution, setResolution] = useState('1920x1080');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportJSON = () => {
    const exportData = {
      version: '1.0',
      duration,
      objects: objects.map(obj => ({
        ...obj,
        id: obj.id,
      })),
      keyframes: keyframes,
      metadata: {
        fps,
        resolution,
        createdAt: new Date().toISOString(),
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `animation-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportVideo = async () => {
    setIsExporting(true);

    try {
      const sceneData = {
        objects,
        keyframes,
        duration,
        fps,
        resolution,
      };

      const dataStr = JSON.stringify(sceneData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `animation-project-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('Проект сохранён! В будущем здесь будет экспорт видео через серверный рендеринг.');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Ошибка экспорта. Попробуйте ещё раз.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportGIF = async () => {
    setIsExporting(true);

    try {
      handleExportJSON();
      alert('GIF экспорт в разработке. Пока сохранён JSON проекта.');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Ошибка экспорта.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = () => {
    if (exportFormat === 'json') {
      handleExportJSON();
    } else if (exportFormat === 'mp4') {
      handleExportVideo();
    } else if (exportFormat === 'gif') {
      handleExportGIF();
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div>
        <h3 className="font-semibold flex items-center gap-2 mb-3">
          <Icon name="Download" size={18} />
          Экспорт анимации
        </h3>
      </div>

      <Separator />

      <div className="space-y-3">
        <div>
          <Label className="text-sm mb-2 block">Формат</Label>
          <Select value={exportFormat} onValueChange={(v) => setExportFormat(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">
                <div className="flex items-center gap-2">
                  <Icon name="FileJson" size={16} />
                  JSON (проект)
                </div>
              </SelectItem>
              <SelectItem value="mp4">
                <div className="flex items-center gap-2">
                  <Icon name="Video" size={16} />
                  MP4 (видео)
                </div>
              </SelectItem>
              <SelectItem value="gif">
                <div className="flex items-center gap-2">
                  <Icon name="Image" size={16} />
                  GIF (анимация)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {exportFormat !== 'json' && (
          <>
            <div>
              <Label className="text-sm mb-2 block">Разрешение</Label>
              <Select value={resolution} onValueChange={setResolution}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                  <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                  <SelectItem value="854x480">854x480 (SD)</SelectItem>
                  <SelectItem value="640x360">640x360 (Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm mb-2 block">FPS: {fps}</Label>
              <Input
                type="number"
                value={fps}
                onChange={(e) => setFps(parseInt(e.target.value) || 30)}
                min={1}
                max={60}
              />
            </div>
          </>
        )}

        <div className="pt-2">
          <div className="text-xs text-muted-foreground space-y-1 mb-3">
            <div className="flex justify-between">
              <span>Объектов:</span>
              <span className="font-medium">{objects.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Ключевых кадров:</span>
              <span className="font-medium">{keyframes.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Длительность:</span>
              <span className="font-medium">{duration.toFixed(1)}с</span>
            </div>
          </div>

          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full"
            size="lg"
          >
            {isExporting ? (
              <>
                <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                Экспорт...
              </>
            ) : (
              <>
                <Icon name="Download" size={18} className="mr-2" />
                Экспортировать
              </>
            )}
          </Button>
        </div>
      </div>

      <Separator />

      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <Icon name="Info" size={16} className="mt-0.5 text-primary" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Форматы экспорта:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li><strong>JSON</strong> — сохранение проекта</li>
              <li><strong>MP4</strong> — видео файл (в разработке)</li>
              <li><strong>GIF</strong> — анимированная картинка (в разработке)</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExportPanel;

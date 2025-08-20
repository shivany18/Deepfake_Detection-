import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, Shield, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DetectionResult {
  authentic: boolean;
  confidence: number;
  details: {
    faces: number;
    manipulations: string[];
    aiGenerated: boolean;
  };
}

export const ImageDetector = () => {
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp']
    },
    multiple: false
  });

  const analyzeImage = async () => {
    if (!selectedFile) return;
    
    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResult: DetectionResult = {
        authentic: Math.random() > 0.3,
        confidence: Math.round((Math.random() * 30 + 70) * 100) / 100,
        details: {
          faces: Math.floor(Math.random() * 3),
          manipulations: Math.random() > 0.5 ? ['Face swap detected', 'Pixel inconsistencies'] : [],
          aiGenerated: Math.random() > 0.6
        }
      };
      
      setResult(mockResult);
      setAnalyzing(false);
      
      toast({
        title: mockResult.authentic ? "Image appears authentic" : "Potential manipulation detected",
        description: `Analysis complete with ${mockResult.confidence}% confidence`,
        variant: mockResult.authentic ? "default" : "destructive"
      });
    }, 3000);
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-sm shadow-card border-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Image Authenticity Detection</h3>
            <p className="text-muted-foreground">Upload an image to analyze for deepfakes and manipulations</p>
          </div>
        </div>

        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? 'border-primary bg-primary/5 scale-105' 
              : 'border-border hover:border-primary/50 hover:bg-muted/50'
          }`}
        >
          <input {...getInputProps()} />
          
          {preview ? (
            <div className="space-y-4">
              <div className="relative mx-auto max-w-md">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-64 object-cover rounded-lg shadow-soft"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearImage();
                  }}
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedFile?.name} ({(selectedFile?.size || 0 / 1024 / 1024).toFixed(1)} MB)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">
                  {isDragActive ? "Drop the image here" : "Drop an image here, or click to select"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports JPG, PNG, GIF up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>

        {selectedFile && !analyzing && !result && (
          <Button 
            onClick={analyzeImage} 
            className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300"
          >
            Analyze Image
          </Button>
        )}

        {analyzing && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-muted border-t-primary rounded-full" />
              <span className="text-muted-foreground">Analyzing image authenticity...</span>
            </div>
            <Progress value={33} className="animate-pulse" />
          </div>
        )}

        {result && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {result.authentic ? (
                  <CheckCircle className="h-6 w-6 text-success" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-warning" />
                )}
                <div>
                  <h4 className="font-semibold">
                    {result.authentic ? "Likely Authentic" : "Potential Manipulation"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {result.confidence}% confidence
                  </p>
                </div>
              </div>
              <Badge variant={result.authentic ? "default" : "destructive"}>
                {result.authentic ? "Authentic" : "Suspicious"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="font-semibold text-lg">{result.details.faces}</div>
                <div className="text-muted-foreground">Faces Detected</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="font-semibold text-lg">{result.details.manipulations.length}</div>
                <div className="text-muted-foreground">Issues Found</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="font-semibold text-lg">{result.details.aiGenerated ? "Yes" : "No"}</div>
                <div className="text-muted-foreground">AI Generated</div>
              </div>
            </div>

            {result.details.manipulations.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium">Detected Issues:</h5>
                <ul className="space-y-1">
                  {result.details.manipulations.map((issue, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
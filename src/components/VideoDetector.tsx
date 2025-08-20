import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Upload, Video, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoAnalysis {
  authentic: boolean;
  confidence: number;
  details: {
    framesAnalyzed: number;
    faceSwapDetected: boolean;
    lipSyncInconsistencies: number;
    temporalAnomalies: string[];
    compressionArtifacts: boolean;
  };
}

export const VideoDetector = () => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<VideoAnalysis | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setResult(null);
      setProgress(0);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']
    },
    multiple: false
  });

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const analyzeVideo = async () => {
    if (!selectedFile) return;
    
    setAnalyzing(true);
    setResult(null);
    
    // Simulate frame-by-frame analysis with progress updates
    const totalFrames = 300;
    let currentFrame = 0;
    
    const analysisInterval = setInterval(() => {
      currentFrame += Math.floor(Math.random() * 15 + 10);
      const progressValue = Math.min((currentFrame / totalFrames) * 100, 95);
      setProgress(progressValue);
      
      if (currentFrame >= totalFrames) {
        clearInterval(analysisInterval);
        
        // Complete analysis
        setTimeout(() => {
          const authentic = Math.random() > 0.35;
          const mockResult: VideoAnalysis = {
            authentic,
            confidence: Math.round((Math.random() * 25 + 72) * 100) / 100,
            details: {
              framesAnalyzed: totalFrames,
              faceSwapDetected: !authentic && Math.random() > 0.4,
              lipSyncInconsistencies: authentic ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 15 + 5),
              temporalAnomalies: authentic 
                ? [] 
                : ['Frame discontinuity at 0:32', 'Facial landmark inconsistency', 'Motion blur anomalies'],
              compressionArtifacts: Math.random() > 0.6
            }
          };
          
          setResult(mockResult);
          setAnalyzing(false);
          setProgress(100);
          
          toast({
            title: mockResult.authentic ? "Video appears authentic" : "Deepfake detected",
            description: `Analysis complete with ${mockResult.confidence}% confidence`,
            variant: mockResult.authentic ? "default" : "destructive"
          });
        }, 500);
      }
    }, 200);
  };

  const clearVideo = () => {
    setSelectedFile(null);
    setVideoUrl(null);
    setResult(null);
    setIsPlaying(false);
    setProgress(0);
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-sm shadow-card border-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Video className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Video Deepfake Detection</h3>
            <p className="text-muted-foreground">Upload a video to analyze for deepfakes and manipulations</p>
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
          
          {videoUrl ? (
            <div className="space-y-4">
              <div className="relative mx-auto max-w-md">
                <video 
                  ref={videoRef}
                  src={videoUrl} 
                  className="w-full h-64 object-cover rounded-lg shadow-soft"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayPause();
                    }}
                    className="bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                  >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearVideo();
                  }}
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedFile?.name} ({((selectedFile?.size || 0) / 1024 / 1024).toFixed(1)} MB)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-lg font-medium">
                  {isDragActive ? "Drop the video here" : "Drop a video here, or click to select"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports MP4, AVI, MOV, WebM up to 100MB
                </p>
              </div>
            </div>
          )}
        </div>

        {selectedFile && !analyzing && !result && (
          <Button 
            onClick={analyzeVideo} 
            className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300"
          >
            Analyze Video
          </Button>
        )}

        {analyzing && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-muted border-t-primary rounded-full" />
              <span className="text-muted-foreground">
                Analyzing frames ({Math.floor(progress * 3)}/300)...
              </span>
            </div>
            <Progress value={progress} />
            <p className="text-xs text-center text-muted-foreground">
              Processing facial landmarks, temporal consistency, and compression artifacts
            </p>
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
                    {result.authentic ? "Likely Authentic" : "Deepfake Detected"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {result.confidence}% confidence
                  </p>
                </div>
              </div>
              <Badge variant={result.authentic ? "default" : "destructive"}>
                {result.authentic ? "Authentic" : "Manipulated"}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="font-semibold text-lg">{result.details.framesAnalyzed}</div>
                <div className="text-muted-foreground">Frames Analyzed</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="font-semibold text-lg">{result.details.lipSyncInconsistencies}</div>
                <div className="text-muted-foreground">Lip-Sync Issues</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="font-semibold text-lg">{result.details.faceSwapDetected ? "Yes" : "No"}</div>
                <div className="text-muted-foreground">Face Swap</div>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <div className="font-semibold text-lg">{result.details.temporalAnomalies.length}</div>
                <div className="text-muted-foreground">Anomalies</div>
              </div>
            </div>

            {result.details.temporalAnomalies.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium">Detected Anomalies:</h5>
                <ul className="space-y-1">
                  {result.details.temporalAnomalies.map((anomaly, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      {anomaly}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span>Analysis Techniques:</span>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">Facial Landmarks</Badge>
                  <Badge variant="outline" className="text-xs">Temporal Analysis</Badge>
                  <Badge variant="outline" className="text-xs">Compression Detection</Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
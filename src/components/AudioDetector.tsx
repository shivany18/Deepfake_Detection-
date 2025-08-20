import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Upload, Mic, AlertTriangle, CheckCircle, X, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AudioAnalysis {
  authentic: boolean;
  confidence: number;
  details: {
    voicePrint: string;
    spectralAnalysis: number;
    prosodyScore: number;
    artificialMarkers: string[];
    duration: number;
    sampleRate: number;
  };
}

export const AudioDetector = () => {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AudioAnalysis | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setResult(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.aac', '.ogg', '.flac']
    },
    multiple: false
  });

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const analyzeAudio = async () => {
    if (!selectedFile) return;
    
    setAnalyzing(true);
    setResult(null);
    
    // Simulate audio analysis
    setTimeout(() => {
      const authentic = Math.random() > 0.3;
      const mockResult: AudioAnalysis = {
        authentic,
        confidence: Math.round((Math.random() * 30 + 70) * 100) / 100,
        details: {
          voicePrint: authentic ? "Natural human voice patterns" : "Synthetic voice characteristics detected",
          spectralAnalysis: Math.round((Math.random() * 30 + (authentic ? 85 : 45)) * 100) / 100,
          prosodyScore: Math.round((Math.random() * 20 + (authentic ? 80 : 40)) * 100) / 100,
          artificialMarkers: authentic 
            ? [] 
            : ['Unnatural pitch variations', 'Robotic prosody', 'Frequency artifacts'],
          duration: duration || Math.random() * 120 + 30,
          sampleRate: 44100
        }
      };
      
      setResult(mockResult);
      setAnalyzing(false);
      
      toast({
        title: mockResult.authentic ? "Audio appears authentic" : "Synthetic audio detected",
        description: `Analysis complete with ${mockResult.confidence}% confidence`,
        variant: mockResult.authentic ? "default" : "destructive"
      });
    }, 3500);
  };

  const clearAudio = () => {
    setSelectedFile(null);
    setAudioUrl(null);
    setResult(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-sm shadow-card border-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Mic className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Audio Deepfake Detection</h3>
            <p className="text-muted-foreground">Upload audio to detect synthetic speech and voice cloning</p>
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
          
          {audioUrl ? (
            <div className="space-y-4">
              <div className="relative mx-auto max-w-md p-6 bg-gradient-glass rounded-lg">
                <audio 
                  ref={audioRef}
                  src={audioUrl}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  className="hidden"
                />
                
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlayPause();
                    }}
                    className="bg-primary/10 hover:bg-primary/20 text-primary"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Audio Preview</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-100"
                        style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAudio();
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
                  {isDragActive ? "Drop the audio here" : "Drop an audio file here, or click to select"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports MP3, WAV, M4A, AAC up to 50MB
                </p>
              </div>
            </div>
          )}
        </div>

        {selectedFile && !analyzing && !result && (
          <Button 
            onClick={analyzeAudio} 
            className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300"
          >
            Analyze Audio
          </Button>
        )}

        {analyzing && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-muted border-t-primary rounded-full" />
              <span className="text-muted-foreground">Analyzing voice patterns and spectral data...</span>
            </div>
            <Progress value={65} className="animate-pulse" />
            <p className="text-xs text-center text-muted-foreground">
              Processing prosody, spectral analysis, and voice print matching
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
                    {result.authentic ? "Likely Human Voice" : "Synthetic Audio Detected"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {result.confidence}% confidence
                  </p>
                </div>
              </div>
              <Badge variant={result.authentic ? "default" : "destructive"}>
                {result.authentic ? "Authentic" : "Synthetic"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h5 className="font-medium">Technical Analysis</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Spectral Quality</span>
                    <span className="font-semibold">{result.details.spectralAnalysis}%</span>
                  </div>
                  <Progress value={result.details.spectralAnalysis} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Prosody Score</span>
                    <span className="font-semibold">{result.details.prosodyScore}%</span>
                  </div>
                  <Progress value={result.details.prosodyScore} className="h-2" />
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-medium">Audio Properties</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Duration</span>
                    <span>{formatTime(result.details.duration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sample Rate</span>
                    <span>{result.details.sampleRate} Hz</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Voice Print</span>
                    <Badge variant="outline" className="text-xs">
                      {result.authentic ? "Human" : "Synthetic"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border">
              <p className="text-sm font-medium mb-2">Voice Analysis:</p>
              <p className="text-sm text-muted-foreground">{result.details.voicePrint}</p>
            </div>

            {result.details.artificialMarkers.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium">Detected Artificial Markers:</h5>
                <ul className="space-y-1">
                  {result.details.artificialMarkers.map((marker, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      {marker}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span>Detection Methods:</span>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">Voice Print</Badge>
                  <Badge variant="outline" className="text-xs">Spectral Analysis</Badge>
                  <Badge variant="outline" className="text-xs">Prosody</Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
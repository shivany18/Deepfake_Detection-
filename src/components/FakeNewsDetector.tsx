import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Shield, AlertTriangle, CheckCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewsAnalysis {
  credible: boolean;
  confidence: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  details: {
    sourceReliability: number;
    factualConsistency: number;
    languagePatterns: string[];
    similarSources: string[];
  };
}

export const FakeNewsDetector = () => {
  const { toast } = useToast();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<NewsAnalysis | null>(null);
  const [inputText, setInputText] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');

  const analyzeText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to analyze",
        variant: "destructive"
      });
      return;
    }
    
    setAnalyzing(true);
    setResult(null);
    
    // Simulate AI analysis
    setTimeout(() => {
      const credible = Math.random() > 0.4;
      const mockResult: NewsAnalysis = {
        credible,
        confidence: Math.round((Math.random() * 25 + 70) * 100) / 100,
        sentiment: ['positive', 'negative', 'neutral'][Math.floor(Math.random() * 3)] as 'positive' | 'negative' | 'neutral',
        details: {
          sourceReliability: Math.round((Math.random() * 40 + 60) * 100) / 100,
          factualConsistency: Math.round((Math.random() * 40 + 60) * 100) / 100,
          languagePatterns: credible 
            ? ['Professional tone', 'Factual language', 'Balanced perspective']
            : ['Emotional language', 'Sensational claims', 'Lack of sources'],
          similarSources: ['Reuters', 'BBC News', 'Associated Press', 'CNN', 'NPR']
        }
      };
      
      setResult(mockResult);
      setAnalyzing(false);
      
      toast({
        title: mockResult.credible ? "Content appears credible" : "Potential misinformation detected",
        description: `Analysis complete with ${mockResult.confidence}% confidence`,
        variant: mockResult.credible ? "default" : "destructive"
      });
    }, 2500);
  };

  const clearText = () => {
    setInputText('');
    setSourceUrl('');
    setResult(null);
  };

  return (
    <Card className="p-6 bg-gradient-card backdrop-blur-sm shadow-card border-0">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Fake News Detection</h3>
            <p className="text-muted-foreground">Analyze text content for misinformation and credibility</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source-url">Source URL (optional)</Label>
            <Input
              id="source-url"
              placeholder="https://example.com/news-article"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="news-text">News Content</Label>
            <Textarea
              id="news-text"
              placeholder="Paste the news article content here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-32 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{inputText.length} characters</span>
              {inputText.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearText}
                  className="h-auto p-0 text-muted-foreground hover:text-foreground"
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>

        {inputText.trim() && !analyzing && !result && (
          <Button 
            onClick={analyzeText} 
            className="w-full bg-gradient-primary text-primary-foreground hover:shadow-glow transition-all duration-300"
          >
            Analyze Content
          </Button>
        )}

        {analyzing && (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-muted border-t-primary rounded-full" />
              <span className="text-muted-foreground">Analyzing content credibility...</span>
            </div>
            <Progress value={45} className="animate-pulse" />
          </div>
        )}

        {result && (
          <div className="space-y-4 p-4 bg-muted/50 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {result.credible ? (
                  <CheckCircle className="h-6 w-6 text-success" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-warning" />
                )}
                <div>
                  <h4 className="font-semibold">
                    {result.credible ? "Likely Credible" : "Potentially Misleading"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {result.confidence}% confidence • {result.sentiment} sentiment
                  </p>
                </div>
              </div>
              <Badge variant={result.credible ? "default" : "destructive"}>
                {result.credible ? "Credible" : "Suspicious"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h5 className="font-medium">Source Analysis</h5>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Source Reliability</span>
                    <span className="font-semibold">{result.details.sourceReliability}%</span>
                  </div>
                  <Progress value={result.details.sourceReliability} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>Factual Consistency</span>
                    <span className="font-semibold">{result.details.factualConsistency}%</span>
                  </div>
                  <Progress value={result.details.factualConsistency} className="h-2" />
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-medium">Language Patterns</h5>
                <div className="space-y-1">
                  {result.details.languagePatterns.map((pattern, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className={`h-2 w-2 rounded-full ${
                        result.credible ? 'bg-success' : 'bg-warning'
                      }`} />
                      {pattern}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {sourceUrl && (
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium">Source</h5>
                  <Button variant="outline" size="sm" asChild>
                    <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Source
                    </a>
                  </Button>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-border">
              <h5 className="font-medium mb-2">Cross-reference with trusted sources:</h5>
              <div className="flex flex-wrap gap-2">
                {result.details.similarSources.map((source, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {source}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
import { ImageDetector } from '@/components/ImageDetector';
import { FakeNewsDetector } from '@/components/FakeNewsDetector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Zap, Users, CheckCircle } from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="relative py-20 px-4 overflow-hidden bg-gradient-hero"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(33, 150, 243, 0.9), rgba(0, 150, 136, 0.9)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto text-center relative z-10">
          <Badge variant="outline" className="mb-6 bg-white/10 text-white border-white/20 hover:bg-white/20">
            <Shield className="h-4 w-4 mr-2" />
            Advanced AI Detection
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Authenticity
            <span className="block bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
              Guardian
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Detect deepfakes, manipulated images, and misinformation with cutting-edge AI technology. 
            Protect truth in the digital age.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-glow transition-all duration-300"
            >
              <Zap className="h-5 w-5 mr-2" />
              Start Analysis
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300"
            >
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-pulse">
          <div className="w-3 h-3 bg-white/20 rounded-full"></div>
        </div>
        <div className="absolute bottom-32 right-20 animate-pulse delay-1000">
          <div className="w-2 h-2 bg-white/30 rounded-full"></div>
        </div>
        <div className="absolute top-40 right-32 animate-pulse delay-500">
          <div className="w-4 h-4 bg-white/15 rounded-full"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">99.2%</div>
              <div className="text-muted-foreground">Detection Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">50M+</div>
              <div className="text-muted-foreground">Images Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-success mb-2">24/7</div>
              <div className="text-muted-foreground">Real-time Protection</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Detection Tools */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Advanced Detection Tools
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered tools analyze content across multiple dimensions to detect manipulation and misinformation
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ImageDetector />
            <FakeNewsDetector />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Authenticity Guardian?
            </h2>
            <p className="text-xl text-muted-foreground">
              Cutting-edge technology meets user-friendly design
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 bg-gradient-card backdrop-blur-sm shadow-card border-0 hover:shadow-glow transition-all duration-300">
              <div className="text-center">
                <div className="p-3 bg-gradient-primary rounded-full w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Advanced AI</h3>
                <p className="text-muted-foreground">
                  State-of-the-art machine learning models trained on millions of authentic and manipulated samples
                </p>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-card backdrop-blur-sm shadow-card border-0 hover:shadow-glow transition-all duration-300">
              <div className="text-center">
                <div className="p-3 bg-gradient-primary rounded-full w-fit mx-auto mb-4">
                  <Zap className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Get results in seconds with our optimized processing pipeline and edge computing infrastructure
                </p>
              </div>
            </Card>
            
            <Card className="p-6 bg-gradient-card backdrop-blur-sm shadow-card border-0 hover:shadow-glow transition-all duration-300">
              <div className="text-center">
                <div className="p-3 bg-gradient-primary rounded-full w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Trusted by Experts</h3>
                <p className="text-muted-foreground">
                  Used by journalists, researchers, and fact-checkers worldwide to verify content authenticity
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Current Capabilities */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              Complete Solution
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Complete Authenticity Suite
            </h2>
            <p className="text-xl text-muted-foreground">
              Beyond image and news detection - comprehensive media verification
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-glass backdrop-blur-sm">
              <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Image Detection</h4>
                <p className="text-sm text-muted-foreground">
                  Advanced deepfake and manipulation detection for photos and images
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-glass backdrop-blur-sm">
              <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Fake News Detection</h4>
                <p className="text-sm text-muted-foreground">
                  Natural language processing to identify misinformation and bias
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-glass backdrop-blur-sm">
              <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Video Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Your existing video detection capabilities for deepfake videos
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gradient-glass backdrop-blur-sm">
              <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold mb-1">Audio Verification</h4>
                <p className="text-sm text-muted-foreground">
                  Your existing audio detection for synthetic voice and manipulated audio
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border bg-muted/20">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Authenticity Guardian</span>
          </div>
          <p className="text-muted-foreground">
            Protecting truth in the digital age with advanced AI detection technology
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
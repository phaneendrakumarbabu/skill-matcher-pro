import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Upload, Sparkles, Briefcase, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { sampleResumeText, jobRoles, analyzeResume, skillsByRole } from '@/lib/resumeData';
import { extractTextFromPDF } from '@/lib/pdfParser';
import { analyzeResumeWithAI, isAIConfigured } from '@/lib/aiService';
import { testEnvironment } from '@/lib/testEnv';
import { historyService } from '@/lib/historyService';
import { firestoreService } from '@/lib/firestoreService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import * as Icons from 'lucide-react';

// Test environment on component load
testEnvironment();

export default function Analyzer() {
  const [resumeText, setResumeText] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const loadSample = () => {
    setResumeText(sampleResumeText);
    toast({
      title: 'Sample Resume Loaded',
      description: 'You can now select a job role and analyze!',
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'application/pdf') {
      setIsParsing(true);
      try {
        const text = await extractTextFromPDF(file);
        setResumeText(text);
        toast({
          title: 'PDF Parsed Successfully',
          description: `Extracted ${text.length} characters from your resume.`,
        });
      } catch (error) {
        console.error('PDF parsing error:', error);
        toast({
          title: 'PDF Parsing Failed',
          description: 'Could not extract text from PDF. Please try pasting the text manually.',
          variant: 'destructive',
        });
      } finally {
        setIsParsing(false);
      }
      return;
    }

    const text = await file.text();
    setResumeText(text);
    toast({
      title: 'File Loaded',
      description: 'Resume text has been loaded successfully.',
    });
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast({
        title: 'Resume Required',
        description: 'Please paste or upload your resume first.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedRole) {
      toast({
        title: 'Job Role Required',
        description: 'Please select a target job role.',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Wrap everything in a try-catch to ensure we always navigate
    const performAnalysis = async () => {
      try {
        const roleName = jobRoles.find(r => r.id === selectedRole)?.name || '';
        const requiredSkills = skillsByRole[selectedRole] || [];
        
        let results;
        
        // Try AI analysis first if configured
        if (isAIConfigured()) {
          try {
            console.log('Starting AI analysis...');
            const aiResults = await analyzeResumeWithAI(resumeText, selectedRole, roleName, requiredSkills);
            results = {
              ...aiResults,
              isAIPowered: true,
            };
            
            toast({
              title: 'AI Analysis Complete',
              description: 'Your resume has been analyzed using advanced AI.',
            });
          } catch (error: any) {
            console.error('AI analysis failed, falling back to basic analysis:', error);
            
            // Check if it's a quota error
            const isQuotaError = error?.message?.includes('quota') || error?.message?.includes('429');
            
            results = {
              ...analyzeResume(resumeText, selectedRole),
              isAIPowered: false,
            };
            
            toast({
              title: 'Using Basic Analysis',
              description: isQuotaError 
                ? 'OpenAI API quota exceeded. Using keyword matching instead.'
                : 'AI analysis unavailable. Using keyword matching.',
            });
          }
        } else {
          // Fallback to basic analysis
          console.log('AI not configured, using basic analysis');
          results = {
            ...analyzeResume(resumeText, selectedRole),
            isAIPowered: false,
          };
          
          toast({
            title: 'Using Basic Analysis',
            description: 'AI analysis unavailable. Using keyword matching.',
          });
        }
        
        // Store results in sessionStorage
        sessionStorage.setItem('analysisResults', JSON.stringify({
          ...results,
          roleName,
          analyzedAt: new Date().toISOString(),
        }));
        
        // Save to history (localStorage for non-logged in users)
        historyService.saveAnalysis(roleName, selectedRole, results, 'My Resume');
        
        // Save to Firestore if user is logged in (don't wait for it)
        if (currentUser) {
          firestoreService.saveAnalysis(
            currentUser.uid,
            roleName,
            selectedRole,
            results,
            'My Resume'
          ).catch(error => {
            console.error('Error saving to Firestore:', error);
            // Continue anyway - localStorage backup exists
          });
        }
        
        return true;
      } catch (error) {
        console.error('Analysis error:', error);
        toast({
          title: 'Analysis Failed',
          description: 'An error occurred during analysis. Please try again.',
          variant: 'destructive',
        });
        return false;
      }
    };
    
    // Perform analysis and navigate regardless of outcome
    const success = await performAnalysis();
    
    if (success) {
      console.log('Analysis complete, navigating to results...');
      navigate('/results');
    } else {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Resume <span className="gradient-text">Analyzer</span>
          </h1>
          <p className="text-muted-foreground">
            Paste your resume and select a job role to get instant skill matching analysis
          </p>
        </motion.div>

        <div className="grid gap-6">
          {/* Resume Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold">Your Resume</h2>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={loadSample} className="gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Load Sample
                </Button>
                <label>
                  <Button variant="outline" size="sm" asChild className="gap-1.5 cursor-pointer" disabled={isParsing}>
                    <span>
                      {isParsing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {isParsing ? 'Parsing...' : 'Upload PDF'}
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept=".txt,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isParsing}
                  />
                </label>
              </div>
            </div>
            
            <Textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="min-h-[250px] bg-background/50 border-border/50 resize-none"
            />
            
            <p className="text-xs text-muted-foreground mt-2">
              {resumeText.length} characters • Tip: Include skills, experience, and education
            </p>
          </motion.div>

          {/* Job Role Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Target Job Role</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {jobRoles.map((role) => {
                const IconComponent = Icons[role.icon as keyof typeof Icons] as Icons.LucideIcon;
                const isSelected = selectedRole === role.id;
                
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border/50 hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/20' : 'bg-muted'}`}>
                        <IconComponent className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <span className={`font-medium text-sm ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {role.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Analyze Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText.trim() || !selectedRole}
              className="w-full h-14 text-lg gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              {isAnalyzing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Analyzing...
                </>
              ) : (
                <>
                  Analyze Resume
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

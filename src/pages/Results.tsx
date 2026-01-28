import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Target, 
  FileCheck, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  ArrowLeft,
  RotateCcw,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ProgressBar';
import { SkillTag } from '@/components/SkillTag';
import { ScoreCard } from '@/components/ScoreCard';
import { AnalysisResult } from '@/lib/resumeData';

interface StoredResults extends AnalysisResult {
  roleName: string;
  analyzedAt: string;
  detailedFeedback?: string;
  isAIPowered?: boolean;
}

export default function Results() {
  const [results, setResults] = useState<StoredResults | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem('analysisResults');
    if (stored) {
      setResults(JSON.parse(stored));
    }
  }, []);

  if (!results) {
    return (
      <div className="min-h-screen mesh-bg pt-24 pb-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-8 text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <FileCheck className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Analysis Results</h2>
          <p className="text-muted-foreground mb-6">
            Analyze a resume first to see your results here.
          </p>
          <Link to="/analyzer">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go to Analyzer
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mesh-bg pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">
                Analysis <span className="gradient-text">Results</span>
              </h1>
              {results.isAIPowered && (
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  AI-Powered
                </span>
              )}
            </div>
            <p className="text-muted-foreground">
              Target Role: <span className="font-medium text-foreground">{results.roleName}</span>
            </p>
          </div>
          <div className="flex gap-3">
            <Link to="/dashboard">
              <Button variant="outline" className="gap-2">
                <FileCheck className="w-4 h-4" />
                View Dashboard
              </Button>
            </Link>
            <Link to="/analyzer">
              <Button variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                New Analysis
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Score Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <ScoreCard
            title="Skill Match"
            value={`${results.matchPercentage}%`}
            subtitle={results.matchPercentage >= 75 ? 'Excellent match!' : results.matchPercentage >= 50 ? 'Good match' : 'Needs improvement'}
            icon={Target}
            delay={0.1}
          />
          <ScoreCard
            title="ATS Score"
            value={`${results.atsScore}/100`}
            subtitle="Resume optimization"
            icon={FileCheck}
            delay={0.2}
          />
          <ScoreCard
            title="Matched Skills"
            value={results.matchedSkills.length}
            subtitle="Skills found"
            icon={CheckCircle2}
            delay={0.3}
          />
          <ScoreCard
            title="Missing Skills"
            value={results.missingSkills.length}
            subtitle="Skills to add"
            icon={XCircle}
            delay={0.4}
          />
        </div>

        {/* Progress Bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 mb-6"
        >
          <h2 className="text-lg font-semibold mb-6">Score Overview</h2>
          <div className="space-y-6">
            <ProgressBar value={results.matchPercentage} label="Skill Match Score" size="lg" />
            <ProgressBar value={results.atsScore} label="ATS Compatibility Score" size="lg" />
          </div>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Matched Skills */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <h2 className="text-lg font-semibold">Matched Skills</h2>
              <span className="ml-auto text-sm text-muted-foreground">
                {results.matchedSkills.length} found
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {results.matchedSkills.length > 0 ? (
                results.matchedSkills.map((skill, index) => (
                  <SkillTag key={skill} skill={skill} matched index={index} />
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No matching skills found</p>
              )}
            </div>
          </motion.div>

          {/* Missing Skills */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-destructive" />
              <h2 className="text-lg font-semibold">Missing Skills</h2>
              <span className="ml-auto text-sm text-muted-foreground">
                {results.missingSkills.length} to add
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {results.missingSkills.length > 0 ? (
                results.missingSkills.map((skill, index) => (
                  <SkillTag key={skill} skill={skill} matched={false} index={index} />
                ))
              ) : (
                <p className="text-success text-sm">Perfect! You have all required skills!</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold">Improvement Suggestions</h2>
          </div>
          <ul className="space-y-3">
            {results.suggestions.map((suggestion, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-muted/50"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                  {index + 1}
                </span>
                <span className="text-sm text-foreground">{suggestion}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* AI Detailed Feedback */}
        {results.detailedFeedback && results.isAIPowered && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">AI Detailed Analysis</h2>
            </div>
            <div className="prose prose-sm max-w-none text-foreground/90">
              {results.detailedFeedback.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-3 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

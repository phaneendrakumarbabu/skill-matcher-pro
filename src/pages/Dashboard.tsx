import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  FileText, 
  Target, 
  Download, 
  Trash2, 
  BarChart3,
  Calendar,
  Award,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { historyService, AnalysisHistory } from '@/lib/historyService';
import { exportAnalysisToPDF, exportComparisonToPDF } from '@/lib/pdfExport';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [stats, setStats] = useState(historyService.getStats());
  const [chartData, setChartData] = useState(historyService.getChartData());
  const [selectedAnalyses, setSelectedAnalyses] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = historyService.getHistory();
    setHistory(data);
    setStats(historyService.getStats());
    setChartData(historyService.getChartData());
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this analysis?')) {
      historyService.deleteAnalysis(id);
      loadData();
      setSelectedAnalyses(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      historyService.clearHistory();
      loadData();
      setSelectedAnalyses(new Set());
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedAnalyses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleExportSelected = () => {
    const selected = history.filter(item => selectedAnalyses.has(item.id));
    if (selected.length === 0) {
      alert('Please select at least one analysis to export');
      return;
    }
    
    if (selected.length === 1) {
      exportAnalysisToPDF(selected[0]);
    } else {
      exportComparisonToPDF(selected);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 75) return 'bg-green-500/10';
    if (score >= 50) return 'bg-yellow-500/10';
    return 'bg-red-500/10';
  };

  return (
    <div className="min-h-screen mesh-bg pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            Your <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-muted-foreground">
            Track your resume improvement journey
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAnalyses}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Resume scans completed
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Skill Match</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getScoreColor(stats.averageScore)}`}>
                  {stats.averageScore}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all analyses
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg ATS Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getScoreColor(stats.averageATS)}`}>
                  {stats.averageATS}/100
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Resume optimization
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Improvement</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stats.improvement >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats.improvement >= 0 ? '+' : ''}{stats.improvement}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Recent vs older analyses
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Chart */}
        {chartData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Score Trends</CardTitle>
                <CardDescription>Track your improvement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      dataKey="date" 
                      className="text-xs"
                      tick={{ fill: 'currentColor' }}
                    />
                    <YAxis 
                      className="text-xs"
                      tick={{ fill: 'currentColor' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="skillMatch" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Skill Match %"
                      dot={{ fill: 'hsl(var(--primary))' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="atsScore" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      name="ATS Score"
                      dot={{ fill: 'hsl(var(--accent))' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Actions Bar */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-3 mb-6"
          >
            <Button
              onClick={handleExportSelected}
              disabled={selectedAnalyses.size === 0}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export Selected ({selectedAnalyses.size})
            </Button>
            
            <Button
              onClick={handleClearAll}
              variant="destructive"
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear All History
            </Button>

            <Button
              onClick={loadData}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </motion.div>
        )}

        {/* History List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
              <CardDescription>
                {history.length === 0 
                  ? 'No analyses yet. Start by analyzing your resume!' 
                  : `${history.length} analysis${history.length > 1 ? 'es' : ''} saved`
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start analyzing your resume to see your progress here
                  </p>
                  <Link to="/analyzer">
                    <Button className="gap-2">
                      Analyze Resume
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        selectedAnalyses.has(item.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedAnalyses.has(item.id)}
                          onChange={() => toggleSelection(item.id)}
                          className="mt-1 h-4 w-4 rounded border-gray-300"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-lg">{item.roleName}</h4>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(item.timestamp).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                {item.results.isAIPowered && (
                                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                    AI-Powered
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => exportAnalysisToPDF(item)}
                                className="gap-1"
                              >
                                <Download className="w-3 h-3" />
                                PDF
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDelete(item.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                            <div className={`p-3 rounded-lg ${getScoreBgColor(item.results.matchPercentage)}`}>
                              <div className="text-xs text-muted-foreground mb-1">Skill Match</div>
                              <div className={`text-xl font-bold ${getScoreColor(item.results.matchPercentage)}`}>
                                {item.results.matchPercentage}%
                              </div>
                            </div>

                            <div className={`p-3 rounded-lg ${getScoreBgColor(item.results.atsScore)}`}>
                              <div className="text-xs text-muted-foreground mb-1">ATS Score</div>
                              <div className={`text-xl font-bold ${getScoreColor(item.results.atsScore)}`}>
                                {item.results.atsScore}/100
                              </div>
                            </div>

                            <div className="p-3 rounded-lg bg-green-500/10">
                              <div className="text-xs text-muted-foreground mb-1">Matched</div>
                              <div className="text-xl font-bold text-green-500">
                                {item.results.matchedSkills.length}
                              </div>
                            </div>

                            <div className="p-3 rounded-lg bg-red-500/10">
                              <div className="text-xs text-muted-foreground mb-1">Missing</div>
                              <div className="text-xl font-bold text-red-500">
                                {item.results.missingSkills.length}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

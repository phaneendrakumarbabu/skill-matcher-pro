import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AnalysisHistory } from './historyService';

export function exportAnalysisToPDF(analysis: AnalysisHistory) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header with gradient effect (simulated with colors)
  doc.setFillColor(99, 102, 241); // Primary color
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Logo/Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('ResumeAI Pro', 20, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('AI-Powered Resume Analysis Report', 20, 30);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Analysis Info
  let yPos = 55;
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Analysis Date: ${new Date(analysis.timestamp).toLocaleString()}`, 20, yPos);
  yPos += 7;
  doc.text(`Resume: ${analysis.resumeName}`, 20, yPos);
  yPos += 7;
  doc.text(`Target Role: ${analysis.roleName}`, 20, yPos);
  
  // Scores Section
  yPos += 15;
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Analysis Scores', 20, yPos);
  
  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Score boxes
  const boxWidth = 80;
  const boxHeight = 25;
  const boxSpacing = 10;
  
  // Skill Match Score Box
  doc.setFillColor(240, 240, 255);
  doc.roundedRect(20, yPos, boxWidth, boxHeight, 3, 3, 'F');
  doc.setTextColor(99, 102, 241);
  doc.setFontSize(10);
  doc.text('Skill Match Score', 25, yPos + 8);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`${analysis.results.matchPercentage}%`, 25, yPos + 20);
  
  // ATS Score Box
  doc.setFillColor(240, 255, 240);
  doc.roundedRect(20 + boxWidth + boxSpacing, yPos, boxWidth, boxHeight, 3, 3, 'F');
  doc.setTextColor(34, 197, 94);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('ATS Score', 25 + boxWidth + boxSpacing, yPos + 8);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`${analysis.results.atsScore}/100`, 25 + boxWidth + boxSpacing, yPos + 20);
  
  yPos += boxHeight + 15;
  
  // Matched Skills Section
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Matched Skills', 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  if (analysis.results.matchedSkills.length > 0) {
    const skillsText = analysis.results.matchedSkills.join(', ');
    const splitSkills = doc.splitTextToSize(skillsText, pageWidth - 40);
    doc.text(splitSkills, 20, yPos);
    yPos += splitSkills.length * 5 + 10;
  } else {
    doc.text('No matching skills found', 20, yPos);
    yPos += 10;
  }
  
  // Missing Skills Section
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Missing Skills', 20, yPos);
  
  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  
  if (analysis.results.missingSkills.length > 0) {
    const missingText = analysis.results.missingSkills.join(', ');
    const splitMissing = doc.splitTextToSize(missingText, pageWidth - 40);
    doc.text(splitMissing, 20, yPos);
    yPos += splitMissing.length * 5 + 10;
  } else {
    doc.text('All required skills found!', 20, yPos);
    yPos += 10;
  }
  
  // Check if we need a new page
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }
  
  // Suggestions Section
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text('Improvement Suggestions', 20, yPos);
  
  yPos += 10;
  
  // Use autoTable for suggestions
  const suggestionsData = analysis.results.suggestions.map((suggestion, index) => [
    `${index + 1}`,
    suggestion
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Suggestion']],
    body: suggestionsData,
    theme: 'striped',
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 'auto' }
    },
    margin: { left: 20, right: 20 }
  });
  
  // AI Detailed Feedback (if available)
  if (analysis.results.detailedFeedback && analysis.results.isAIPowered) {
    const finalY = (doc as any).lastAutoTable.finalY || yPos + 50;
    
    if (finalY > 250) {
      doc.addPage();
      yPos = 20;
    } else {
      yPos = finalY + 15;
    }
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('AI Detailed Analysis', 20, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    
    const feedbackLines = doc.splitTextToSize(analysis.results.detailedFeedback, pageWidth - 40);
    doc.text(feedbackLines, 20, yPos);
  }
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated by ResumeAI Pro | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  const fileName = `ResumeAnalysis_${analysis.roleName}_${new Date(analysis.timestamp).toLocaleDateString()}.pdf`;
  doc.save(fileName);
}

export function exportComparisonToPDF(analyses: AnalysisHistory[]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('ResumeAI Pro', 20, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Resume Comparison Report', 20, 30);
  
  // Comparison Table
  let yPos = 55;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Analysis Comparison', 20, yPos);
  
  yPos += 10;
  
  const comparisonData = analyses.map(analysis => [
    new Date(analysis.timestamp).toLocaleDateString(),
    analysis.roleName,
    `${analysis.results.matchPercentage}%`,
    `${analysis.results.atsScore}/100`,
    analysis.results.matchedSkills.length.toString(),
    analysis.results.missingSkills.length.toString()
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Role', 'Skill Match', 'ATS Score', 'Matched', 'Missing']],
    body: comparisonData,
    theme: 'striped',
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    margin: { left: 20, right: 20 }
  });
  
  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Generated by ResumeAI Pro | Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  doc.save(`ResumeComparison_${new Date().toLocaleDateString()}.pdf`);
}

import OpenAI from 'openai';

// Lazy initialization - only create client when needed
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    openaiClient = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Note: In production, use a backend proxy
    });
  }
  return openaiClient;
}

export interface AIAnalysisResult {
  matchPercentage: number;
  atsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  detailedFeedback: string;
}

export async function analyzeResumeWithAI(
  resumeText: string,
  roleId: string,
  roleName: string,
  requiredSkills: string[]
): Promise<AIAnalysisResult> {
  console.log('🤖 Starting AI analysis for role:', roleName);
  
  try {
    const openai = getOpenAIClient();
    console.log('✅ OpenAI client created successfully');
    
    const prompt = `You are an expert resume analyzer and career coach. Analyze the following resume for a ${roleName} position.

Resume:
${resumeText}

Required Skills for ${roleName}:
${requiredSkills.join(', ')}

Please provide a detailed analysis in the following JSON format:
{
  "matchPercentage": <number 0-100>,
  "atsScore": <number 0-100>,
  "matchedSkills": [<array of skills found in resume from the required list>],
  "missingSkills": [<array of skills not found in resume from the required list>],
  "suggestions": [<array of 5 specific, actionable suggestions to improve the resume>],
  "detailedFeedback": "<2-3 paragraph detailed analysis of strengths and areas for improvement>"
}

Important:
- Be thorough in identifying skills, including variations and related technologies
- Consider context and experience level when matching skills
- Provide specific, actionable suggestions
- ATS score should consider formatting, keywords, and structure
- Match percentage should reflect how well the candidate fits the role`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume analyzer. Always respond with valid JSON only, no additional text.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    console.log('✅ Received AI response');

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from AI');
    }

    const result = JSON.parse(content);
    console.log('✅ AI analysis complete:', { matchPercentage: result.matchPercentage, atsScore: result.atsScore });
    return result as AIAnalysisResult;
  } catch (error: any) {
    console.error('❌ AI Analysis Error:', error);
    
    // Check for specific error types
    if (error?.status === 429) {
      throw new Error('OpenAI API quota exceeded. Please check your billing details or try again later.');
    } else if (error?.status === 401) {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    } else if (error?.message?.includes('quota')) {
      throw new Error('OpenAI API quota exceeded. Using basic analysis instead.');
    }
    
    throw new Error('Failed to analyze resume with AI. Please try again.');
  }
}

export function isAIConfigured(): boolean {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const isConfigured = !!apiKey && apiKey.length > 20;
  console.log('AI Configuration Check:', {
    hasApiKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    keyPrefix: apiKey?.substring(0, 15) || 'none',
    isConfigured: isConfigured
  });
  return isConfigured;
}

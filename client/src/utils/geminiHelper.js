// utils/geminiHelper.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with direct API key
const genAI = new GoogleGenerativeAI('AIzaSyDYe7EF3a4dLBgvyKnwud82I8EPQ4QOzhU');

/**
 * Extract text from PDF file using FileReader
 */
const extractTextFromPDF = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        // For demo purposes, we'll simulate PDF text extraction
        // In production, you'd use a proper PDF parsing library like pdf-parse or PDF.js
        const arrayBuffer = e.target.result;
        const text = `PDF Content Extracted from: ${file.name}
        
This is a placeholder for actual PDF text extraction. 
In a real implementation, you would use a library like:
- pdf-parse (Node.js)
- PDF.js (Browser)
- pdfjs-dist

File name: ${file.name}
File size: ${file.size} bytes
File type: ${file.type}

Sample extracted content for demonstration:
- Current waste collection efficiency: 85%
- Monthly budget utilization: $45,000
- Equipment maintenance issues: 3 critical items
- Staff productivity metrics showing improvement
- Public complaint resolution rate: 92%
- Recycling program participation increased by 15%
        `;
        resolve(text);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Generate report summary using Gemini 2.0 with structured output
 */
export const generateReportFromPDF = async (file, department = 'General') => {
  try {
    // Extract text from PDF
    const pdfText = await extractTextFromPDF(file);
    
    // Get the Gemini 2.0 model
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });
    
    // Create prompt for structured report generation
    const prompt = `
    You are an AI assistant analyzing reports for a ${department} department. Create a comprehensive, well-structured report summary.
    
    Document Content:
    ${pdfText}
    
    Please provide a structured analysis in the following format:
    
    ## 📋 EXECUTIVE SUMMARY
    [2-3 sentence overview of the main findings]
    
    ## 🔍 KEY FINDINGS
    • [Finding 1 with specific data/metrics]
    • [Finding 2 with specific data/metrics]
    • [Finding 3 with specific data/metrics]
    • [Finding 4 with specific data/metrics]
    • [Finding 5 with specific data/metrics]
    
    ## 📊 CRITICAL METRICS
    • Performance Rate: [X%]
    • Budget Utilization: [Amount/Percentage]
    • Issue Resolution: [X cases/percentage]
    • Resource Efficiency: [Metric]
    • Timeline Adherence: [Percentage]
    
    ## ⚠️ AREAS OF CONCERN
    • [Concern 1 - with severity level]
    • [Concern 2 - with severity level]
    • [Concern 3 - with severity level]
    
    ## 💡 RECOMMENDATIONS
    1. **Immediate Actions (1-7 days)**
       • [Action item with timeline]
       • [Action item with timeline]
    
    2. **Short-term Goals (1-4 weeks)**
       • [Goal with expected outcome]
       • [Goal with expected outcome]
    
    3. **Long-term Strategy (1-6 months)**
       • [Strategic initiative]
       • [Strategic initiative]
    
    ## 📈 SUCCESS INDICATORS
    • [KPI 1]: Target [X%/amount]
    • [KPI 2]: Target [X%/amount]
    • [KPI 3]: Target [X%/amount]
    
    ## 🎯 NEXT STEPS
    • [Step 1 with responsible party]
    • [Step 2 with responsible party]
    • [Step 3 with responsible party]
    
    Focus on actionable insights with specific metrics and clear timelines.
    `;
    
    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedReport = response.text();
    
    return {
      originalText: pdfText,
      summary: generatedReport,
      fileName: file.name,
      fileSize: file.size,
      extractedAt: new Date().toISOString(),
      modelUsed: 'gemini-2.0-flash',
      structured: true
    };
    
  } catch (error) {
    console.error('Error generating report from PDF:', error);
    throw new Error(`Failed to process PDF: ${error.message}`);
  }
};

/**
 * Generate insights from manual report text using Gemini 2.0 with structured output
 */
export const enhanceManualReport = async (reportText, department = 'General') => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });
    
    const prompt = `
    You are an AI assistant enhancing reports for a ${department} department. Transform this raw report into a professional, structured analysis.
    
    Original Report:
    ${reportText}
    
    Please enhance this report with the following structured format:
    
    ## 📋 ENHANCED REPORT SUMMARY
    [Professional title and 2-3 sentence overview]
    
    ## 🔍 KEY INSIGHTS
    • [Insight 1 based on original content]
    • [Insight 2 with deeper analysis]
    • [Insight 3 with implications]
    • [Insight 4 with context]
    • [Insight 5 with recommendations]
    
    ## 📊 EXTRACTED METRICS & DATA
    • [Quantifiable metric 1]
    • [Quantifiable metric 2]
    • [Performance indicator 1]
    • [Performance indicator 2]
    
    ## ⚠️ IDENTIFIED RISKS & CONCERNS
    • **High Priority**: [Risk with mitigation strategy]
    • **Medium Priority**: [Risk with monitoring plan]
    • **Low Priority**: [Risk with awareness note]
    
    ## 💡 STRATEGIC RECOMMENDATIONS
    1. **Immediate Actions (Next 7 Days)**
       • [Specific action with owner]
       • [Specific action with resource requirement]
    
    2. **Short-Term Improvements (1-4 Weeks)**
       • [Improvement initiative]
       • [Process enhancement]
    
    3. **Long-Term Development (1-6 Months)**
       • [Strategic development]
       • [System upgrade/change]
    
    ## 📈 PROPOSED KPIs
    • [KPI 1]: Baseline [X], Target [Y]
    • [KPI 2]: Baseline [X], Target [Y]
    • [KPI 3]: Baseline [X], Target [Y]
    
    ## 🎯 IMPLEMENTATION ROADMAP
    • **Week 1-2**: [Phase 1 activities]
    • **Week 3-4**: [Phase 2 activities]
    • **Month 2-3**: [Phase 3 activities]
    • **Month 4-6**: [Phase 4 activities]
    
    ## 📝 FOLLOW-UP REQUIREMENTS
    • [Monitoring requirement 1]
    • [Reporting requirement 2]
    • [Review schedule 3]
    
    Maintain all original information while adding professional structure, deeper analysis, and actionable insights.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const enhancedContent = response.text();
    
    return {
      original: reportText,
      enhanced: enhancedContent,
      enhancedAt: new Date().toISOString(),
      modelUsed: 'gemini-2.0-flash',
      structured: true
    };
    
  } catch (error) {
    console.error('Error enhancing manual report:', error);
    throw new Error(`Failed to enhance report: ${error.message}`);
  }
};

/**
 * Generate action items from report content using Gemini 2.0
 */
export const generateActionItems = async (reportContent, department = 'General') => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.6,
        topK: 32,
        topP: 0.9,
        maxOutputTokens: 4096,
      }
    });
    
    const prompt = `
    Based on the following ${department} department report, generate specific, actionable items with clear priorities and timelines:
    
    Report Content:
    ${reportContent}
    
    ## 🚨 IMMEDIATE ACTION ITEMS (Priority: HIGH - Next 1-7 days)
    1. [Action] - Owner: [Role] - Resources: [Required] - Deadline: [Date]
    2. [Action] - Owner: [Role] - Resources: [Required] - Deadline: [Date]
    3. [Action] - Owner: [Role] - Resources: [Required] - Deadline: [Date]
    
    ## ⏰ SHORT-TERM RECOMMENDATIONS (1-4 weeks)
    1. [Recommendation] - Expected Outcome: [Result] - Budget: [Amount]
    2. [Recommendation] - Expected Outcome: [Result] - Budget: [Amount]
    3. [Recommendation] - Expected Outcome: [Result] - Budget: [Amount]
    
    ## 🎯 LONG-TERM STRATEGIC INITIATIVES (1-6 months)
    1. [Initiative] - Impact: [Benefit] - Investment: [Resources]
    2. [Initiative] - Impact: [Benefit] - Investment: [Resources]
    3. [Initiative] - Impact: [Benefit] - Investment: [Resources]
    
    ## 📋 RESOURCE REQUIREMENTS
    • **Personnel**: [Staff requirements]
    • **Budget**: [Financial requirements]
    • **Equipment**: [Tool/equipment needs]
    • **Training**: [Skill development needs]
    • **Technology**: [System/software requirements]
    
    ## 📊 SUCCESS METRICS & KPIs
    • [Metric 1]: Current [X] → Target [Y] by [Date]
    • [Metric 2]: Current [X] → Target [Y] by [Date]
    • [Metric 3]: Current [X] → Target [Y] by [Date]
    • [Metric 4]: Current [X] → Target [Y] by [Date]
    
    ## 🔄 MONITORING & REVIEW SCHEDULE
    • **Daily**: [What to monitor daily]
    • **Weekly**: [Weekly review items]
    • **Monthly**: [Monthly assessment points]
    • **Quarterly**: [Quarterly strategic review]
    
    Ensure all action items are SMART (Specific, Measurable, Achievable, Relevant, Time-bound).
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const actionItems = response.text();
    
    return {
      actionItems,
      generatedAt: new Date().toISOString(),
      modelUsed: 'gemini-2.0-flash-exp',
      department,
      structured: true
    };
    
  } catch (error) {
    console.error('Error generating action items:', error);
    throw new Error(`Failed to generate action items: ${error.message}`);
  }
};

/**
 * Generate comparative analysis using Gemini 2.0's enhanced reasoning
 */
export const generateComparativeAnalysis = async (reports, department = 'General') => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    });
    
    const reportsText = reports.map((report, index) => 
      `## Report ${index + 1}:\n${report}`
    ).join('\n\n---\n\n');
    
    const prompt = `
    Analyze multiple reports for the ${department} department and provide comprehensive comparative analysis:
    
    ${reportsText}
    
    ## 📊 COMPARATIVE ANALYSIS DASHBOARD
    
    ### 🔗 COMMON THEMES & PATTERNS
    • [Theme 1]: Appears in [X/Y] reports with [consistency level]
    • [Theme 2]: Frequency [X/Y] with [trend direction]
    • [Theme 3]: Pattern [X/Y] showing [implication]
    
    ### 📈 TREND ANALYSIS
    • **Improving Areas**: [Areas with positive trends]
    • **Declining Areas**: [Areas showing deterioration]
    • **Stable Areas**: [Consistent performance zones]
    • **Emerging Issues**: [New concerns appearing]
    
    ### ⚖️ KEY DIFFERENCES & VARIATIONS
    • **Performance Gaps**: [Department/area variations]
    • **Resource Allocation**: [Differences in resource usage]
    • **Timeline Variations**: [Project/process speed differences]
    • **Quality Standards**: [Consistency in output quality]
    
    ### 🎯 CONSOLIDATED RECOMMENDATIONS
    1. **Universal Actions** (Apply across all areas)
       • [Action with broad impact]
       • [System-wide improvement]
    
    2. **Targeted Interventions** (Specific to problem areas)
       • [Specific area]: [Targeted solution]
       • [Specific area]: [Targeted solution]
    
    3. **Best Practice Replication** (Scale successful approaches)
       • [Best practice from Report X]: [How to replicate]
       • [Success factor]: [Implementation strategy]
    
    ### 💰 RESOURCE ALLOCATION STRATEGY
    • **High Priority Areas** (60% of resources)
      - [Area 1]: [Justification and expected ROI]
      - [Area 2]: [Critical need assessment]
    
    • **Medium Priority Areas** (30% of resources)
      - [Area 3]: [Maintenance and stability focus]
      - [Area 4]: [Gradual improvement pathway]
    
    • **Low Priority Areas** (10% of resources)
      - [Area 5]: [Monitoring and minimal intervention]
    
    ### 🚨 CRITICAL SUCCESS FACTORS
    • [Factor 1]: Essential for [outcome]
    • [Factor 2]: Required for [achievement]
    • [Factor 3]: Critical for [sustainability]
    
    ### 📅 INTEGRATED TIMELINE
    • **Month 1**: [Cross-cutting initiatives]
    • **Month 2-3**: [Department-specific actions]
    • **Month 4-6**: [System-wide improvements]
    • **Ongoing**: [Continuous monitoring activities]
    
    Focus on synergies between reports and identify compound benefits from coordinated actions.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();
    
    return {
      analysis,
      reportCount: reports.length,
      generatedAt: new Date().toISOString(),
      modelUsed: 'gemini-2.0-flash-exp',
      department,
      structured: true
    };
    
  } catch (error) {
    console.error('Error generating comparative analysis:', error);
    throw new Error(`Failed to generate comparative analysis: ${error.message}`);
  }
};

/**
 * Generate risk assessment using Gemini 2.0's improved analysis capabilities
 */
export const generateRiskAssessment = async (reportContent, department = 'General') => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.5,
        topK: 32,
        topP: 0.8,
        maxOutputTokens: 6144,
      }
    });
    
    const prompt = `
    Conduct a comprehensive risk assessment for the ${department} department based on this report:
    
    Report Content:
    ${reportContent}
    
    ## 🚨 RISK ASSESSMENT MATRIX
    
    ### HIGH-RISK AREAS (Impact: High | Probability: High)
    • **Risk 1**: [Description]
      - Impact: [Specific consequences]
      - Probability: [Likelihood assessment]
      - Mitigation: [Immediate action required]
      - Timeline: [When to act]
    
    • **Risk 2**: [Description]
      - Impact: [Specific consequences]
      - Probability: [Likelihood assessment]
      - Mitigation: [Immediate action required]
      - Timeline: [When to act]
    
    ### MEDIUM-RISK AREAS (Impact: Medium | Probability: Medium)
    • **Risk 3**: [Description]
      - Impact: [Moderate consequences]
      - Probability: [Moderate likelihood]
      - Monitoring: [Key indicators to watch]
      - Preparation: [Contingency planning]
    
    • **Risk 4**: [Description]
      - Impact: [Moderate consequences]
      - Probability: [Moderate likelihood]
      - Monitoring: [Key indicators to watch]
      - Preparation: [Contingency planning]
    
    ### LOW-RISK AREAS (Impact: Low | Probability: Low)
    • **Risk 5**: [Description]
      - Impact: [Minor consequences]
      - Probability: [Low likelihood]
      - Monitoring: [Routine surveillance]
    
    ## 🎯 RISK MITIGATION STRATEGIES
    
    ### Immediate Actions (Next 7 Days)
    1. [Action for highest risk] - Owner: [Role]
    2. [Action for second highest risk] - Owner: [Role]
    3. [Preventive measure] - Owner: [Role]
    
    ### Short-term Measures (1-4 Weeks)
    1. [Risk reduction initiative] - Budget: [Amount]
    2. [System improvement] - Resources: [Required]
    3. [Process enhancement] - Timeline: [Duration]
    
    ### Long-term Strategy (1-6 Months)
    1. [Structural change] - Investment: [Amount]
    2. [Capability building] - Training: [Requirements]
    3. [Technology upgrade] - Implementation: [Plan]
    
    ## 📊 EARLY WARNING INDICATORS
    • **Critical Threshold**: [Metric] drops below [Value]
    • **Performance Alert**: [KPI] shows [Trend] for [Duration]
    • **Resource Warning**: [Resource] utilization exceeds [Percentage]
    • **Quality Flag**: [Quality metric] falls below [Standard]
    
    ## 🔧 CONTINGENCY PLANNING
    
    ### If High Risk Materializes:
    • **Immediate Response**: [Emergency protocol]
    • **Resource Mobilization**: [Emergency resources]
    • **Communication Plan**: [Stakeholder notification]
    • **Recovery Strategy**: [Business continuity]
    
    ### If Medium Risk Escalates:
    • **Escalation Triggers**: [When to elevate response]
    • **Additional Resources**: [What to deploy]
    • **Stakeholder Engagement**: [Who to involve]
    
    ## 📈 RISK MONITORING DASHBOARD
    • **Daily Checks**: [What to monitor daily]
    • **Weekly Reviews**: [Weekly risk assessment]
    • **Monthly Analysis**: [Comprehensive risk review]
    • **Quarterly Strategy**: [Strategic risk realignment]
    
    ## 🔄 CONTINUOUS IMPROVEMENT
    • **Lessons Learned**: [From past incidents]
    • **Best Practices**: [From successful mitigation]
    • **Process Updates**: [Regular procedure reviews]
    • **Training Updates**: [Skills enhancement needs]
    
    Provide specific, actionable risk management strategies with clear ownership and timelines.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const riskAssessment = response.text();
    
    return {
      riskAssessment,
      generatedAt: new Date().toISOString(),
      modelUsed: 'gemini-2.0-flash-exp',
      department,
      structured: true
    };
    
  } catch (error) {
    console.error('Error generating risk assessment:', error);
    throw new Error(`Failed to generate risk assessment: ${error.message}`);
  }
};

/**
 * NEW: Generate department performance analytics
 */
export const generatePerformanceAnalytics = async (reportContent, department = 'General', historicalData = null) => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.6,
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 6144,
      }
    });
    
    const prompt = `
    Generate comprehensive performance analytics for the ${department} department:
    
    Current Report:
    ${reportContent}
    
    ${historicalData ? `Historical Context:\n${historicalData}` : ''}
    
    ## 📊 PERFORMANCE ANALYTICS DASHBOARD
    
    ### 🎯 KEY PERFORMANCE INDICATORS
    • **Efficiency Rate**: [Current] vs [Target] vs [Previous Period]
    • **Quality Score**: [Current] vs [Benchmark] vs [Industry Standard]
    • **Cost Effectiveness**: $[Amount] per [Unit] vs $[Previous] per [Unit]
    • **Timeline Adherence**: [Percentage] vs [Target] vs [Historical Average]
    • **Resource Utilization**: [Percentage] vs [Optimal] vs [Previous Period]
    
    ### 📈 TREND ANALYSIS
    • **Improving Metrics**: [List with percentage changes]
    • **Declining Metrics**: [List with concerning trends]
    • **Stable Metrics**: [List with consistent performance]
    • **Volatile Metrics**: [List requiring attention]
    
    ### 🏆 BENCHMARK COMPARISON
    • **Above Industry Average**: [Metrics and by how much]
    • **Below Industry Average**: [Metrics and improvement needed]
    • **Best-in-Class Potential**: [Areas with excellence opportunity]
    
    ### 🎨 PERFORMANCE INSIGHTS
    • **Root Cause Analysis**: [Why certain metrics perform well/poorly]
    • **Correlation Patterns**: [Relationships between different metrics]
    • **Seasonal Factors**: [Time-based performance variations]
    • **External Influences**: [Factors outside department control]
    
    ### 💡 OPTIMIZATION OPPORTUNITIES
    1. **Quick Wins** (Low effort, High impact)
       • [Opportunity 1]: [Expected improvement]
       • [Opportunity 2]: [Expected improvement]
    
    2. **Strategic Improvements** (High effort, High impact)
       • [Opportunity 3]: [Long-term benefit]
       • [Opportunity 4]: [System-wide improvement]
    
    3. **Innovation Areas** (Exploratory, Transformative potential)
       • [Innovation 1]: [Disruptive possibility]
       • [Innovation 2]: [Technology leverage]
    
    ### 📅 PERFORMANCE ROADMAP
    • **Next 30 Days**: [Immediate performance targets]
    • **Next 90 Days**: [Short-term performance goals]
    • **Next 12 Months**: [Annual performance objectives]
    
    Provide data-driven insights with specific improvement recommendations.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analytics = response.text();
    
    return {
      analytics,
      generatedAt: new Date().toISOString(),
      modelUsed: 'gemini-2.0-flash-exp',
      department,
      structured: true,
      hasHistoricalData: !!historicalData
    };
    
  } catch (error) {
    console.error('Error generating performance analytics:', error);
    throw new Error(`Failed to generate performance analytics: ${error.message}`);
  }
};
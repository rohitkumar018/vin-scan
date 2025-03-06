import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateResponse } from './services/geminiService';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5002;

// Types
interface ClientInfo {
  name: string;
  position: string;
  websiteUrl: string;
  email: string;
  socialMedia: string;
}

interface ConversationState {
  clientId: string;
  phase: 'context_setting' | 'internal_scan' | 'market_scan' | 'competitor_scan';
  currentStakeholder: string | null;
  stakeholdersInterviewed: string[];
  pendingStakeholders: string[];
  questionIndex: number;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
}

// Store client info and conversation states (in memory for now)
let clients: ClientInfo[] = [];
let conversationStates: Record<string, ConversationState> = {};

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for testing
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CEO interview questions based on documentation
const ceoQuestions = [
  "Could you tell me about your organization's current market position?",
  "What are your main products or services?",
  "Who are your target customers?",
  "What are your organization's key strengths?",
  "What challenges is your organization currently facing?",
  "How would you describe your company culture?",
  "What are your main business objectives for the next year?",
  "Who else should we speak to for a complete perspective of your organization?"
];

// Questions for other stakeholders
const stakeholderQuestions: Record<string, string[]> = {
  'Marketing Head': [
    "What are your current marketing strategies?",
    "How do you measure marketing success?",
    "Who are your target audience segments?",
    "What channels are most effective for your marketing efforts?",
    "What are your biggest marketing challenges?",
    "How do you differentiate from competitors in your marketing?"
  ],
  'Finance Head': [
    "What is the current financial health of the organization?",
    "What are your key financial metrics?",
    "What are your major cost centers?",
    "What financial challenges do you anticipate in the next year?",
    "How do you allocate budget across departments?",
    "What financial opportunities do you see for growth?"
  ],
  'HR Head': [
    "How would you describe the company culture?",
    "What are your current talent acquisition strategies?",
    "What are your employee retention rates?",
    "What HR challenges is the organization facing?",
    "How do you measure employee satisfaction?",
    "What HR initiatives are you planning for the future?"
  ],
  'IT Head': [
    "What is your current technology infrastructure?",
    "What technology challenges is the organization facing?",
    "How do you ensure data security and privacy?",
    "What technology investments are planned for the future?",
    "How does technology support your business objectives?",
    "What digital transformation initiatives are underway?"
  ]
};

// Routes
app.post('/api/signup', (req, res) => {
  try {
    const clientInfo: ClientInfo = req.body;
    const clientId = Date.now().toString(); // Simple ID generation
    
    clients.push(clientInfo);
    console.log('New client signed up:', clientInfo);
    
    // Initialize conversation state
    conversationStates[clientId] = {
      clientId,
      phase: 'context_setting',
      currentStakeholder: 'CEO', // Start with CEO
      stakeholdersInterviewed: [],
      pendingStakeholders: ['Marketing Head', 'Finance Head', 'HR Head', 'IT Head'],
      questionIndex: 0,
      conversationHistory: []
    };
    
    res.status(201).json({ 
      message: 'Signup successful',
      clientInfo,
      clientId
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Error during signup',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, clientId } = req.body;
    
    console.log(`Received chat message: "${message}" from client: ${clientId}`);
    
    if (!clientId || !conversationStates[clientId]) {
      console.error(`Invalid client ID: ${clientId}`);
      return res.status(400).json({ error: 'Invalid client ID' });
    }
    
    const state = conversationStates[clientId];
    console.log(`Current state: phase=${state.phase}, stakeholder=${state.currentStakeholder}, questionIndex=${state.questionIndex}`);
    
    // Add user message to history
    state.conversationHistory.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });
    
    let nextQuestion: string | undefined;
    
    // Check if the message is very short (like "y" or "no")
    const isShortResponse = message.trim().length <= 3;
    console.log(`Is short response: ${isShortResponse}`);
    
    // Determine the next question based on the current phase and stakeholder
    if (state.phase === 'context_setting') {
      // Move to internal scan after context setting
      state.phase = 'internal_scan';
      nextQuestion = ceoQuestions[0];
    } else if (state.phase === 'internal_scan') {
      if (state.currentStakeholder === 'CEO') {
        // Handle CEO interview
        
        // If the response is very short, don't advance to the next question
        if (isShortResponse) {
          nextQuestion = `Could you please elaborate more on your previous answer? This will help me understand your business better.`;
        } else {
          state.questionIndex++;
          
          if (state.questionIndex < ceoQuestions.length) {
            // Continue CEO interview
            nextQuestion = ceoQuestions[state.questionIndex];
          } else {
            // CEO interview complete
            state.stakeholdersInterviewed.push('CEO');
            state.currentStakeholder = null;
            state.questionIndex = 0;
            
            // Ask which stakeholder to interview next
            nextQuestion = "Thank you for your insights. Who would you like me to interview next? Available stakeholders are: " + 
              state.pendingStakeholders.map((s, i) => `${i+1}. ${s}`).join(', ');
          }
        }
      } else if (state.currentStakeholder === null) {
        // User is selecting next stakeholder
        let selectedStakeholder = '';
        
        // Check if user entered a number
        const stakeholderNumber = parseInt(message);
        if (!isNaN(stakeholderNumber) && stakeholderNumber > 0 && stakeholderNumber <= state.pendingStakeholders.length) {
          selectedStakeholder = state.pendingStakeholders[stakeholderNumber - 1];
        } else {
          // Check if user entered a stakeholder title
          const matchedStakeholder = state.pendingStakeholders.find(s => 
            s.toLowerCase() === message.toLowerCase() || 
            message.toLowerCase().includes(s.toLowerCase())
          );
          
          if (matchedStakeholder) {
            selectedStakeholder = matchedStakeholder;
          }
        }
        
        if (selectedStakeholder) {
          // Set current stakeholder and remove from pending
          state.currentStakeholder = selectedStakeholder;
          state.pendingStakeholders = state.pendingStakeholders.filter(s => s !== selectedStakeholder);
          
          // Start interview with first question
          nextQuestion = stakeholderQuestions[selectedStakeholder][0];
        } else {
          // Invalid selection
          nextQuestion = "Please select from the available stakeholders: " + 
            state.pendingStakeholders.map((s, i) => `${i+1}. ${s}`).join(', ');
        }
      } else {
        // Handle other stakeholder interviews
        const questions = stakeholderQuestions[state.currentStakeholder];
        
        // If the response is very short, don't advance to the next question
        if (isShortResponse) {
          nextQuestion = `Could you please elaborate more on your previous answer? This will help me understand your business better.`;
        } else {
          state.questionIndex++;
          
          if (state.questionIndex < questions.length) {
            // Continue stakeholder interview
            nextQuestion = questions[state.questionIndex];
          } else {
            // Stakeholder interview complete
            state.stakeholdersInterviewed.push(state.currentStakeholder);
            state.currentStakeholder = null;
            state.questionIndex = 0;
            
            if (state.pendingStakeholders.length > 0) {
              // Ask which stakeholder to interview next
              nextQuestion = "Thank you for your insights. Who would you like me to interview next? Available stakeholders are: " + 
                state.pendingStakeholders.map((s, i) => `${i+1}. ${s}`).join(', ');
            } else {
              // All stakeholders interviewed
              state.phase = 'market_scan';
              nextQuestion = "Thank you for completing all the stakeholder interviews. Let's move on to the Market Scan phase. Could you tell me about your industry size and growth rate?";
            }
          }
        }
      }
    } else if (state.phase === 'market_scan') {
      // Simple progression through market scan questions
      const marketScanQuestions = [
        "Could you tell me about your industry size and growth rate?",
        "What are the key trends in your industry (technological shifts, regulatory changes, consumer behavior)?",
        "What is the regulatory landscape like in your industry?",
        "Who are the key players in your market?",
        "How is your market segmented (by geography, demographics, behavior)?",
        "What are the main customer pain points in your market?",
        "What are the main demand drivers in your market (macroeconomic factors, cultural shifts)?",
        "Let's discuss some external factors. What political factors affect your business (trade policies, subsidies)?",
        "What economic factors affect your business (inflation, unemployment rates)?",
        "What social factors affect your business (demographic shifts, cultural trends)?",
        "What technological factors affect your business (innovations, R&D spend)?",
        "What environmental factors affect your business (sustainability regulations)?",
        "What legal factors affect your business (IP laws, labor regulations)?",
        "What are the main risks your business faces (supply chain bottlenecks, regulatory hurdles)?",
        "What opportunities do you see in your market (underserved markets, tech adoption gaps)?"
      ];
      
      // If the response is very short, don't advance to the next question
      if (isShortResponse) {
        nextQuestion = `Could you please elaborate more on your previous answer? This will help me understand your market better.`;
      } else {
        state.questionIndex++;
        
        if (state.questionIndex < marketScanQuestions.length) {
          // Continue market scan
          nextQuestion = marketScanQuestions[state.questionIndex];
        } else {
          // Market scan complete
          state.phase = 'competitor_scan';
          state.questionIndex = 0;
          nextQuestion = "Thank you for completing the Market Scan. Let's move on to the Competitor Scan phase. Who are your direct competitors (companies offering similar products/services to the same target market)?";
        }
      }
    } else if (state.phase === 'competitor_scan') {
      // Simple progression through competitor scan questions
      const competitorScanQuestions = [
        "Who are your direct competitors (companies offering similar products/services to the same target market)?",
        "Who are your indirect competitors (companies offering substitute products/services)?",
        "Are there any emerging competitors (new market entrants or companies showing significant growth) that concern you?",
        "Let's analyze your competitors' digital presence. How would you compare your website to your competitors' websites?",
        "How does your social media presence compare to your competitors?",
        "What technologies do your competitors use that you don't?",
        "How would you describe your competitors' messaging and communication strategies?",
        "How do your competitors position themselves in the market?",
        "What are your competitors' strengths and weaknesses?",
        "How do you differentiate yourself from your competitors?"
      ];
      
      // If the response is very short, don't advance to the next question
      if (isShortResponse) {
        nextQuestion = `Could you please elaborate more on your previous answer? This will help me understand your competitors better.`;
      } else {
        state.questionIndex++;
        
        if (state.questionIndex < competitorScanQuestions.length) {
          // Continue competitor scan
          nextQuestion = competitorScanQuestions[state.questionIndex];
        } else {
          // Competitor scan complete
          nextQuestion = "Thank you for completing the Competitor Scan. We have now gathered all the necessary information for your VinScan report. Our team will analyze this information and provide you with a comprehensive report soon. Is there anything else you'd like to add or discuss?";
        }
      }
    }
    
    // Generate response using AI
    console.log(`Generating response with AI: phase=${state.phase}, stakeholder=${state.currentStakeholder}, nextQuestion=${nextQuestion}`);
    const response = await generateResponse(
      message,
      state.conversationHistory.map(msg => ({ 
        role: msg.role, 
        content: msg.content 
      })),
      state.phase,
      state.currentStakeholder,
      nextQuestion
    );
    
    console.log(`AI response: "${response.substring(0, 50)}..."`);
    
    // Add assistant response to history
    state.conversationHistory.push({
      role: 'assistant',
      content: response,
      timestamp: new Date()
    });
    
    res.status(200).json({ message: response });
  } catch (error) {
    console.error('Chat error:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ 
      error: 'Error processing chat message',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.get('/api/clients', (req, res) => {
  res.json(clients);
});

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to VinScan API' });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: Function) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

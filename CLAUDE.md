# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ExpertTech Studio** is an AI-powered development agency platform that helps middle-aged professionals (40-50s) leverage their expertise to create customized IT businesses. The platform analyzes professional backgrounds and generates tailored business ideas, then provides end-to-end development services from planning to launch.

## Project Structure

```
expert-tech-studio/
├── docs/
│   ├── business/       # Business models, pricing strategies
│   ├── system/         # System design for AI engine and client intake
│   ├── operations/     # Workflow processes
│   └── templates/      # Document templates
└── src/                # Source code (to be developed)
```

## Key System Components

### 1. Client Intake System (`docs/system/client-intake-system.md`)
- Collects client expertise and business goals through a 4-step process
- Stores structured data in JSON format for AI analysis
- Progressive information gathering optimized for middle-aged users

### 2. AI Recommendation Engine (`docs/system/ai-recommendation-engine.md`)
- Analyzes client expertise to generate business ideas
- Uses hybrid approach: rule-based templates + LLM generation
- Evaluates market fit, feasibility, and success probability
- Generates implementation plans

### 3. Service Delivery Model (`docs/business/service-model.md`)
- Phase 1: Analysis & Planning (1-2 weeks)
- Phase 2: Development & Implementation (4-8 weeks)  
- Phase 3: Launch & Operations Support (continuous)

## Development Guidelines

### Data Structures
The system uses structured JSON for client data:
```json
{
  "customer_id": "unique_identifier",
  "basic_info": {...},
  "expertise": {...},
  "business_intent": {...},
  "ai_analysis": {...}
}
```

### AI Integration Architecture
- **Input Layer**: Customer data + market data
- **Processing Layer**: Data standardization and feature extraction
- **Analysis Layer**: Expertise analysis, market opportunity analysis, business model generation
- **Recommendation Layer**: Ranking and implementation planning
- **Output Layer**: Structured recommendations and plans

### Security Considerations
- AES-256 encryption for data transmission and storage
- Role-based access control
- Personal data protection compliance
- Session management and 2FA

## Target Industries
The system provides specialized solutions for:
- Real Estate professionals → Investment consulting platforms
- Tax/Legal experts → Automated consultation services
- Consultants/Coaches → Client management systems
- Healthcare professionals → Telemedicine platforms

## Business Model Templates
Each industry has three tiers of solutions:
- **Basic**: Simple web platform with AI chatbot
- **Advanced**: Full-featured platform with data integration
- **Premium**: Mobile app with advanced automation

## Implementation Roadmap
- **Phase 1** (1-2 months): Basic recommendation system with rule-based matching
- **Phase 2** (2-3 months): ML-based expertise analysis and market integration
- **Phase 3** (3-4 months): Deep learning recommendation system
- **Phase 4** (4-6 months): Fully autonomous AI system

## Key Design Principles
1. **User-Friendly for Middle-Aged Users**: Large fonts, clear buttons, intuitive navigation
2. **Industry-Specific Solutions**: Tailored features for each professional domain
3. **Progressive Enhancement**: Start simple, add complexity gradually
4. **Automation Focus**: Reduce manual work through AI and automation

## Performance Metrics
- Recommendation accuracy: Precision, Recall, F1-score, NDCG
- Business success rate tracking by industry
- Customer satisfaction monitoring
- Continuous learning and model improvement

## Current Development Status
- Documentation and system design complete
- Ready for implementation phase
- No source code developed yet

## Next Steps
1. Set up development environment
2. Implement client intake system
3. Build AI recommendation engine prototype
4. Create industry-specific templates
5. Develop web platform MVP
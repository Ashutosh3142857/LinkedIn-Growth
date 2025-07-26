from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import asyncio
from datetime import datetime, timedelta
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="LinkedIn Growth Automation API",
    description="AI-powered LinkedIn automation for 100k followers",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ContentGenerationRequest(BaseModel):
    topic: str
    audience: str
    tone: str
    competitor_data: Optional[str] = None

class ContentPost(BaseModel):
    id: Optional[str] = None
    content: str
    topic: str
    audience: str
    tone: str
    status: str = "draft"
    scheduled_date: Optional[str] = None

class AlumniContact(BaseModel):
    id: Optional[str] = None
    name: str
    university: str
    graduation_year: int
    status: str = "pending"
    linkedin_url: Optional[str] = None

class AdCampaign(BaseModel):
    id: Optional[str] = None
    name: str
    budget: float
    target_audience: str
    headlines: List[str]
    status: str = "active"

class CompetitorData(BaseModel):
    id: Optional[str] = None
    name: str
    linkedin_url: str
    follower_count: int
    engagement_rate: float

# In-memory storage (replace with database in production)
content_posts = []
alumni_contacts = []
ad_campaigns = []
competitors = []

# AI Content Generation Templates
CONTENT_TEMPLATES = {
    "Student Life": [
        "🎓 {topic} insights for students: Here's what every {audience} should know...",
        "💡 Pro tip for {audience}: {topic} can transform your academic journey...",
        "🚀 Ready to level up your {topic} game? Here's your roadmap..."
    ],
    "Career Advice": [
        "💼 Career breakthrough: How {topic} changed everything for {audience}...",
        "🎯 {audience} success story: The {topic} strategy that works...",
        "⭐ From student to professional: {topic} lessons learned..."
    ],
    "Campus Events": [
        "🎉 Campus spotlight: {topic} event that {audience} can't miss...",
        "📅 Mark your calendar: {topic} is happening and here's why you should attend...",
        "🌟 Community building through {topic}: How {audience} benefit..."
    ]
}

@app.get("/")
async def root():
    return {"message": "LinkedIn Growth Automation API", "status": "active"}

# Content Creation Endpoints
@app.post("/api/content/generate")
async def generate_content(request: ContentGenerationRequest):
    try:
        # Simulate AI content generation
        await asyncio.sleep(1)  # Simulate processing time
        
        template_key = request.topic if request.topic in CONTENT_TEMPLATES else "Career Advice"
        templates = CONTENT_TEMPLATES[template_key]
        
        generated_posts = []
        for i, template in enumerate(templates[:3]):  # Generate 3 variations
            content = template.format(
                topic=request.topic,
                audience=request.audience.lower()
            )
            
            # Add tone-specific modifications
            if request.tone == "Casual":
                content += "\n\nWhat do you think? Drop your thoughts below! 👇"
            elif request.tone == "Inspirational":
                content += "\n\nYour journey starts today. Which step will you take first? 💪"
            elif request.tone == "Educational":
                content += "\n\nWant to learn more? Comment 'INFO' and I'll share resources! 📚"
            
            # Add relevant hashtags
            hashtags = f"\n\n#{request.topic.replace(' ', '')} #{request.audience}Success #LinkedInGrowth"
            content += hashtags
            
            post = {
                "id": f"post_{len(content_posts) + i + 1}",
                "content": content,
                "topic": request.topic,
                "audience": request.audience,
                "tone": request.tone,
                "status": "draft",
                "created_at": datetime.now().isoformat()
            }
            generated_posts.append(post)
            content_posts.append(post)
        
        return {
            "success": True,
            "posts": generated_posts,
            "message": f"Generated {len(generated_posts)} content variations"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/content/posts")
async def get_posts():
    return {"posts": content_posts}

@app.post("/api/content/schedule")
async def schedule_post(data: Dict[str, Any]):
    try:
        # Find the post and update it
        post_id = data.get("post_id")
        scheduled_date = data.get("scheduled_date")
        
        for post in content_posts:
            if post["id"] == post_id:
                post["status"] = "scheduled"
                post["scheduled_date"] = scheduled_date
                break
        
        return {"success": True, "message": "Post scheduled successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Alumni Engagement Endpoints
@app.post("/api/alumni/import")
async def import_alumni(data: Dict[str, Any]):
    try:
        # Simulate importing alumni data
        mock_alumni = [
            {"name": "John Smith", "university": "MIT", "graduation_year": 2020},
            {"name": "Sarah Johnson", "university": "Stanford", "graduation_year": 2019},
            {"name": "Mike Chen", "university": "Harvard", "graduation_year": 2021},
        ]
        
        for i, alumni_data in enumerate(mock_alumni):
            alumni = {
                "id": f"alumni_{len(alumni_contacts) + i + 1}",
                "name": alumni_data["name"],
                "university": alumni_data["university"],
                "graduation_year": alumni_data["graduation_year"],
                "status": "pending",
                "imported_at": datetime.now().isoformat()
            }
            alumni_contacts.append(alumni)
        
        return {
            "success": True,
            "imported": len(mock_alumni),
            "message": f"Imported {len(mock_alumni)} alumni contacts"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/alumni")
async def get_alumni():
    return {"alumni": alumni_contacts}

@app.post("/api/alumni/campaign/start")
async def start_alumni_campaign(data: Dict[str, Any]):
    try:
        campaign_type = data.get("campaign_type")
        alumni_ids = data.get("alumni_ids", [])
        
        # Simulate campaign start
        updated_count = 0
        for alumni in alumni_contacts:
            if alumni["id"] in alumni_ids:
                if campaign_type == "connection":
                    alumni["status"] = "connection_sent"
                elif campaign_type == "follow":
                    alumni["status"] = "follow_sent"
                elif campaign_type == "story":
                    alumni["status"] = "story_sent"
                updated_count += 1
        
        return {
            "success": True,
            "campaign_type": campaign_type,
            "contacts_processed": updated_count,
            "message": f"Started {campaign_type} campaign for {updated_count} contacts"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Ad Optimization Endpoints
@app.post("/api/ads/campaign")
async def create_ad_campaign(data: Dict[str, Any]):
    try:
        campaign = {
            "id": f"campaign_{len(ad_campaigns) + 1}",
            "name": data["name"],
            "budget": data["budget"],
            "target_audience": data["target_audience"],
            "headlines": data["headlines"],
            "status": "active",
            "created_at": datetime.now().isoformat(),
            "performance": {
                "impressions": 0,
                "clicks": 0,
                "conversions": 0,
                "cpa": 0.0
            }
        }
        ad_campaigns.append(campaign)
        
        return {
            "success": True,
            "campaign": campaign,
            "message": "Ad campaign created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ads/campaigns")
async def get_ad_campaigns():
    return {"campaigns": ad_campaigns}

@app.post("/api/ads/headlines/generate")
async def generate_ad_headlines(data: Dict[str, Any]):
    try:
        target_audience = data.get("target_audience", "students")
        
        # AI-generated headlines
        headlines = [
            f"Transform Your Career: Join 10k+ {target_audience.title()} Who Succeeded",
            f"Unlock Your Potential: The #1 Platform for {target_audience.title()}",
            f"Ready to Stand Out? Connect with Alumni & Grow Your Network",
            f"From Student to Professional: Your Journey Starts Here",
            f"Join the Future Leaders: Network, Learn, Succeed",
            f"Career Breakthrough Awaits: Connect with Industry Leaders",
            f"Build Your Professional Brand: Start Today",
            f"Network Like a Pro: Access Exclusive Opportunities",
            f"Your Career Game-Changer: Join Now",
            f"Success Stories Begin Here: Join {target_audience.title()} Network"
        ]
        
        return {
            "success": True,
            "headlines": headlines,
            "message": f"Generated {len(headlines)} headlines for {target_audience}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Competitor Tracking Endpoints
@app.post("/api/competitors")
async def add_competitor(data: Dict[str, Any]):
    try:
        competitor = {
            "id": f"competitor_{len(competitors) + 1}",
            "name": data["name"],
            "linkedin_url": data["linkedin_url"],
            "follower_count": 25000,  # Mock data
            "engagement_rate": 4.2,
            "post_frequency": 5,  # posts per week
            "last_updated": datetime.now().isoformat(),
            "recent_posts": [
                {"content": "Latest industry insights...", "engagement": 150, "date": "2024-01-15"},
                {"content": "Career advice for professionals...", "engagement": 230, "date": "2024-01-14"},
            ]
        }
        competitors.append(competitor)
        
        return {
            "success": True,
            "competitor": competitor,
            "message": "Competitor added for tracking"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/competitors")
async def get_competitors():
    return {"competitors": competitors}

# Analytics Endpoints
@app.get("/api/analytics/dashboard")
async def get_dashboard_stats():
    return {
        "total_followers": 15420,
        "weekly_growth": 8.5,
        "content_generated": len(content_posts),
        "alumni_contacted": len(alumni_contacts),
        "ad_campaigns_active": len([c for c in ad_campaigns if c["status"] == "active"]),
        "time_saved": 28,
        "engagement_rate": 6.3,
        "viral_posts": 3
    }

# Workflow Management Endpoints
@app.get("/api/workflows")
async def get_workflows():
    workflows = [
        {
            "id": "content_creation",
            "name": "Content Creation",
            "status": "active",
            "description": "Generate 15-20 posts/week using Langflow + n8n",
            "next_run": (datetime.now() + timedelta(hours=2)).isoformat()
        },
        {
            "id": "alumni_engagement",
            "name": "Alumni Engagement",
            "status": "active",
            "description": "Convert 2k alumni → 10k followers",
            "next_run": (datetime.now() + timedelta(hours=6)).isoformat()
        },
        {
            "id": "ad_optimization",
            "name": "Ad Optimization",
            "status": "active",
            "description": "Scale ads while keeping CPA < $0.30",
            "next_run": (datetime.now() + timedelta(hours=1)).isoformat()
        },
        {
            "id": "competitor_tracking",
            "name": "Competitor Tracking",
            "status": "active",
            "description": "Real-time competitor monitoring",
            "next_run": (datetime.now() + timedelta(minutes=30)).isoformat()
        },
        {
            "id": "viral_amplification",
            "name": "Viral Amplification",
            "status": "inactive",
            "description": "Amplify posts with >500 engagement",
            "next_run": None
        }
    ]
    return {"workflows": workflows}

@app.post("/api/workflows/{workflow_id}/start")
async def start_workflow(workflow_id: str, config: Dict[str, Any]):
    return {
        "success": True,
        "workflow_id": workflow_id,
        "status": "started",
        "message": f"Workflow {workflow_id} started successfully"
    }

@app.post("/api/workflows/{workflow_id}/stop")
async def stop_workflow(workflow_id: str):
    return {
        "success": True,
        "workflow_id": workflow_id,
        "status": "stopped",
        "message": f"Workflow {workflow_id} stopped successfully"
    }

# Health check
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
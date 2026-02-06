from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from nlp_engine import CultureAnalyzer
from mock_data import MOCK_COMPANIES, CULTURAL_DIMENSIONS

app = FastAPI(title="Culture Gap Visualizer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize NLP Engine globally
print("Initializing NLP Engine...")
analyzer = CultureAnalyzer()
print("NLP Engine Ready.")

class AnalyzeRequest(BaseModel):
    company_name: str

@app.get("/")
def read_root():
    return {"message": "Culture Gap Visualizer API is running"}

@app.get("/companies")
def get_companies():
    return list(MOCK_COMPANIES.keys())

@app.post("/analyze")
def analyze_company(request: AnalyzeRequest):
    company_name = request.company_name
    if company_name not in MOCK_COMPANIES:
        raise HTTPException(status_code=404, detail="Company not found")
    
    data = MOCK_COMPANIES[company_name]
    mission = data["mission"]
    reviews = data["reviews"]
    
    # 1. Compute Overall Gap
    gap_score = analyzer.compute_gap(mission, reviews)
    
    # 2. Compute Dimensions
    # Corporate Stance
    corp_dims = analyzer.compute_dimensions(mission, CULTURAL_DIMENSIONS)
    # Employee Perception (Average of all reviews for simplcity of MVP)
    # Ideally we'd average the scores, let's do that.
    emp_dim_scores = {dim: [] for dim in CULTURAL_DIMENSIONS}
    for review in reviews:
        scores = analyzer.compute_dimensions(review, CULTURAL_DIMENSIONS)
        for dim, score in scores.items():
            emp_dim_scores[dim].append(score)
            
    emp_dims_avg = {dim: sum(vals)/len(vals) if vals else 0.0 for dim, vals in emp_dim_scores.items()}
    
    # 3. Compute UMAP
    # We combine Mission + Reviews
    texts = [mission] + reviews
    labels = ["Official"] + ["Employee"] * len(reviews)
    umap_points = analyzer.compute_umap(texts, labels)
    
    return {
        "company": company_name,
        "gap_score": gap_score,
        "dimensions": {
            "corporate": corp_dims,
            "employee": emp_dims_avg
        },
        "umap_coords": umap_points
    }

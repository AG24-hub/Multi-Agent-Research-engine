from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pipeline import run_research_pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/research")
def research(data: dict):

    topic = data["topic"]

    result = run_research_pipeline(topic)

    return {
        "search": result["search_results"],
        "reader": result["scraped_content"],
        "writer": result["report"],
        "critic": result["feedback"]
    }
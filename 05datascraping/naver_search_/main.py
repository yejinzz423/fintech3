from fastapi import FastAPI, Request, Form
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from  naver_search import naver_api 


app = FastAPI()
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request":request})

@app.post("/search")
def search(request: Request, keyword=Form(...)):
    results =  naver_api(keyword)
    return templates.TemplateResponse(
        "results.html",
        {"request": request, "keyword":keyword, "results":results}
    )


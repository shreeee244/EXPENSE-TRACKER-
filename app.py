import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="EXPENSE-AI", description="AI-powered expense tracker")

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ExpenseInput(BaseModel):
    text: str  # e.g., "Spent $45 on Uber yesterday"

class ExpenseOutput(BaseModel):
    amount: float
    category: str
    description: str
    date: str  # simplified, you can parse real dates

@app.get("/")
def root():
    return {"message": "EXPENSE-AI is running. Use POST /parse to parse an expense."}

@app.post("/parse", response_model=ExpenseOutput)
async def parse_expense(expense: ExpenseInput):
    try:
        # Use GPT to extract structured data
        prompt = f"""
        Extract the following from the expense text: amount, category (choose from: Food, Transport, Shopping, Bills, Entertainment, Other), description, and date (in YYYY-MM-DD format, assume today if not mentioned).
        Text: "{expense.text}"
        Return ONLY valid JSON with keys: amount, category, description, date.
        """
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )
        result = json.loads(response.choices[0].message.content)
        return ExpenseOutput(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
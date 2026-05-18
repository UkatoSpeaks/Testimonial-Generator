from dotenv import load_dotenv
from langchain_mistralai import ChatMistralAI
import os

load_dotenv()

llm = ChatMistralAI(
    model="mistral-small-2506",
    temperature=0.7,
    api_key=os.getenv("MISTRAL_API_KEY")
)
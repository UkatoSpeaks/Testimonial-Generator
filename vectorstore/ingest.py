from langchain_community.document_loaders import TextLoader

from langchain_text_splitters import RecursiveCharacterTextSplitter

from langchain_community.vectorstores import Chroma

from langchain_mistralai import MistralAIEmbeddings

from dotenv import load_dotenv

import os


load_dotenv()

brand_name = "openai"

docs_path = f"brands/{brand_name}/docs/company_info.txt"

db_path = f"brands/{brand_name}/vectordb"


loader = TextLoader(docs_path)

documents = loader.load()


text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)

docs = text_splitter.split_documents(documents)


embeddings = MistralAIEmbeddings(
    api_key=os.getenv("MISTRAL_API_KEY")
)


vectorstore = Chroma.from_documents(
    documents=docs,
    embedding=embeddings,
    persist_directory=db_path
)

print("Brand vector DB created successfully.")
from langchain_community.vectorstores import Chroma

from langchain_mistralai import MistralAIEmbeddings

from dotenv import load_dotenv

import os


load_dotenv()


def get_retriever(brand_name: str):

    embeddings = MistralAIEmbeddings(
        api_key=os.getenv("MISTRAL_API_KEY")
    )

    db_path = f"brands/{brand_name}/vectordb"

    vectorstore = Chroma(
        persist_directory=db_path,
        embedding_function=embeddings
    )

    return vectorstore.as_retriever(
        search_kwargs={"k": 3}
    )
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import rotas_do_grafo

app = FastAPI(
    title="API de Visualização de Rede Societária",
    description="Uma API para consultar dados de uma rede de empresas e sócios a partir de um banco de dados Neo4j.",
    version="1.0.0"
)

# Configuração do CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Em produção, restrinja para o domínio do frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir as rotas do grafo
app.include_router(rotas_do_grafo.router, prefix="/api", tags=["Grafo"])

@app.get("/", tags=["Root"])
def read_root():
    """
    Endpoint raiz para verificar se a API está no ar.
    """
    return {"status": "API no ar!"}

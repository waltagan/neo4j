from fastapi import APIRouter, HTTPException
from app.services.servico_do_grafo import ServicoDoGrafo
from app.models.modelos_do_grafo import Grafo

router = APIRouter()
servico = ServicoDoGrafo()

@router.get("/rede", response_model=Grafo, summary="Obter a rede societária completa")
def obter_rede():
    """
    Endpoint para obter todos os nós e relacionamentos do grafo.
    """
    try:
        dados_da_rede = servico.obter_rede_completa()
        if dados_da_rede is None:
            raise HTTPException(status_code=500, detail="Não foi possível obter os dados da rede.")
        # O Pydantic validará e converterá o dicionário para o modelo Grafo
        return dados_da_rede
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ocorreu um erro interno: {e}")

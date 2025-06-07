from pydantic import BaseModel
from typing import Dict, Any, List

class No(BaseModel):
    id: str
    label: str
    properties: Dict[str, Any]

class Aresta(BaseModel):
    id: str
    source: str
    target: str
    label: str
    properties: Dict[str, Any]

class Grafo(BaseModel):
    nodes: List[No]
    edges: List[Aresta]

from app.db.conector_neo4j import ConectorNeo4j

class ServicoDoGrafo:
    """
    Classe de serviço para manipular a lógica de negócio relacionada ao grafo.
    """
    def __init__(self):
        """
        Inicializa o serviço, estabelecendo a conexão com o banco de dados.
        """
        self.conector = ConectorNeo4j()

    def _transformar_para_json(self, records):
        """
        Transforma os registros da consulta do grafo para um formato JSON.

        Args:
            records: O objeto de resultado da consulta do Neo4j.

        Returns:
            dict: Um dicionário com as chaves "nodes" e "edges".
        """
        nos_dict = {}
        arestas = []

        for record in records:
            # Nó de origem
            no_origem = record["n"]
            if no_origem.element_id not in nos_dict:
                nos_dict[no_origem.element_id] = self._formatar_no(no_origem)

            # Nó de destino
            no_destino = record["m"]
            if no_destino.element_id not in nos_dict:
                nos_dict[no_destino.element_id] = self._formatar_no(no_destino)

            # Aresta
            aresta = record["r"]
            arestas.append(self._formatar_aresta(aresta, no_origem.element_id, no_destino.element_id))
        
        return {
            "nodes": list(nos_dict.values()),
            "edges": arestas
        }

    def _formatar_no(self, no):
        """
        Formata um objeto de nó do Neo4j para um dicionário.
        """
        # O ID do Sigma.js precisa ser uma string
        return {
            "id": no.element_id,
            "label": next(iter(no.labels)),  # Pega a primeira label
            "properties": dict(no)
        }

    def _formatar_aresta(self, aresta, source_id, target_id):
        """
        Formata um objeto de aresta do Neo4j para um dicionário.
        """
        # O ID do Sigma.js precisa ser uma string
        return {
            "id": aresta.element_id,
            "source": source_id,
            "target": target_id,
            "label": aresta.type,
            "properties": dict(aresta)
        }

    def obter_rede_completa(self):
        """
        Obtém todos os nós e relacionamentos do banco de dados.
        """
        try:
            with self.conector.get_session() as session:
                resultado = session.run("MATCH (n)-[r]->(m) RETURN n, r, m")
                return self._transformar_para_json(resultado)
        except Exception as e:
            print(f"Erro ao obter a rede completa: {e}")
            return None


# Bloco de teste
if __name__ == "__main__":
    print("Iniciando teste do Serviço de Grafo...")
    servico = ServicoDoGrafo()

    # Teste: Obter rede completa
    print("\n--- Testando obter_rede_completa ---")
    rede = servico.obter_rede_completa()
    if rede and rede["nodes"] and rede["edges"]:
        print(f"Sucesso! Rede obtida com {len(rede['nodes'])} nós e {len(rede['edges'])} arestas.")
        # print("Amostra de nó:", rede["nodes"][0])
        # print("Amostra de aresta:", rede["edges"][0])
    else:
        print("Falha ao obter a rede.")

    servico.conector.close()
    print("\nTeste finalizado. Conexão fechada.")

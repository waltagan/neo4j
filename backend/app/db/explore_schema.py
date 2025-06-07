import os
from dotenv import load_dotenv
from neo4j import GraphDatabase, exceptions

class Neo4jConnector:
    """
    Uma classe para gerenciar a conexão com o banco de dados Neo4j e explorar seu schema.
    """
    def __init__(self, uri, user, password):
        self._uri = uri
        self._user = user
        self._password = password
        self._driver = None
        try:
            # Tenta estabelecer a conexão com o driver do Neo4j
            self._driver = GraphDatabase.driver(self._uri, auth=(self._user, self._password))
            # Verifica se a conexão é bem-sucedida
            self._driver.verify_connectivity()
            print("✅ Conexão com o Neo4j estabelecida com sucesso.")
        except exceptions.AuthError:
            print("❌ Erro de Autenticação: Verifique se as credenciais (usuário e senha) estão corretas.")
            raise
        except Exception as e:
            print(f"❌ Erro ao conectar ao Neo4j: {e}")
            raise

    def close(self):
        """Fecha a conexão com o driver do Neo4j."""
        if self._driver is not None:
            self._driver.close()
            print("🔌 Conexão com o Neo4j fechada.")

    def explore_schema(self, sample_limit=5):
        """
        Executa consultas para explorar e imprimir o schema do banco de dados.
        - Lista todos os rótulos de nós e suas contagens.
        - Lista todos os tipos de relacionamento e suas contagens.
        - Mostra uma amostra de dados do grafo.
        """
        if not self._driver:
            print("⚠️ Não há conexão com o banco de dados.")
            return

        with self._driver.session() as session:
            try:
                # Consulta para obter todos os rótulos de nós e suas contagens
                nodes_result = session.run("""
                    MATCH (n)
                    RETURN DISTINCT labels(n) AS labels, count(n) AS count
                """)
                print("\n--- 🔬 Rótulos (Nós) Encontrados ---")
                for record in nodes_result:
                    print(f"   - Rótulos: {record['labels']}, Contagem: {record['count']}")

                # Consulta para obter todos os tipos de relacionamento e suas contagens
                rels_result = session.run("""
                    MATCH ()-[r]->()
                    RETURN DISTINCT type(r) AS type, count(r) AS count
                """)
                print("\n--- 🔗 Tipos de Relacionamento Encontrados ---")
                for record in rels_result:
                    print(f"   - Tipo: {record['type']}, Contagem: {record['count']}")

                # Consulta para obter uma amostra de como os nós se conectam
                graph_result = session.run(f"""
                    MATCH (n)-[r]->(m)
                    RETURN n, type(r) as rel_type, m
                    LIMIT {sample_limit}
                """)
                print(f"\n--- SAMPLE DE {sample_limit} RELACIONAMENTOS ---")
                for i, record in enumerate(graph_result):
                    node_n = dict(record['n'].items())
                    node_m = dict(record['m'].items())
                    labels_n = record['n'].labels
                    labels_m = record['m'].labels
                    print(f"#{i+1}: ({':'.join(labels_n)}) {node_n} --[{record['rel_type']}]--> ({':'.join(labels_m)}) {node_m}")

            except Exception as e:
                print(f"❌ Erro ao executar a consulta de exploração: {e}")

def main():
    """
    Função principal para executar o script.
    """
    # Constrói o caminho para o arquivo .env na pasta 'backend'
    dotenv_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
    load_dotenv(dotenv_path=dotenv_path)

    uri = os.getenv("NEO4J_URI")
    user = os.getenv("NEO4J_USERNAME")
    password = os.getenv("NEO4J_PASSWORD")

    if not all([uri, user, password]):
        print("⚠️  As variáveis de ambiente não foram carregadas. Verifique se o arquivo .env existe em 'backend/.env'")
        print("e contém as variáveis NEO4J_URI, NEO4J_USERNAME e NEO4J_PASSWORD.")
        return

    connector = None
    try:
        connector = Neo4jConnector(uri, user, password)
        connector.explore_schema()
    except Exception:
        # A mensagem de erro específica já foi impressa no construtor ou no método
        print("\n🛑 A execução foi interrompida devido a um erro.")
    finally:
        if connector and connector._driver is not None:
            connector.close()

if __name__ == "__main__":
    main() 
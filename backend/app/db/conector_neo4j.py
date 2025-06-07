import os
from dotenv import load_dotenv
from neo4j import GraphDatabase, exceptions

class ConectorNeo4j:
    """
    Classe para gerenciar a conexão com o banco de dados Neo4j.

    Esta classe utiliza as credenciais do arquivo .env para estabelecer
    uma conexão com o driver do Neo4j e fornece métodos para
    obter uma sessão e fechar a conexão.
    """
    def __init__(self):
        """
        Inicializa o ConectorNeo4j.

        Carrega as variáveis de ambiente e inicializa o driver do Neo4j.
        """
        # Constrói o caminho para o arquivo .env na raiz do backend
        dotenv_path = os.path.join(os.path.dirname(__file__), '..', '..', '.env')
        load_dotenv(dotenv_path=dotenv_path)

        uri = os.getenv("NEO4J_URI")
        user = os.getenv("NEO4J_USERNAME")
        password = os.getenv("NEO4J_PASSWORD")

        if not all([uri, user, password]):
            raise ValueError("As variáveis de ambiente NEO4J_URI, NEO4J_USERNAME e NEO4J_PASSWORD devem ser definidas.")

        self._driver = GraphDatabase.driver(uri, auth=(user, password))

    def get_session(self):
        """
        Retorna uma nova sessão do driver do Neo4j.

        Returns:
            Uma instância de neo4j.Session.
        """
        return self._driver.session()

    def close(self):
        """
        Fecha a conexão do driver do Neo4j.
        """
        if self._driver:
            self._driver.close()

    def testar_conexao(self):
        """
        Verifica se a conexão com o banco de dados pode ser estabelecida.
        """
        try:
            with self.get_session() as session:
                result = session.run("RETURN 1")
                print("Conexão com o Neo4j estabelecida com sucesso!")
                return True
        except exceptions.AuthError as e:
            print(f"Erro de autenticação: Verifique suas credenciais no arquivo .env. Detalhes: {e}")
            return False
        except exceptions.ServiceUnavailable as e:
            print(f"Erro de conexão: Não foi possível conectar ao Neo4j em {os.getenv('NEO4J_URI')}. Detalhes: {e}")
            return False
        except Exception as e:
            print(f"Ocorreu um erro inesperado ao testar a conexão: {e}")
            return False

# Bloco de teste para execução direta do script
if __name__ == "__main__":
    print("Iniciando teste de conexão com o Neo4j...")
    conector = None
    try:
        conector = ConectorNeo4j()
        if conector.testar_conexao():
            print("Teste finalizado com sucesso.")
        else:
            print("Teste falhou. Veja as mensagens de erro acima.")
    except ValueError as e:
        print(f"Erro ao inicializar o conector: {e}")
    finally:
        if conector:
            conector.close()
            print("Conexão fechada.")

const API_BASE_URL = "http://localhost:8000/api";

/**
 * Busca os dados completos da rede no backend.
 * @returns {Promise<Object>} Uma promessa que resolve para os dados da rede no formato { nós, arestas }.
 * @throws {Error} Lança um erro se a resposta da rede não for bem-sucedida.
 */
export async function buscarDadosDaRede() {
  try {
    const response = await fetch(`${API_BASE_URL}/rede`);
    if (!response.ok) {
      throw new Error(`Erro na rede: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Falha ao buscar dados da rede:", error);
    throw error;
  }
}

# Amostra de Dados do Neo4j (Cypher)

Este arquivo contém uma amostra de dados no formato de consultas Cypher `CREATE`. Estes dados podem ser usados para popular um ambiente de desenvolvimento do Neo4j, facilitando a criação e o teste da aplicação sem a necessidade de acesso ao banco de dados de produção.

O modelo de dados segue a descrição do PRD, com nós do tipo `Empresa`, `Pessoa` e `Advogado`, e relacionamentos que conectam essas entidades.

---

### Consultas Cypher para Criação de Dados

```cypher
// Limpar o banco de dados de desenvolvimento (USAR COM CUIDADO)
// MATCH (n) DETACH DELETE n;

// --- 1. Criar Empresas ---
CREATE (e1:Empresa {nome: 'TechCorp S.A.', cnpj: '11.111.111/0001-11', setor: 'Tecnologia'});
CREATE (e2:Empresa {nome: 'Soluções Financeiras Ltda.', cnpj: '22.222.222/0001-22', setor: 'Finanças'});
CREATE (e3:Empresa {nome: 'Consultoria Legal ABC', cnpj: '33.333.333/0001-33', setor: 'Serviços Jurídicos'});
CREATE (e4:Empresa {nome: 'Inovações & Investimentos', cnpj: '44.444.444/0001-44', setor: 'Investimentos'});

// --- 2. Criar Pessoas ---
CREATE (p1:Pessoa {nome: 'João Silva', cpf: '111.111.111-11'});
CREATE (p2:Pessoa {nome: 'Maria Oliveira', cpf: '222.222.222-22'});
CREATE (p3:Pessoa {nome: 'Carlos Pereira', cpf: '333.333.333-33'});
CREATE (p4:Pessoa {nome: 'Ana Souza', cpf: '444.444.444-44'});

// --- 3. Criar Advogados ---
// Note que advogados também são pessoas, então podem ter a label :Pessoa
CREATE (a1:Advogado:Pessoa {nome: 'Dr. Roberto Alves', cpf: '555.555.555-55', oab: 'SP12345'});
CREATE (a2:Advogado:Pessoa {nome: 'Dra. Beatriz Costa', cpf: '666.666.666-66', oab: 'RJ67890'});

// --- 4. Criar Relacionamentos ---

// João Silva é sócio da TechCorp e da Inovações & Investimentos
CREATE (p1)-[:SOCIO_DE {participacao: 0.6}]->(e1);
CREATE (p1)-[:SOCIO_DE {participacao: 0.4}]->(e4);

// Maria Oliveira é sócia da TechCorp
CREATE (p2)-[:SOCIO_DE {participacao: 0.4}]->(e1);

// Carlos Pereira é sócio da Soluções Financeiras e da Inovações & Investimentos
CREATE (p3)-[:SOCIO_DE {participacao: 1.0}]->(e2);
CREATE (p3)-[:SOCIO_DE {participacao: 0.6}]->(e4);

// A empresa Inovações & Investimentos é sócia (holding) da Soluções Financeiras
CREATE (e4)-[:SOCIO_DE {participacao: 0.7}]->(e2);

// Ana Souza é diretora (REPRESENTA) da TechCorp
CREATE (p4)-[:REPRESENTA {cargo: 'Diretora de Operações'}]->(e1);

// Dr. Roberto Alves é o advogado da TechCorp
CREATE (a1)-[:ADVOGADO_DE]->(e1);

// Dr. Roberto Alves também é advogado da Inovações & Investimentos
CREATE (a1)-[:ADVOGADO_DE]->(e4);

// Dra. Beatriz Costa é a advogada da Soluções Financeiras e da Consultoria Legal ABC (onde ela trabalha)
CREATE (a2)-[:ADVOGADO_DE]->(e2);
CREATE (a2)-[:REPRESENTA {cargo: 'Sócia Fundadora'}]->(e3);

// A Consultoria Legal ABC presta serviços para a TechCorp
CREATE (e3)-[:PRESTA_SERVICO_PARA {tipo: 'Consultoria Jurídica'}]->(e1);
```

### Como Usar

1.  Abra o Neo4j Browser ou Cypher Shell conectado ao seu banco de dados de desenvolvimento.
2.  Copie e cole as consultas acima.
3.  Execute as consultas.
4.  Verifique se os dados foram criados com a consulta: `MATCH (n) RETURN n;`

Este conjunto de dados cria uma pequena rede interconectada que será suficiente para testar todas as funcionalidades descritas no PRD, incluindo a detecção de comunidades (por exemplo, o grupo em torno da TechCorp e o grupo em torno da Soluções Financeiras). 
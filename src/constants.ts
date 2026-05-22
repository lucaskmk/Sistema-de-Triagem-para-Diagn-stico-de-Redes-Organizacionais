import { QuestionNode, Recommendation } from './types';

export const TREE: Record<string, QuestionNode> = {
  'T2': {
    id: 'T2',
    question: 'Escolha o caminho que você deseja seguir para o diagnóstico:',
    options: [
      {
        id: 'A',
        label: 'Papéis-chave de um funcionário',
        description: 'Quero identificar papéis-chave de um funcionário (influência, demanda, fluxo de informação ou seu ambiente pessoal na área de trabalho).',
        nextStep: 'A.0'
      },
      {
        id: 'B',
        label: 'Saúde dos times/conexões',
        description: 'Quero entender a saúde dos times e conexões da empresa (silos, trust, panelinhas ou filiais isoladas).',
        nextStep: 'B.0'
      },
      {
        id: 'C',
        label: 'Influência entre métricas (Estatística)',
        description: 'Quero entender como uma ou mais métricas influenciam uma outra (relação entre variáveis ou previsão de resultados/turnover).',
        nextStep: 'C.0'
      }
    ]
  },
  
  // FLOW A: INDIVIDUAL
  'A.0': {
    id: 'A.0',
    question: 'Qual desses grupos de dinâmica e comportamento individual você deseja mapear?',
    options: [
      { 
        id: 'A1_A2', 
        label: 'Mapear Influência e Demanda', 
        description: 'Descobrir quem são as pessoas mais requisitadas na operação por popularidade (quantidade) ou influência (qualidade).',
        nextStep: 'A.1' 
      },
      { 
        id: 'A3_A4', 
        label: 'Mapear o Fluxo de Informação', 
        description: 'Entender como as mensagens viajam pela empresa: quem espalha recados rápido ou quem controla o que passa entre as áreas.',
        nextStep: 'A.2' 
      },
      { 
        id: 'A5_A6', 
        label: 'Mapear o Ambiente Pessoal', 
        description: 'Entender a importância de um funcionário na área de trabalho e quanto ele pode impactar seus contatos (sua bolha específica).',
        nextStep: 'A.3' 
      }
    ]
  },
  'A.1': {
    id: 'A.1',
    question: 'O que importa mais para você: a qualidade dos contatos ou a quantidade deles?',
    options: [
      { 
        id: 'in_degree', 
        label: 'A referência operacional (Quantidade)', 
        description: 'Quero identificar a pessoa que tem um grande número absoluto de contatos diretos apontando para ela.', 
        recommendationId: 'rec_in_degree' 
      },
      { 
        id: 'eigenvector_pagerank', 
        label: 'A liderança simbólica ou prestígio (Qualidade)', 
        description: 'Quero identificar quem está conectado a contatos que também são muito influentes e importantes na organização.', 
        recommendationId: 'rec_eigenvector' 
      }
    ]
  },
  'A.2': {
    id: 'A.2',
    question: 'Qual perfil de fluxo de informação melhor descreve o papel que você busca mapear?',
    options: [
      { 
        id: 'betweenness', 
        label: 'O gargalo ou a ponte de caminhos', 
        description: 'O profissional que serve como ponte direta conectando duas áreas que não se falam diretamente.', 
        recommendationId: 'rec_betweenness' 
      },
      { 
        id: 'closeness', 
        label: 'O comunicador rápido', 
        description: 'Quem consegue espalhar um recado para o maior número de pessoas dentro da empresa no menor tempo médio possível.', 
        recommendationId: 'rec_closeness' 
      }
    ]
  },
  'A.3': {
    id: 'A.3',
    question: 'O que você deseja focar ao analisar a importância e impacto do funcionário em seu ambiente pessoal?',
    options: [
      { 
        id: 'structural_holes', 
        label: 'O inovador de fora da "bolha"', 
        description: 'Achar quem tem uma rede de contatos rica porque conversa com grupos diferentes que não se conhecem, trazendo ideias de outras áreas.', 
        recommendationId: 'rec_structural_holes' 
      },
      { 
        id: 'ego_networks', 
        label: 'Um raio-X individual do funcionário', 
        description: 'Análise detalhada ao redor de um funcionário específico (ex: um gerente recém-promovido) para ver como sua vizinhança mudou.', 
        recommendationId: 'rec_ego_networks' 
      }
    ]
  },

  // FLOW B: REGIONS
  'B.0': {
    id: 'B.0',
    question: 'Qual problema ou padrão você deseja analisar sobre a saúde das equipes e conexões?',
    options: [
      { 
        id: 'silos', 
        label: 'A empresa parece dividida em silos, bolhas ou grupos isolados', 
        description: 'Desejo desvendar esses grupos, quão fechados são, ou se existe uma elite que exclui a base.',
        nextStep: 'B.1' 
      },
      { 
        id: 'trust', 
        label: 'Quero saber se as pequenas equipes têm confiança mútua (se trabalham bem juntos)', 
        description: 'Análise de formação de panelinhas de alta confiança mútua onde amigos de amigos também são amigos.', 
        recommendationId: 'rec_clustering_transitividade' 
      }
    ]
  },
  'B.1': {
    id: 'B.1',
    question: 'Qual dessas situações melhor descreve o tipo de silo ou isolamento suspeitado:',
    options: [
      { 
        id: 'communities_modularity', 
        label: 'Quero entender quem são esses grupos e quão desconectados eles são da rede', 
        description: 'Detectar comunidades e entender a separação/silos reais na comunicação cotidiana.', 
        recommendationId: 'rec_communities_modularity' 
      },
      { 
        id: 'core_periphery', 
        label: 'Sinto que existe uma elite que decide tudo entre eles, enquanto a base está isolada', 
        description: 'Mapear a dinâmica de núcleo central denso contra uma periferia desorganizada.', 
        recommendationId: 'rec_core_periphery' 
      },
      { 
        id: 'isolated_components', 
        label: 'Suspeito que exista algum departamento ou filial inteira literalmente desconectado', 
        description: 'Setor operando inteiramente sozinho e sem nenhum contato (direto ou indireto) com o resto da empresa.', 
        recommendationId: 'rec_isolated_components' 
      }
    ]
  },

  // FLOW C: STATISTICS
  'C.0': {
    id: 'C.0',
    question: 'Que tipo de dinâmica ou correlação estatística você deseja verificar?',
    options: [
      { 
        id: 'hypothesis', 
        label: 'Quero só entender apenas se há uma relação', 
        description: 'Confirmar matematicamente se a diferença de conexões entre dois grupos (ex: presencial vs remoto) existe ou é obra do acaso.', 
        recommendationId: 'rec_hypothesis_testing' 
      },
      { 
        id: 'predictive', 
        label: 'Prever um RESULTADO usando várias variáveis ao mesmo tempo', 
        description: 'Criar um modelo estatístico multivariado para prever um desfecho organizacional crítico.',
        nextStep: 'C.2' 
      }
    ]
  },
  'C.2': {
    id: 'C.2',
    question: 'A métrica que você deseja prever no seu resultado (Y) é binária (ex: Sim/Não) ou não?',
    options: [
      { 
        id: 'regression_linear', 
        label: 'Não é binária (Prever um valor numérico contínuo)', 
        description: 'Prever resultados como faturamento individual, bônus recebido, nota de desempenho ou produtividade.', 
        recommendationId: 'rec_regression_linear' 
      },
      { 
        id: 'regression_logistic', 
        label: 'Sim, é binária (Prever um evento de sim ou não)', 
        description: 'Prever se o profissional vai pedir demissão (turnover: sim/não) ou se será promovido (promoção: sim/não).', 
        recommendationId: 'rec_regression_logistic' 
      }
    ]
  }
};

export const RECOMMENDATIONS: Record<string, Recommendation> = {
  'rec_in_degree': {
    id: 'rec_in_degree',
    businessTitle: 'A Referência Operacional (Degree de Entrada)',
    businessDescription: 'Identificação de colaboradores com grande volume de solicitações, dúvidas ou interações no dia a dia. Revela quem serve como a principal referência operacional e técnica.',
    justification: 'O Grau de Entrada conta quantas pessoas apontam para esse nó buscando suporte, identificando a principal referência técnica e sobrecarga.',
    technicalDetails: {
      method: 'Centralidade de Grau de Entrada (In-Degree Centrality)',
      whatItMeasures: 'Contagem direta dos caminhos/laços direcionados que apontam para um funcionário específico.',
      software: 'graph-tool (Python) / método: entry_degree'
    },
    nextSteps: ['Dimensionar cargas de trabalho', 'Compartilhamento preventivo de conhecimento', 'Evitar gargalos operacionais']
  },
  'rec_eigenvector': {
    id: 'rec_eigenvector',
    businessTitle: 'Liderança Simbólica e Prestígio de Contatos',
    businessDescription: 'Mapeia colaboradores influentes por estarem conectados a outras figuras centrais de alta liderança ou reputação dentro da organização.',
    justification: 'O nó ganha importância não por conhecer muita gente, mas por conhecer as "pessoas certas" (nós altamente centrais).',
    technicalDetails: {
      method: 'Centralidade de Autovalor (Eigenvector Centrality) / PageRank',
      whatItMeasures: 'Prestígio relativo medido de forma recursiva a partir da centralidade dos seus contatos.',
      software: 'graph-tool (Python) / função: eigenvector_centrality'
    },
    nextSteps: ['Formação de conselhos informais de decisão', 'Apoio em processos estratégicos de mudança interna']
  },
  'rec_betweenness': {
    id: 'rec_betweenness',
    businessTitle: 'Gargalos de Informação e Pontes de Comunicação',
    businessDescription: 'Descobre quem conecta diferentes áreas ou silos organizacionais que de outra forma não se conversariam.',
    justification: 'Identifica quem está nos caminhos mais curtos entre diferentes grupos. Se essa pessoa sair, a comunicação é cortada.',
    technicalDetails: {
      method: 'Centralidade de Intermediação (Betweenness Centrality)',
      whatItMeasures: 'Frequência com que o nó aparece como ponte nos caminhos mais curtos entre todos os pares.',
      software: 'graph-tool (custom pipelines) ou igraph'
    },
    nextSteps: ['Reconhecer papel de facilitador de projetos', 'Criar pontes redundantes para diminuir o risco da perda do colaborador']
  },
  'rec_closeness': {
    id: 'rec_closeness',
    businessTitle: 'Comunicadores de Alta Velocidade (Proximidade)',
    businessDescription: 'Identifica profissionais que, devido às conexões mais próximas e integradas a toda a rede, conseguem distribuir mensagens no menor tempo médio.',
    justification: 'Mede a distância geodésica média desse nó para todos os outros. Menor distância significa maior velocidade de difusão de informação.',
    technicalDetails: {
      method: 'Centralidade de Proximidade (Closeness Centrality)',
      whatItMeasures: 'O recíproco da soma de todas as distâncias de caminho necessárias para alcançar qualquer outro nó.',
      software: 'graph-tool (Python) / closeness-centrality routines'
    },
    nextSteps: ['Disseminação de políticas e nova cultura organizacional', 'Embaixadores ágeis de comunicação de projetos']
  },
  'rec_structural_holes': {
    id: 'rec_structural_holes',
    businessTitle: 'O Inovador Fora da Bolha (Buracos Estruturais)',
    businessDescription: 'Mapeia indivíduos com alta diversidade informacional, que possuem canais com grupos desligados entre si, acelerando as inovações.',
    justification: 'Diferencia-se de intermediação porque foca no ganho individual. Baixa restrição significa que a vizinhança do indivíduo não é conectada entre si (não é redundante), garantindo a ele acesso a informações diversas e potencial de inovação (Pipes and Prisms).',
    technicalDetails: {
      method: 'Baixa Restrição de Burt (Constraint / Structural Holes Theory)',
      whatItMeasures: 'Soma combinada da dependência indireta e proximidade interna de suas conexões egocentradas.',
      software: 'graph-tool (Python) / Burt\'s constraint algorithm'
    },
    nextSteps: ['Incentivar participação em ideações', 'Apoio no desenvolvimento de novos produtos e fluxos transsetoriais']
  },
  'rec_ego_networks': {
    id: 'rec_ego_networks',
    businessTitle: 'Raio-X de Vizinhança (Rede Egocentrada)',
    businessDescription: 'Foca no ambiente microestrutural direto de um profissional (Ego) e nos laços mantidos com seus contatos imediatos.',
    justification: 'Abandona a análise da rede global para focar exclusivamente na vizinhança de 1º grau (ou 2º grau) de um nó específico ("Ego" e seus "Alters"), útil para coaching e avaliações individuais de desempenho.',
    technicalDetails: {
      method: 'Redes Egocentradas (Ego Networks)',
      whatItMeasures: 'Propriedades estruturais e densidade na rede reduzida e imediata de 1º grau de um nó.',
      software: 'graph-tool (Python) / ego_network extraction'
    },
    nextSteps: ['Compreender mudanças pós-promoções', 'Coaching para novos gestores integrando suas equipes']
  },
  'rec_clustering_transitividade': {
    id: 'rec_clustering_transitividade',
    businessTitle: 'Coesão Local e Confiança Coaxial (Transitividade)',
    businessDescription: 'Mapeia a densidade de ligação local das vizinhanças dos funcionários para entender se grupos imediatos possuem alta confiança mútua.',
    justification: 'Mede se os contatos de uma pessoa se conhecem entre si, independente da rede global. Identifica se amigos de amigos também são amigos, mostrando panelinhas de alta confiança.',
    technicalDetails: {
      method: 'Coeficiente de Agrupamento Local (Local Clustering) / Transitividade',
      whatItMeasures: 'Frequência de triângulos fechados formados em torno de um nó específico.',
      software: 'graph-tool (Python) / clustering_coefficient'
    },
    nextSteps: ['Alavancar times hipercooperativos', 'Mediar panelinhas fechadas que possam gerar barreira cultural']
  },
  'rec_communities_modularity': {
    id: 'rec_communities_modularity',
    businessTitle: 'Divisão Orgânica de Silos Informais (Comunidades)',
    businessDescription: 'Particiona a empresa de forma heurística para descobrir exatamente quais são os grupos informais de comunicação operando na prática.',
    justification: 'O algoritmo de comunidades identifica grupos fechados cortando as arestas de intermediação. A modularidade quantifica estatisticamente essa separação (silos).',
    technicalDetails: {
      method: 'Detecção de Comunidades (Girvan-Newman) + Modularidade (Q)',
      whatItMeasures: 'Fracionamento espontâneo do grafo baseado na remoção de elos de maior intermediação.',
      software: 'graph-tool (funcionalidade: girvan_newman & modularity)'
    },
    nextSteps: ['Comparar organograma formal com as comunidades reais identificadas', 'Intervir em silos de comunicação integrando coordenadores de comunidades']
  },
  'rec_core_periphery': {
    id: 'rec_core_periphery',
    businessTitle: 'Monopolização da Elite (Centro-Periferia)',
    businessDescription: 'Mapeia se a empresa se organiza com uma elite fechada monopolizando as grandes decisões de comunicação enquanto o resto está isolado periférico.',
    justification: 'Distingue-se de "silos" porque mapeia um único núcleo hiperdenso (core) contrastando com uma periferia de nós que não interagem entre si.',
    technicalDetails: {
      method: 'Estrutura Centro-Periferia (Core-Periphery Model)',
      whatItMeasures: 'Aproximação matemática de uma matriz de conectividade contendo bloco central e periférico.',
      software: 'graph-tool / NetworkX packages'
    },
    nextSteps: ['Incentivar iniciativas bilaterais periféricas', 'Descentralizar a tomada de decisão para equipes satélites']
  },
  'rec_isolated_components': {
    id: 'rec_isolated_components',
    businessTitle: 'Desconexão Absoluta de Componentes e Subgrafos',
    businessDescription: 'Identifica fraturas críticas de rede onde grupos inteiros ou filiais estão completamente sem contato direto ou indireto com o componente de rede principal.',
    justification: 'Busca por componentes do grafo onde não existe nenhum caminho (nem direto, nem indireto) que os ligue ao componente gigante da rede. Mapeia a desconexão absoluta.',
    technicalDetails: {
      method: 'Detecção de Componentes Conexos Isolados',
      whatItMeasures: 'Contagem e tamanho de agrupamentos cuja interconexão com o principal componente gigante é nula.',
      software: 'graph-tool (Python) / label_components function'
    },
    nextSteps: ['Implementar canais de comunicação cross-departmental integrados', 'Reorganizar infraestrutura e ferramentas compartilhadas de colaboração']
  },
  'rec_hypothesis_testing': {
    id: 'rec_hypothesis_testing',
    businessTitle: 'Testes de Hipótese Quali-Quanti (Diferença de Distribuição)',
    businessDescription: 'Verifica estatisticamente se a diferença de conexões médias entre dois grupos do RH é cientificamente comprovada ou mero ruído amostral.',
    justification: 'Cruza uma variável de rede (Grau, quantitativa) com uma variável de RH (Presencial/Remoto, qualitativa) para provar se a diferença não é mero acaso.',
    technicalDetails: {
      method: 'Wilcoxon-Mann-Whitney ou Teste t-Student não pareado',
      whatItMeasures: 'A probabilidade da distribuição de variáveis contínuas entre duas categorias independentes possuir médias distintas.',
      software: 'SciPy (Python) / scipy.stats.mannwhitneyu'
    },
    nextSteps: ['Empregar dados empiricamente comprovados para tomada de decisão logística de RH', 'Validar impactos de novos programas de mentoria com testes antes/depois']
  },
  'rec_regression_linear': {
    id: 'rec_regression_linear',
    businessTitle: 'Previsão Preditiva Contínua (Regressão Linear Múltipla)',
    businessDescription: 'Usa a centralidade das conexões de rede para prever o retorno financeiro, nível quantitativo de vendas ou bônus auferidos pelo profissional.',
    justification: 'Usa uma variável independente contínua de rede para explicar uma variável dependente também contínua (valor financeiro).',
    technicalDetails: {
      method: 'Regressão Linear Múltipla com OLS',
      whatItMeasures: 'O impacto marginal (coeficiente beta) de variáveis de rede sobre Y contínuo controlando por tempo de empresa e setor.',
      software: 'statsmodels (Python) / sm.OLS'
    },
    nextSteps: ['Definir correlação real entre capital social acumulado e performance', 'Modelar programas de atração de potenciais focados em centralidade']
  },
  'rec_regression_logistic': {
    id: 'rec_regression_logistic',
    businessTitle: 'Previsão de Risco de Turnover e Promoção (Regressão Logística)',
    businessDescription: 'Equaciona e calcula as odds de desligamento voluntário ou subida de cargo de acordo com o grau de isolamento ou intermediação do funcionário.',
    justification: 'É o modelo ideal quando a variável de resposta (Y) é qualitativa binária (Promovido: Sim ou Não/Turnover: Sim ou Não).',
    technicalDetails: {
      method: 'Regressão Logística Multivariada (LOGIT)',
      whatItMeasures: 'Variação nas log-odds de probabilidade da ocorrência da categoria ativa binária (1) do Y analisado.',
      software: 'statsmodels (Python) / sm.Logit'
    },
    nextSteps: ['Avisar de forma preventiva gestores sobre profissionais isolados com alto risco de turnover', 'Definir trilhas inclusivas de promoção baseadas nos caminhos de lideranças']
  }
};

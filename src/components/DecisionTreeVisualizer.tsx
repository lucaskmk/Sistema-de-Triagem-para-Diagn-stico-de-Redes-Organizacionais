import { useState, useRef, useEffect, MouseEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, 
  HelpCircle, 
  Terminal, 
  User, 
  Users, 
  TrendingUp, 
  X,
  ChevronDown,
  ChevronRight,
  Cpu,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Info
} from 'lucide-react';

interface TreeNode {
  label: string;
  type: 'category' | 'question' | 'metric';
  metricName?: string;
  bizMeaning?: string;
  children?: Record<string, TreeNode>;
}

const TREE_DATA: Record<string, TreeNode> = {
  'Fluxo A: Papéis-Chave': {
    label: 'Mapear Papéis-Chave de um colaborador (Fluxo Individual)',
    type: 'category',
    children: {
      'Influência e Demanda': {
        label: 'Mapear Influência e Demanda (Quem é referência / pop)',
        type: 'question',
        children: {
          'A referência operacional (Quantidade)': {
            label: 'Identificar referência por volume direto de busca de suporte (Quantidade)',
            type: 'metric',
            metricName: 'Centralidade de Grau de Entrada (In-Degree)',
            bizMeaning: 'O Grau de Entrada conta quantas pessoas buscam esse nó para perguntas ou suporte no cotidiano, revelando a referência operacional de fato e sobrecargas estruturais.'
          },
          'A liderança simbólica ou prestígio (Qualidade)': {
            label: 'Identificar liderança informal conectada com quem já é influente (Qualidade)',
            type: 'metric',
            metricName: 'Centralidade de Autovalor (Eigenvector) / PageRank',
            bizMeaning: 'O profissional ganha relevância não pela quantidade absoluta de contatos, mas por estar conectado a pessoas altamente influentes. Ideal para achar formadores de opinião.'
          }
        }
      },
      'Fluxo de Informação': {
        label: 'Mapear o Fluxo de Informação (Como circulam recados)',
        type: 'question',
        children: {
          'O gargalo ou a ponte de caminhos': {
            label: 'Pessoa que serve como canal exclusivo conectando dois grupos isolados',
            type: 'metric',
            metricName: 'Centralidade de Intermediação (Betweenness)',
            bizMeaning: 'Mede a frequência com que o profissional está presente nos caminhos mais curtos de comunicação entre setores. Sem ele, a integração interdepartamental trava.'
          },
          'O comunicador rápido': {
            label: 'Pessoa que consegue disseminar recados para toda a rede no menor tempo',
            type: 'metric',
            metricName: 'Centralidade de Proximidade (Closeness)',
            bizMeaning: 'Calcula a média de saltos (distância mais curta) para alcançar qualquer outro colaborador. Quanto menor a distância média, mais rápido o contágio de informação.'
          }
        }
      },
      'Ambiente Pessoal': {
        label: 'Mapear o Ambiente Pessoal (Ego Networks / Bolha)',
        type: 'question',
        children: {
          'O inovador de fora da "bolha"': {
            label: 'Verificar se o colaborador possui múltiplos contatos não-redundantes',
            type: 'metric',
            metricName: 'Baixa Restrição de Burt (Structural Holes)',
            bizMeaning: 'Avalia a teoria dos buracos estruturais. Baixa restrição significa que a vizinhança direta não é interconectada, gerando acesso a ideias diversas e inovação.'
          },
          'Um raio-X individual do funcionário': {
            label: 'Visualizar detalhadamente a vizinhança local de um só indivíduo na rede',
            type: 'metric',
            metricName: 'Redes Egocentradas (Ego Networks)',
            bizMeaning: 'Concentra-se na rede do próprio funcionário (Ego) e de seus vizinhos de 1º grau (Alters). Útil para acompanhamento pós-promoção e coaching de liderança.'
          }
        }
      }
    }
  },
  'Fluxo B: Saúde de Equipes': {
    label: 'Saúde dos times e conexões gerais (Fluxo Coletivo)',
    type: 'category',
    children: {
      'Silos, bolhas ou grupos isolados': {
        label: 'Mapeamento de Isolamento, Silos e Divisões na empresa',
        type: 'question',
        children: {
          'Quero entender quem são esses grupos': {
            label: 'Identificar a segmentação orgânica dos times no dia a dia informal',
            type: 'metric',
            metricName: 'Detecção de Comunidades (Girvan-Newman) + Modularidade (Q)',
            bizMeaning: 'Heurística que encontra agrupamentos coesos na prática de comunicação. O índice de Modularidade quantifica se esses silos são graves ou naturais.'
          },
          'Sinto que existe uma elite central': {
            label: 'Testar se há um grupo restrito decidindo tudo enquanto a base está isolada',
            type: 'metric',
            metricName: 'Estrutura Centro-Periferia (Core-Periphery)',
            bizMeaning: 'Foca na segregação vertical. Segmenta o time em uma elite hiperconectada (core) e uma maioria de membros pouco engajados entre si (periferia).'
          },
          'Departamento / Filial desconetado': {
            label: 'Foco na busca de componentes ou subgrupos com zero interligação com o core',
            type: 'metric',
            metricName: 'Detecção de Componentes Isolados e Subgrafos',
            bizMeaning: 'Algoritmo que localiza seções da empresa operando em total isolamento informacional, isto é, com ausência completa de caminhos para a base gigante.'
          }
        }
      },
      'Confiança mútua nas pequenas equipes': {
        label: 'Mapeamento de Segurança Psicológica de Microteams',
        type: 'question',
        children: {
          'Amigos de amigos se conhecem': {
            label: 'Assegurar que pessoas do time confiam mutuamente e dividem rotinas',
            type: 'metric',
            metricName: 'Coeficiente de Agrupamento Local (Transitividade na vizinhança)',
            bizMeaning: 'Indica a proporção de triângulos fechados de suporte. Se os meus contatos se ajudam mutuamente de forma direta, o time possui alta coesão e confiança.'
          }
        }
      }
    }
  },
  'Fluxo C: Correlação e Modelos': {
    label: 'Influência entre métricas (Estatística e Modelagem)',
    type: 'category',
    children: {
      'Relação simples entre duas frentes': {
        label: 'Verificar se existe correlação empírica significativa',
        type: 'question',
        children: {
          'Compara Distribuições de RH': {
            label: 'Comprovar relações qualitativas vs quantitativas (ex: presencial vs remoto)',
            type: 'metric',
            metricName: 'Testes de Hipótese (Wilcoxon-Mann-Whitney)',
            bizMeaning: 'Tratamento estatístico adequado para provar formalmente se distribuições de métricas de rede (centralidades) realmente diferem entre grupos do RH.'
          }
        }
      },
      'Previsão Multivariada de Resultados': {
        label: 'Explicar/Prever desfechos organizacionais (ex: turnover, performance)',
        type: 'question',
        children: {
          'Não é binária (Prever val. contínuo)': {
            label: 'Prever valores exatos contínuos (ex: faturamento individual ou bônus)',
            type: 'metric',
            metricName: 'Regressão Linear Múltipla (OLS)',
            bizMeaning: 'Modelagem estatística robusta que analisa como cada ponto de centralidade de rede contribui para prever retornos de performance financeira.'
          },
          'Sim, é binária (Prever Sim ou Não)': {
            label: 'Prever eventos discretos booleanos binários (ex: pediu demissão ou promovido)',
            type: 'metric',
            metricName: 'Regressão Logística Múltipla (LOGIT)',
            bizMeaning: 'Calcula matematicamente o risco real de turnover (log-odds) em função do nível de isolamento do colaborador na área, gerando alertas preventivos.'
          }
        }
      }
    }
  }
};

function VisualizerMetricNode({ label, metricName, bizMeaning }: { label: string, metricName: string, bizMeaning: string, key?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm text-left max-w-sm w-80 mx-auto select-none">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest block">Método Recomendado</span>
        <h5 className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-2 leading-snug">{label}</h5>
        
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-2.5 mt-1">
          <div className="flex items-center gap-1.5 text-blue-700 font-mono text-[10px] uppercase font-bold mb-0.5">
            <Cpu size={12} />
            {metricName}
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-all border border-slate-100 mt-1"
        >
          <span>{isOpen ? 'Esconder Justificativa' : 'Ver Justificativa'}</span>
          {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="text-[11px] leading-relaxed text-slate-600 mt-2 bg-slate-50 p-3 rounded-xl border border-dashed border-slate-200">
                {bizMeaning}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Tree builder rendered horizontally and vertically to create a perfect diagrammatic tree
export default function DecisionTreeVisualizer({ onClose }: { onClose: () => void }) {
  const [activeCategory, setActiveCategory] = useState<string>(Object.keys(TREE_DATA)[0]);
  const [zoom, setZoom] = useState<number>(0.9);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMenuBarHovered, setIsMenuBarHovered] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    // Only scroll if middle click or left click
    if (e.button !== 0) return;
    setIsPanning(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: any) => {
    e.preventDefault();
    const scaleFactor = 0.05;
    const direction = e.deltaY < 0 ? 1 : -1;
    setZoom(prev => Math.min(1.5, Math.max(0.5, prev + direction * scaleFactor)));
  };

  // Prevent default behavior to enable mouse wheel zoom
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const preventSelect = (e: WheelEvent) => {
      e.preventDefault();
    };
    el.addEventListener('wheel', preventSelect, { passive: false });
    return () => {
      el.removeEventListener('wheel', preventSelect);
    };
  }, []);

  const centerAndFitTree = () => {
    if (viewportRef.current) {
      const vWidth = viewportRef.current.clientWidth;
      const curData = TREE_DATA[activeCategory];
      const widths = Object.values(curData.children || {}).map(getColWidth);
      const maxColW = Math.max(...widths, 340);
      const cols = Object.keys(curData.children || {}).length;
      const activeTotalWidth = cols * maxColW + (cols - 1) * 48;
      
      const targetWidth = vWidth - 64; // 32px safe horizontal margin
      let startZoom = 0.85;
      
      if (activeTotalWidth > targetWidth) {
        startZoom = Math.max(0.4, targetWidth / activeTotalWidth);
      }
      
      setZoom(parseFloat(startZoom.toFixed(2)));
      setPan({ x: 0, y: 20 }); // perfect top margin spacing for the top center origin
    }
  };

  const resetViewport = () => {
    centerAndFitTree();
  };

  // Run on active category switch or full screen toggle
  useEffect(() => {
    centerAndFitTree();
    const timer = setTimeout(() => {
      centerAndFitTree();
    }, 150);
    return () => clearTimeout(timer);
  }, [activeCategory, isFullScreen]);

  // Run once on load
  useEffect(() => {
    const timer = setTimeout(() => {
      centerAndFitTree();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const categoryData = TREE_DATA[activeCategory];

  // Helper inside component to calculate dynamic column formatting and line math
  const getColWidth = (qNode: any) => {
    const leafCount = qNode.children ? Object.keys(qNode.children).length : 1;
    // Each leaf takes exactly 340px of space, plus a gap of 48px to allow full breathing room
    return leafCount * 340 + (leafCount - 1) * 48;
  };

  const colWidths = Object.values(categoryData.children || {}).map(getColWidth);
  const colWidth = Math.max(...colWidths, 340);
  const totalCols = Object.keys(categoryData.children || {}).length;
  const colGaps = 48;
  const totalWidth = totalCols * colWidth + (totalCols - 1) * colGaps;

  return (
    <div className={`bg-slate-50 text-slate-800 overflow-hidden flex flex-col transition-all duration-300 ${
      isFullScreen 
        ? 'fixed inset-0 z-50 h-screen w-screen rounded-none' 
        : 'rounded-3xl border border-slate-200/80 shadow-2xl h-[85vh] md:h-[80vh] w-full'
    }`}>
      {/* Visualizer Header - hidden in Full Screen per user request */}
      {!isFullScreen && (
        <div className="p-5 bg-white border-b border-slate-200/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl border border-blue-100">
              <Network className="text-blue-600 w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight">Árvore Diagnóstica (SNA)</h3>
              <p className="text-slate-550 text-xs mt-0.5">Tradutor oficial entre perguntas de negócio e métricas matemáticas.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-150 text-slate-650 hover:text-slate-800 rounded-xl text-xs font-bold border border-slate-200 transition-all shadow-sm"
              title={isFullScreen ? "Sair da Tela Cheia" : "Ver em Tela Cheia"}
            >
              {isFullScreen ? (
                <>
                  <Minimize2 size={14} className="text-blue-600" />
                  <span className="hidden sm:inline">Sair Tela Cheia</span>
                </>
              ) : (
                <>
                  <Maximize2 size={14} className="text-blue-600" />
                  <span className="hidden sm:inline">Tela Cheia</span>
                </>
              )}
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-150 rounded-full transition-colors"
              aria-label="Confirm"
            >
              <X className="w-4 h-4 text-slate-500 hover:text-slate-800" />
            </button>
          </div>
        </div>
      )}

      {/* Invisible Hover Trigger Strip at the top of the canvas in Full Screen to trigger the sliding menu */}
      {isFullScreen && (
        <div 
          onMouseEnter={() => setIsMenuBarHovered(true)}
          className="absolute top-0 left-0 right-0 h-6 z-30 cursor-pointer"
        />
      )}

      {/* Category Selection Bar */}
      <div 
        onMouseEnter={() => setIsMenuBarHovered(true)}
        onMouseLeave={() => setIsMenuBarHovered(false)}
        className={`transition-all duration-300 ${
          isFullScreen 
            ? 'absolute left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-40 flex flex-row items-center gap-1.5' 
            : 'grid grid-cols-3 bg-white border-b border-slate-150/80 text-center flex-shrink-0'
        }`}
        style={isFullScreen ? {
          top: isMenuBarHovered ? '24px' : '-80px',
          opacity: isMenuBarHovered ? 1 : 0,
          pointerEvents: isMenuBarHovered ? 'auto' : 'none',
        } : undefined}
      >
        {Object.entries(TREE_DATA).map(([catKey, catVal]) => {
          const isActive = activeCategory === catKey;
          const labelMap: Record<string, string> = {
            'Fluxo A: Papéis-Chave': 'Individual',
            'Fluxo B: Saúde de Equipes': 'Bolhas',
            'Fluxo C: Correlação e Modelos': 'Análise'
          };
          const tabName = labelMap[catKey] || catKey;
          return (
            <button
              key={catKey}
              onClick={() => {
                setActiveCategory(catKey);
                resetViewport();
              }}
              className={`transition-all duration-200 flex items-center justify-center gap-1.5 ${
                isFullScreen 
                  ? `px-5 py-2 text-xs font-bold rounded-xl ${
                      isActive 
                        ? 'bg-blue-600 text-white shadow-md font-extrabold' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  : `py-3.5 px-2 text-xs font-bold transition-all flex flex-col sm:flex-row border-r border-slate-150 last:border-r-0 ${
                      isActive 
                        ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600 font-extrabold' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                    }`
              }`}
            >
              {catKey.includes('A') && <User size={14} className="flex-shrink-0" />}
              {catKey.includes('B') && <Users size={14} className="flex-shrink-0" />}
              {catKey.includes('C') && <TrendingUp size={14} className="flex-shrink-0" />}
              <span className="truncate">{tabName}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Whiteboard Canvas Container */}
      <div className="relative flex-1 bg-slate-50 overflow-hidden select-none">
        
        {/* Floating Zoom Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center bg-white/95 border border-slate-300/80 p-1.5 rounded-full shadow-md gap-1">
          <button
            onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-650 transition-colors"
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-650 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            onClick={resetViewport}
            className="p-1.5 hover:bg-slate-100 rounded-full text-slate-650 transition-colors text-[10px] font-bold leading-none px-2"
            title="Reajustar Visualização"
          >
            100%
          </button>
          <div className="w-[1px] h-4 bg-slate-200 mx-0.5" />
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className="p-1.5 hover:bg-slate-105 rounded-full text-slate-650 hover:text-slate-800 transition-colors"
            title={isFullScreen ? "Sair da Tela Cheia" : "Ver em Tela Cheia"}
          >
            {isFullScreen ? <Minimize2 size={14} className="text-blue-600" /> : <Maximize2 size={14} className="text-blue-600" />}
          </button>
          {isFullScreen && (
            <>
              <div className="w-[1px] h-4 bg-slate-200 mx-0.5" />
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-red-50 rounded-full text-red-500 hover:text-red-700 transition-colors"
                title="Fechar Dashboard"
              >
                <X size={14} />
              </button>
            </>
          )}
        </div>

        {/* Floating Info Note */}
        <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-xl py-2 px-3 shadow-md max-w-[280px]">
          <div className="flex items-start gap-1.5 text-slate-600">
            <Info size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] leading-relaxed">
              Arraste para mover, use a roda do mouse ou botões acima para aplicar <strong>Zoom In / Out</strong>.
            </p>
          </div>
        </div>

        {/* Canvas Workspace */}
        <div
          ref={viewportRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onWheel={handleWheel}
          className={`w-full h-full relative overflow-hidden bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] ${
            isPanning ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {/* Animated Zooming Layer holding the whole tree */}
          <motion.div
            style={{
              width: `${totalWidth}px`,
              left: '50%',
              marginLeft: `-${totalWidth / 2}px`,
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: 'top center',
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute top-8 flex flex-col items-center justify-start space-y-16"
          >
            {/* Tree Root Block (Category chosen) */}
            <div className="bg-blue-600 text-white font-bold text-xs sm:text-sm px-6 py-4 rounded-2xl shadow-lg border border-blue-700 min-w-[280px] max-w-[340px] text-center z-10 relative">
              <span className="text-[9px] text-blue-200 font-extrabold uppercase tracking-widest block mb-1">Fluxo de Diagnóstico</span>
              {categoryData.label}
            </div>

            {/* Sub-group Branches (Row of Question Boxes) */}
            <div 
              style={{ width: `${totalWidth}px` }}
              className="relative flex flex-row items-stretch justify-center gap-[48px]"
            >
              {/* Single vertical line coming down from Root card to horizontal bar */}
              <div className="absolute -top-[64px] left-1/2 -translate-x-1/2 w-[2px] h-[32px] bg-slate-300" />
              
              {/* Horizontal line connecting all primary question pathways */}
              {totalCols > 1 && (
                <div 
                  className="absolute -top-[32px] h-[2px] bg-slate-300 hidden md:block" 
                  style={{
                    left: `${colWidth / 2}px`,
                    right: `${colWidth / 2}px`
                  }}
                />
              )}
              
              {/* Question Nodes mapping */}
              {Object.entries(categoryData.children || {}).map(([qKey, qNode], qIdx) => {
                const hasNextChildren = qNode.children && Object.keys(qNode.children).length > 0;
                
                return (
                  <div 
                    key={qKey} 
                    style={{ width: `${colWidth}px` }}
                    className="flex-shrink-0 flex flex-col items-center relative gap-12"
                  >
                    {/* Small vertical connector from parent horizontal line to the question card */}
                    <div className="absolute -top-[32px] w-[2px] h-[32px] bg-slate-300 hidden md:block" />
                    
                    {/* Intermediate Question Card */}
                    <div className="relative z-10 w-80 mx-auto">
                      <div className="bg-white border border-slate-200 shadow-md rounded-2xl p-5 text-center hover:border-slate-300 transition-colors">
                        <span className="text-[9px] text-blue-600 font-bold uppercase tracking-widest block mb-1">Passo Diagnóstico</span>
                        <h4 className="font-bold text-slate-800 text-xs sm:text-xs leading-normal">{qNode.label}</h4>
                      </div>
                      {/* Sub level branch line coming from question card down to sibling choices */}
                      {hasNextChildren && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-[2px] h-[48px] bg-slate-300 hidden md:block" />
                      )}
                    </div>

                    {/* Grandchildren level nodes (Leaf options leading to metrics) */}
                    {hasNextChildren && (
                      <div className="relative flex flex-row items-stretch justify-center gap-[48px] pt-10 w-full z-10">
                        {/* Connecting horizontal line between sibling choices (hidden on mobile, centered on desktop) */}
                        {Object.keys(qNode.children || {}).length > 1 && (
                          <div 
                            className="absolute top-0 h-[2px] bg-slate-300 hidden md:block" 
                            style={{
                              left: `${100 / (2 * Object.keys(qNode.children || {}).length)}%`,
                              right: `${100 / (2 * Object.keys(qNode.children || {}).length)}%`
                            }}
                          />
                        )}
                        
                        {Object.entries(qNode.children || {}).map(([leafKey, leafNode]) => {
                          const hasMetricChildren = leafNode.children && Object.keys(leafNode.children).length > 0;

                          return (
                            <div key={leafKey} className="flex flex-col items-center gap-4 relative w-[340px] flex-shrink-0">
                              {/* Small vertical connector from sister line to leaf card */}
                              <div className="absolute -top-10 w-[2px] h-10 bg-slate-300 hidden md:block" />
                              
                              {/* Option Question / Option selected Box */}
                              <div className="bg-slate-100 hover:bg-slate-200/85 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 w-full text-center text-xs font-semibold leading-normal shadow-xs transition-colors relative z-10">
                                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide block mb-0.5">Opção Escolhida</span>
                                {leafNode.label}
                              </div>

                              {/* Small vertical link to the final metric below */}
                              <div className="w-[2px] h-6 bg-slate-300" />

                              {/* Metric component directly */}
                              {hasMetricChildren ? (
                                <div className="space-y-4 w-full relative z-10">
                                  {Object.entries(leafNode.children || {}).map(([metricKey, metricNode]) => (
                                    <VisualizerMetricNode
                                      key={metricKey}
                                      label={metricKey}
                                      metricName={metricNode.metricName || ''}
                                      bizMeaning={metricNode.bizMeaning || ''}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <div className="w-full relative z-10">
                                  <VisualizerMetricNode
                                    label={leafKey}
                                    metricName={leafNode.metricName || ''}
                                    bizMeaning={leafNode.bizMeaning || ''}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer Details */}
      <div className="p-3 bg-white border-t border-slate-150 flex items-center justify-between text-[10px] text-slate-400 font-mono flex-shrink-0">
        <span>Insper Network Hub Diagram Canvas</span>
        <span className="flex items-center gap-1 font-sans font-bold text-slate-500 uppercase">
          <Terminal size={12} className="text-blue-600" /> Tradutor Metodológico
        </span>
      </div>
    </div>
  );
}

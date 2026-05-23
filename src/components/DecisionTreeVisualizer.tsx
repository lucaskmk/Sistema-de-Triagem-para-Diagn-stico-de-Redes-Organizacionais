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
    label: 'Quero identificar papéis-chave de um funcionário (influência, demanda, fluxo de informação ou seu ambiente pessoal na área de trabalho).',
    type: 'category',
    children: {
      'Mapear Influência e Demanda': {
        label: 'Descobrir quem são as pessoas mais requisitadas na operação por popularidade (quantidade) ou influência (qualidade).',
        type: 'question',
        children: {
          'A referência operacional (Quantidade)': {
            label: 'Quero identificar a pessoa que tem um grande número absoluto de contatos diretos apontando para ela.',
            type: 'metric',
            metricName: 'Centralidade de Grau de Entrada (In-Degree)',
            bizMeaning: 'O Grau de Entrada conta quantas pessoas buscam esse nó para perguntas ou suporte no cotidiano, revelando a referência operacional de fato e sobrecargas estruturais.'
          },
          'A liderança simbólica ou prestígio (Qualidade)': {
            label: 'Quero identificar quem está conectado a contatos que também são muito influentes e importantes na organização.',
            type: 'metric',
            metricName: 'Centralidade de Autovalor (Eigenvector) / PageRank',
            bizMeaning: 'O profissional ganha relevância não pela quantidade absoluta de contatos, mas por estar conectado a pessoas altamente influentes. Ideal para achar formadores de opinião.'
          }
        }
      },
      'Mapear o Fluxo de Informação': {
        label: 'Entender como as mensagens viajam pela empresa: quem espalha recados rápido ou quem controla o que passa entre as áreas.',
        type: 'question',
        children: {
          'O gargalo ou a ponte de caminhos': {
            label: 'O profissional que serve como ponte direta conectando duas áreas que não se falam diretamente.',
            type: 'metric',
            metricName: 'Centralidade de Intermediação (Betweenness)',
            bizMeaning: 'Mede a frequência com que o profissional está presente nos caminhos mais curtos de comunicação entre setores. Sem ele, a integração interdepartamental trava.'
          },
          'O comunicador rápido': {
            label: 'Quem consegue espalhar um recado para o maior número de pessoas dentro da empresa no menor tempo médio possível.',
            type: 'metric',
            metricName: 'Centralidade de Proximidade (Closeness)',
            bizMeaning: 'Calcula a média de saltos (distância mais curta) para alcançar qualquer outro colaborador. Quanto menor a distância média, mais rápido o contágio de informação.'
          }
        }
      },
      'Mapear o Ambiente Pessoal': {
        label: 'Entender a importância de um funcionário na área de trabalho e quanto ele pode impactar seus contatos (sua bolha específica).',
        type: 'question',
        children: {
          'O inovador de fora da bolha': {
            label: 'Achar quem tem uma rede de contatos rica porque conversa com grupos diferentes que não se conhecem, trazendo ideias de outras áreas.',
            type: 'metric',
            metricName: 'Baixa Restrição de Burt (Structural Holes)',
            bizMeaning: 'Avalia a teoria dos buracos estruturais. Baixa restrição significa que a vizinhança direta não é interconectada, gerando acesso a ideias diversas e inovação.'
          },
          'Um raio-X individual do funcionário': {
            label: 'Análise detalhada ao redor de um funcionário específico (ex: um gerente recém-promovido) para ver como sua vizinhança mudou.',
            type: 'metric',
            metricName: 'Redes Egocentradas (Ego Networks)',
            bizMeaning: 'Concentra-se na rede do próprio funcionário (Ego) e de seus vizinhos de 1º grau (Alters). Útil para acompanhamento pós-promoção e coaching de liderança.'
          }
        }
      }
    }
  },
  'Fluxo B: Saúde de Equipes': {
    label: 'Quero entender a saúde dos times e conexões da empresa (silos, trust, panelinhas ou filiais isoladas).',
    type: 'category',
    children: {
      'Qual problema ou padrão você quer analisar?': {
        label: 'Qual problema ou padrão você deseja analisar sobre a saúde das equipes e conexões?',
        type: 'question',
        children: {
          'A empresa parece dividida em silos, bolhas ou grupos isolados': {
            label: 'A empresa parece dividida em silos, bolhas ou grupos isolados',
            type: 'question',
            children: {
              'Quero entender quem são esses grupos e quão desconectados eles são da rede': {
                label: 'Quero entender quem são esses grupos e quão desconectados eles são da rede',
                type: 'metric',
                metricName: 'Detecção de Comunidades (Girvan-Newman) + Modularidade (Q)',
                bizMeaning: 'Heurística que encontra agrupamentos coesos na prática de comunicação. O índice de Modularidade quantifica se esses silos são graves ou naturais.'
              },
              'Sinto que existe uma elite que decide tudo entre eles, enquanto a base está isolada': {
                label: 'Sinto que existe uma elite que decide tudo entre eles, enquanto a base está isolada',
                type: 'metric',
                metricName: 'Estrutura Centro-Periferia (Core-Periphery)',
                bizMeaning: 'Foca na segregação vertical. Segmenta o time em uma elite hiperconectada (core) e uma maioria de membros pouco engajados entre si (periferia).'
              },
              'Suspeito que exista algum departamento ou filial inteira literalmente desconectado': {
                label: 'Suspeito que exista algum departamento ou filial inteira literalmente desconectado',
                type: 'metric',
                metricName: 'Detecção de Componentes Isolados e Subgrafos',
                bizMeaning: 'Algoritmo que localiza seções da empresa operando em total isolamento informacional, isto é, com ausência completa de caminhos para a base gigante.'
              }
            }
          },
          'Quero saber se as pequenas equipes têm confiança mútua (se trabalham bem juntos)': {
            label: 'Quero saber se as pequenas equipes têm confiança mútua (se trabalham bem juntos)',
            type: 'metric',
            metricName: 'Coeficiente de Agrupamento Local (Transitividade na vizinhança)',
            bizMeaning: 'Indica a proporção de triângulos fechados de suporte. Se os meus contatos se ajudam mutuamente de forma direta, o time possui alta coesão e confiança.'
          }
        }
      }
    }
  },
  'Fluxo C: Correlação e Modelos': {
    label: 'Quero entender como uma ou mais métricas influenciam uma outra (relação entre variáveis ou previsão de resultados/turnover).',
    type: 'category',
    children: {
      'Que tipo de correlação ou modelo você quer verificar?': {
        label: 'Que tipo de dinâmica ou correlação estatística você deseja verificar?',
        type: 'question',
        children: {
          'Quero só entender apenas se há uma relação': {
            label: 'Quero só entender apenas se há uma relação',
            type: 'metric',
            metricName: 'Testes de Hipótese (Wilcoxon-Mann-Whitney)',
            bizMeaning: 'Tratamento estatístico adequado para provar formalmente se distribuições de métricas de rede (centralidades) realmente diferem entre grupos do RH.'
          },
          'Prever um RESULTADO usando várias variáveis ao mesmo tempo': {
            label: 'Prever um RESULTADO usando várias variáveis ao mesmo tempo',
            type: 'question',
            children: {
              'Não é binária (Prever um valor numérico contínuo)': {
                label: 'Não é binária (Prever um valor numérico contínuo)',
                type: 'metric',
                metricName: 'Regressão Linear Múltipla (OLS)',
                bizMeaning: 'Modelagem estatística robusta que analisa como cada ponto de centralidade de rede contribui para prever retornos de performance financeira.'
              },
              'Sim, é binária (Prever um evento de sim ou não)': {
                label: 'Sim, é binária (Prever um evento de sim ou não)',
                type: 'metric',
                metricName: 'Regressão Logística Múltipla (LOGIT)',
                bizMeaning: 'Calcula matematicamente o risco real de turnover (log-odds) em função do nível de isolamento do colaborador na área, gerando alertas preventivos.'
              }
            }
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
  const lastTouchDist = useRef<number | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
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

  // Prevent default to enable wheel zoom + touch pan/pinch
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => { e.preventDefault(); };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        setIsPanning(true);
        dragStart.current = {
          x: e.touches[0].clientX - pan.x,
          y: e.touches[0].clientY - pan.y,
        };
        lastTouchDist.current = null;
      } else if (e.touches.length === 2) {
        setIsPanning(false);
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDist.current = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        setPan({
          x: e.touches[0].clientX - dragStart.current.x,
          y: e.touches[0].clientY - dragStart.current.y,
        });
      } else if (e.touches.length === 2 && lastTouchDist.current !== null) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const delta = dist - lastTouchDist.current;
        lastTouchDist.current = dist;
        setZoom((prev: number) => Math.min(1.5, Math.max(0.3, prev + delta * 0.005)));
      }
    };

    const onTouchEnd = () => {
      setIsPanning(false);
      lastTouchDist.current = null;
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [pan]);

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
    if (!qNode.children) return 340;
    const slots = Object.values(qNode.children as Record<string, any>).reduce((acc: number, leaf: any) => {
      if (leaf.type === 'question' && leaf.children && Object.keys(leaf.children).length > 0) {
        return acc + Object.keys(leaf.children).length;
      }
      return acc + 1;
    }, 0);
    return slots * 340 + (slots - 1) * 48;
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
                    {hasNextChildren && (() => {
                      const leafWidthsList = Object.values(qNode.children || {}).map((leaf: any) => {
                        if (leaf.type === 'question' && leaf.children && Object.keys(leaf.children).length > 0) {
                          const sc = Object.keys(leaf.children).length;
                          return sc * 340 + (sc - 1) * 48;
                        }
                        return 340;
                      });
                      const firstLeafW = leafWidthsList[0] || 340;
                      const lastLeafW = leafWidthsList[leafWidthsList.length - 1] || 340;

                      return (
                        <div className="relative flex flex-row items-start justify-center gap-[48px] pt-10 w-full z-10">
                          {Object.keys(qNode.children || {}).length > 1 && (
                            <div
                              className="absolute top-0 h-[2px] bg-slate-300 hidden md:block"
                              style={{ left: `${firstLeafW / 2}px`, right: `${lastLeafW / 2}px` }}
                            />
                          )}

                          {Object.entries(qNode.children || {}).map(([leafKey, leafNode]) => {
                            const isSubQuestion = leafNode.type === 'question' && !!leafNode.children && Object.keys(leafNode.children).length > 0;
                            const hasMetricChildren = !isSubQuestion && !!leafNode.children && Object.keys(leafNode.children).length > 0;
                            const subSlots = isSubQuestion ? Object.keys(leafNode.children || {}).length : 1;
                            const leafW = subSlots * 340 + (subSlots - 1) * 48;

                            return (
                              <div key={leafKey} className="flex flex-col items-center gap-4 relative flex-shrink-0" style={{ width: `${leafW}px` }}>
                                <div className="absolute -top-10 w-[2px] h-10 bg-slate-300 hidden md:block" />

                                <div className="bg-slate-100 hover:bg-slate-200/85 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 max-w-[340px] w-full mx-auto text-center text-xs font-semibold leading-normal shadow-xs transition-colors relative z-10">
                                  <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide block mb-0.5">Opção Escolhida</span>
                                  {leafNode.label}
                                </div>

                                {isSubQuestion ? (
                                  <div className="relative flex flex-row items-start justify-center gap-[48px] pt-10 w-full z-10">
                                    <div className="absolute -top-[40px] left-1/2 -translate-x-1/2 w-[2px] h-[20px] bg-slate-300 hidden md:block" />
                                    {subSlots > 1 && (
                                      <div
                                        className="absolute top-0 h-[2px] bg-slate-300 hidden md:block"
                                        style={{ left: `${340 / 2}px`, right: `${340 / 2}px` }}
                                      />
                                    )}
                                    {Object.entries(leafNode.children || {}).map(([subKey, subNode]) => (
                                      <div key={subKey} className="flex flex-col items-center gap-4 relative w-[340px] flex-shrink-0">
                                        <div className="absolute -top-10 w-[2px] h-10 bg-slate-300 hidden md:block" />
                                        <div className="bg-slate-100 hover:bg-slate-200/85 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 w-full text-center text-xs font-semibold leading-normal shadow-xs transition-colors relative z-10">
                                          <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wide block mb-0.5">Opção Escolhida</span>
                                          {subNode.label}
                                        </div>
                                        <div className="w-[2px] h-6 bg-slate-300" />
                                        <VisualizerMetricNode
                                          label={subKey}
                                          metricName={subNode.metricName || ''}
                                          bizMeaning={subNode.bizMeaning || ''}
                                        />
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <>
                                    <div className="w-[2px] h-6 bg-slate-300" />
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
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
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

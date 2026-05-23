import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Users, 
  Network, 
  BarChart3, 
  ChevronRight, 
  ArrowLeft, 
  Info, 
  Target, 
  CheckCircle2, 
  Activity,
  User,
  LayoutGrid,
  Map
} from 'lucide-react';
import { useState } from 'react';
import { TREE, RECOMMENDATIONS } from './constants';
import { RelationType, QuestionNode, Recommendation } from './types';
import DecisionTreeVisualizer from './components/DecisionTreeVisualizer';

// --- Components ---

const Landing = ({ onStart, onViewTree }: { onStart: () => void, onViewTree: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="max-w-3xl mx-auto text-center py-12 px-4"
  >
    <div className="mb-8 inline-flex p-4 bg-blue-50 rounded-2xl">
      <Network className="w-12 h-12 text-blue-600" />
    </div>
    <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
      Diagnóstico organizacional baseado em conexões
    </h1>
    <p className="text-xl text-slate-600 mb-10 leading-relaxed">
      Descubra como as pessoas, áreas e times realmente se relacionam dentro da sua organização — 
      e o que isso significa para liderança, comunicação, inovação e retenção.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
      <button 
        onClick={onStart}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 shadow-lg shadow-blue-200 flex items-center gap-2"
      >
        Começar diagnóstico <ChevronRight className="w-5 h-5" />
      </button>
      <button 
        onClick={onViewTree}
        className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-semibold text-lg transition-all flex items-center gap-2"
      >
        <Map className="w-5 h-5 text-slate-400" /> Ver Árvore de Decisão
      </button>
    </div>
  </motion.div>
);

const Onboarding = ({ onNext }: { onNext: (data: any) => void }) => {
  const [sector, setSector] = useState('');
  const [size, setSize] = useState('');
  const [relation, setRelation] = useState<RelationType | ''>('');

  const canContinue = sector && size && relation;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-100"
    >
      <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Building2 className="text-blue-600" /> Contexto da empresa
      </h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Setor da empresa</label>
          <select 
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Selecione...</option>
            <option value="tech">Tecnologia / Software</option>
            <option value="finance">Financeiro / Bancos</option>
            <option value="industry">Indústria / Manufatura</option>
            <option value="retail">Varejo</option>
            <option value="services">Serviços / Consultoria</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Nº aproximado de colaboradores</label>
          <input 
            type="number"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="Ex: 150"
            className="w-full p-3 rounded-lg border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3 underline decoration-blue-200">
            Qual tipo de relação será mapeada?
          </label>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'help', label: 'Quem pede ajuda para quem em assuntos do trabalho' },
              { id: 'communication', label: 'Quem conversa com frequência sobre tarefas' },
              { id: 'trust', label: 'Quem confia em quem para discutir assuntos sensíveis' },
              { id: 'hierarchy', label: 'Quem se reporta a quem (formal/organograma)' },
              { id: 'other', label: 'Outro' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setRelation(opt.id as RelationType)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  relation === opt.id 
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' 
                    : 'border-slate-100 bg-white hover:border-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button 
        disabled={!canContinue}
        onClick={() => onNext({ sector, size, relation })}
        className="w-full mt-8 bg-blue-600 disabled:bg-slate-300 text-white py-4 rounded-xl font-semibold transition-all"
      >
        Continuar
      </button>
    </motion.div>
  );
};

const QuestionView = ({ node, onSelect, onBack }: { node: QuestionNode, onSelect: (optId: string) => void, onBack: () => void }) => (
  <motion.div 
    key={node.id}
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    className="max-w-2xl mx-auto"
  >
    <button onClick={onBack} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors">
      <ArrowLeft size={18} /> Voltar
    </button>
    
    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 leading-tight">
      {node.question}
    </h2>

    <div className="space-y-4">
      {node.options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className="w-full text-left p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 group transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="font-bold text-lg text-slate-800 mb-1 flex items-center gap-2">
                {opt.label}
              </div>
              {opt.description && (
                <p className="text-slate-500 text-sm">{opt.description}</p>
              )}
            </div>
            <ChevronRight className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </div>
        </button>
      ))}
    </div>
  </motion.div>
);

const ResultView = ({ recommendation, onReset }: { recommendation: Recommendation, onReset: () => void }) => {
  const [showJustification, setShowJustification] = useState(true);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200 p-8"
    >
      <div className="space-y-6">
        {/* Header Question Block */}
        <div>
          <span className="text-[10px] uppercase font-bold text-blue-600 tracking-widest block mb-1">
            Métrica Diagnóstica Selecionada
          </span>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            {recommendation.businessTitle}
          </h2>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed">
            {recommendation.businessDescription}
          </p>
        </div>

        {/* Model Section (No technical hide/show - Proudly visible in clean layout!) */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-550/5 rounded-full blur-3xl" />
          
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
              Fórmula / Método Científico Correspondente
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs text-slate-400 block mb-0.5">Método Estatístico / SNA</span>
              <span className="text-lg font-bold text-slate-900 font-mono break-words">
                {recommendation.technicalDetails.method}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">O que calcula de fato</span>
                <span className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {recommendation.technicalDetails.whatItMeasures}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">Engine & Biblioteca Python</span>
                <span className="text-blue-600 text-xs sm:text-sm font-mono flex items-center gap-1.5 mt-0.5 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 w-fit font-semibold">
                  {recommendation.technicalDetails.software}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Justification Toggle (Sleek Accordion) */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
          <button
            onClick={() => setShowJustification(!showJustification)}
            className="w-full flex items-center justify-between p-4 bg-slate-50/50 hover:bg-slate-50 text-left transition-colors"
          >
            <div className="flex items-center gap-2 text-slate-700">
              <Info size={16} className="text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Justificativa Metodológica</span>
            </div>
            <motion.div
              animate={{ rotate: showJustification ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={16} className="text-slate-400" />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {showJustification && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-5 border-t border-slate-200 text-slate-600 text-xs sm:text-sm leading-relaxed bg-slate-50/20">
                  <p className="italic border-l-2 border-blue-500 pl-3 py-1 bg-blue-50/20 rounded-r-md">
                    "{recommendation.justification}"
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Primary Actions */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={onReset}
            className="flex-1 bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-blue-500 active:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm shadow-md shadow-blue-200"
          >
            Refazer diagnóstico
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [step, setStep] = useState<'welcome' | 'onboarding' | 'questions' | 'result'>('welcome');
  const [currentNodeId, setCurrentNodeId] = useState('T2');
  const [history, setHistory] = useState<string[]>([]);
  const [recommendationId, setRecommendationId] = useState<string | null>(null);
  const [contextData, setContextData] = useState<any>(null);
  const [showVisualizer, setShowVisualizer] = useState(false);

  const handleStart = () => {
    setStep('questions');
    setCurrentNodeId('T2');
    setHistory([]);
  };
  
  const handleOnboarding = (data: any) => {
    setContextData(data);
    setStep('questions');
  };

  const handleSelectOption = (optId: string) => {
    const node = TREE[currentNodeId];
    const selected = node.options.find(o => o.id === optId);
    
    if (!selected) return;

    if (selected.recommendationId) {
      setRecommendationId(selected.recommendationId);
      setStep('result');
    } else if (selected.nextStep) {
      setHistory([...history, currentNodeId]);
      setCurrentNodeId(selected.nextStep);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentNodeId(prev);
    } else {
      setStep('welcome');
    }
  };

  const handleReset = () => {
    setStep('welcome');
    setCurrentNodeId('T2');
    setHistory([]);
    setRecommendationId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 p-4 pt-12 md:p-12 relative">
      {/* Header / Logo */}
      <div className="max-w-7xl mx-auto flex items-center justify-between mb-12">
        <div className="flex items-center gap-3 group cursor-pointer" onClick={handleReset}>
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-105">
            <Network size={24} />
          </div>
          <div>
            <span className="block font-bold text-lg leading-none text-slate-900 uppercase tracking-tighter">Insper</span>
            <span className="block text-xs font-semibold text-blue-600 uppercase tracking-[0.2em]">Network Hub</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {step !== 'welcome' && (
            <button 
              onClick={() => setShowVisualizer(true)}
              className="px-4 py-2 hover:bg-slate-100 rounded-full text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5 border border-slate-200 bg-white shadow-sm"
            >
              <Map size={14} className="text-blue-500" /> Ver Árvore de Decisão
            </button>
          )}
          {step === 'questions' && (
             <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest shadow-sm">
               <LayoutGrid size={12} className="text-blue-500" /> Diagnóstico em curso
             </div>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.div key="welcome">
              <Landing 
                onStart={handleStart} 
                onViewTree={() => setShowVisualizer(true)} 
              />
            </motion.div>
          )}

          {step === 'questions' && (
            <motion.div key={currentNodeId}>
              <QuestionView 
                node={TREE[currentNodeId]} 
                onSelect={handleSelectOption}
                onBack={handleBack} 
              />
            </motion.div>
          )}

          {step === 'result' && recommendationId && (
            <motion.div key="result">
              <ResultView 
                recommendation={RECOMMENDATIONS[recommendationId]} 
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Visualizer Modal overlay */}
      <AnimatePresence>
        {showVisualizer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setShowVisualizer(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <DecisionTreeVisualizer onClose={() => setShowVisualizer(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Decoration */}
      <footer className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-100 flex items-center justify-center gap-4 text-slate-400 text-xs">
        <span>© 2026 Insper Redes Sociais</span>
        <span className="hidden md:inline">•</span>
        <span>Dev por Lucas Kamikawa e Gabriel Vidigal</span>
      </footer>
    </div>
  );
}

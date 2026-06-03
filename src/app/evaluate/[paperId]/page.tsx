import { Metadata } from 'next';
import Navbar from '../../components/Navbar';

export const metadata: Metadata = {
  title: 'Evaluator Workspace | ExamVal',
  description: 'Double-blind exam grading interface.',
};

interface PageProps {
  params: {
    paperId: string;
  };
}

export default function EvaluatePage({ params }: PageProps) {
  const { paperId } = params;

  return (
    <div id="evaluator-workspace-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar currentPaperId={paperId} />

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side: PDF Viewer Placeholder */}
        <section 
          id="pdf-viewer-container" 
          className="w-1/2 border-r border-slate-800 bg-slate-900 flex flex-col items-center justify-center p-6"
        >
          <div className="text-center space-y-4 max-w-md">
            <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-indigo-400 border border-slate-700 animate-pulse">
              📄
            </div>
            <h2 className="text-lg font-semibold">PDF Script Viewer</h2>
            <p className="text-sm text-slate-400">
              Exam script PDF will render here in a high-fidelity container, enabling highlights, zoom, and notes tracking.
            </p>
          </div>
        </section>

        {/* Right Side: Grading Form Placeholder */}
        <section 
          id="grading-form-container" 
          className="w-1/2 bg-slate-950 flex flex-col p-8 overflow-y-auto"
        >
          <div className="max-w-xl w-full mx-auto space-y-6">
            <h2 className="text-xl font-bold tracking-tight text-slate-100">Grading & Score Entry</h2>
            
            {/* Dynamic Placeholder Card */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-1">
              <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-mono font-bold">Active Dynamic Workspace</span>
              <div className="text-sm font-semibold text-slate-200">Evaluator Workspace for Paper: {paperId}</div>
            </div>

            <p className="text-sm text-slate-400">
              Complete evaluation fields mapped from the blueprint structure.
            </p>
            
            {/* Skeletal Form */}
            <div className="space-y-4 py-4 border-y border-slate-800">
              <div className="h-20 bg-slate-900 rounded-lg border border-slate-800 p-4 animate-pulse"></div>
              <div className="h-20 bg-slate-900 rounded-lg border border-slate-800 p-4 animate-pulse"></div>
            </div>

            {/* Verification / Submission Action */}
            <button
              id="submit-evaluation-btn"
              disabled
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg opacity-50 cursor-not-allowed transition duration-200"
            >
              Submit Grading (Validation Locked)
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

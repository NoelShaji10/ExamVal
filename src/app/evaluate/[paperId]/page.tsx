import { Metadata } from 'next';
import Navbar from '../../components/Navbar';
import { EvaluationWorkspace } from '../../../features/evaluation/EvaluationWorkspace';

export const metadata: Metadata = {
  title: 'Evaluator Workspace | ExamVal',
  description: 'Double-blind exam grading interface.',
};

interface PageProps {
  params: Promise<{
    paperId: string;
  }>;
}

export default async function EvaluatePage({ params }: PageProps) {
  const { paperId } = await params;

  return (
    <div id="evaluator-workspace-root" className="h-screen bg-slate-950 text-slate-100 flex flex-col font-sans overflow-hidden">
      <Navbar currentPaperId={paperId} />
      <EvaluationWorkspace paperId={paperId} />
    </div>
  );
}

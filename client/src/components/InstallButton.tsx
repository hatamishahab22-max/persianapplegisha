import { useInstallPrompt } from '@/hooks/useInstallPrompt';
import { Download } from 'lucide-react';

export function InstallButton() {
  const { isInstallable, install } = useInstallPrompt();

  if (!isInstallable) {
    return null;
  }

  return (
    <button
      onClick={install}
      className="fixed top-24 right-4 z-40 flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-lg bg-yellow-400/90 border border-yellow-300 hover:bg-yellow-400 transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold text-black hover:scale-105 active:scale-95"
      data-testid="button-install-app"
      title="نصب برنامه"
    >
      <Download className="w-5 h-5" />
      <span className="text-sm">نصب برنامه</span>
    </button>
  );
}

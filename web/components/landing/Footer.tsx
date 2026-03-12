export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-white/5">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">🐾</span>
          <span className="font-bold text-white/60">PawPal 宠友圈</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-white/30">
          <a
            href="https://github.com/ava-agent/dog-agent"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/60 transition-colors"
          >
            GitHub
          </a>
          <span>React Native + Expo</span>
          <span>Supabase</span>
          <span>GLM-4</span>
        </div>
        <div className="text-xs text-white/20">
          Built with ❤️ for pets
        </div>
      </div>
    </footer>
  );
}

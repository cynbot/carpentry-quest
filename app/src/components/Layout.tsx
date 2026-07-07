import { NavLink, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Projects', emoji: '🧰', end: true },
  { to: '/roulette', label: 'Roulette', emoji: '🎰' },
  { to: '/grove', label: 'The Grove', emoji: '🌳' },
  { to: '/inventory', label: 'Inventory', emoji: '🗄️' },
  { to: '/workbench', label: 'Workbench', emoji: '🛠️' },
  { to: '/tools/fractions', label: 'Fractions', emoji: '🔢' },
  { to: '/tools/cutlist', label: 'Cut List', emoji: '🪚' },
];

export function Layout() {
  return (
    <div className="min-h-screen bg-charcoal">
      <header className="bg-gray-900 border-b-2 border-heartwood shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-heartwood rounded-full flex items-center justify-center ring-2 ring-heartwood-deep ring-offset-2 ring-offset-gray-900">
              <span className="text-2xl">🌳</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Heartwood</h1>
              <p className="text-metallic text-sm">a shared workshop ꕤ</p>
            </div>
          </div>

          <nav className="mt-5 flex gap-2 flex-wrap">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-semibold transition-all ${
                    isActive
                      ? 'bg-heartwood text-charcoal'
                      : 'bg-gray-800 text-metallic hover:bg-gray-700'
                  }`
                }
              >
                {item.emoji} {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="py-8">
        <Outlet />
      </main>

      <footer className="mt-16 py-6 border-t border-metallic/20">
        <div className="max-w-7xl mx-auto px-4 text-center text-metallic text-sm">
          built ring by ring, together ꕤ
        </div>
      </footer>
    </div>
  );
}

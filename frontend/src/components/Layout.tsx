import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/pessoas', label: 'Pessoas' },
  { to: '/transacoes', label: 'Transacoes' },
  { to: '/totais', label: 'Totais' },
];

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-wide text-teal-700">
              Controle residencial
            </p>
            <h1 className="text-2xl font-semibold text-slate-950">Gastos e receitas</h1>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="Navegacao principal">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'rounded-md px-3 py-2 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2',
                    isActive
                      ? 'bg-teal-700 text-white'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-800',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

import { BarChart3, ReceiptText, Users } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/pessoas', label: 'Pessoas', Icon: Users },
  { to: '/transacoes', label: 'Transações', Icon: ReceiptText },
  { to: '/totais', label: 'Totais', Icon: BarChart3 },
];

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              Controle residencial
            </p>
            <h1 className="mt-1 text-2xl font-semibold leading-8 text-slate-950">Gastos e receitas</h1>
          </div>
          <nav className="flex flex-wrap gap-2" aria-label="Navegação principal">
            {navItems.map(({ Icon, ...item }) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    'inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium outline-none transition focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2',
                    isActive
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800',
                  ].join(' ')
                }
              >
                <Icon size={16} aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-5 sm:py-6 lg:px-6">
        <Outlet />
      </main>
    </div>
  );
}

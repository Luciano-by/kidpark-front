// // src/app/components/kidpark/AppSidebar.tsx
// // Atualizado com acessibilidade completa:
// //  - aria-label em todos os botões
// //  - aria-current="page" na rota ativa
// //  - role="navigation" no nav
// //  - navegação por teclado (Tab natural + Enter)

// import { useNavigate, useLocation } from 'react-router'
// import { LayoutDashboard, UserPlus, BarChart3, Users, User } from 'lucide-react'
// import { Logo }    from './Logo'
// import { useAuth } from '../../../contexts/AuthContext'

// interface AppSidebarProps {
//   expanded?: boolean
// }

// export function AppSidebar({ expanded = false }: AppSidebarProps) {
//   const navigate = useNavigate()
//   const location = useLocation()
//   const { can }  = useAuth()

//   const w         = expanded ? 'w-[220px]' : 'w-16'
//   const isActive  = (path: string) => location.pathname === path

//   const btn = (
//     path:  string,
//     icon:  React.ReactNode,
//     label: string,
//     color?: string,
//   ) => {
//     const active = isActive(path)
//     return (
//       <button
//         key={path}
//         onClick={() => navigate(path)}
//         aria-label={label}
//         aria-current={active ? 'page' : undefined}
//         title={label}
//         className={[
//           'w-full px-4 py-3 flex items-center gap-3 transition-colors',
//           'focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset',
//           'hover:bg-[#1976D2]',
//           active ? 'bg-[#0D47A1] border-l-4 border-white' : '',
//         ].join(' ')}
//         style={{ color: color ?? 'white' }}
//       >
//         <span aria-hidden="true">{icon}</span>
//         {expanded && (
//           <span className="font-nunito font-semibold text-sm">{label}</span>
//         )}
//       </button>
//     )
//   }

//   return (
//     <div
//       className={`${w} bg-[#1565C0] flex flex-col flex-shrink-0 transition-all duration-300`}
//       role="complementary"
//       aria-label="Menu lateral de navegação"
//     >
//       {/* Logo */}
//       <div className="p-4 flex justify-center items-center h-16">
//         {expanded
//           ? <Logo variant="full" size="sm" />
//           : <span className="text-white font-fredoka text-2xl" aria-label="KidPark">K</span>}
//       </div>

//       {/* Navegação principal */}
//       <nav className="flex-1 py-4" role="navigation" aria-label="Menu principal">
//         {btn('/dashboard', <LayoutDashboard className="w-7 h-7 flex-shrink-0" />, 'Dashboard')}
//         {btn('/cadastro',  <UserPlus        className="w-7 h-7 flex-shrink-0" />, 'Cadastro')}
//         {can('reports:read') && btn(
//           '/relatorios',
//           <BarChart3 className="w-7 h-7 flex-shrink-0" />,
//           'Relatórios',
//           '#E53935',
//         )}
//         {can('users:read') && btn(
//           '/gerenciamento',
//           <Users className="w-7 h-7 flex-shrink-0" />,
//           'Gerenciamento',
//           '#E65100',
//         )}
//       </nav>

//       {/* Perfil */}
//       <button
//         onClick={() => navigate('/perfil')}
//         aria-label="Meu Perfil"
//         aria-current={isActive('/perfil') ? 'page' : undefined}
//         className={[
//           'p-4 flex items-center justify-center gap-3 text-white',
//           'hover:bg-[#1976D2] transition-colors',
//           'focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset',
//           isActive('/perfil') ? 'bg-[#0D47A1]' : '',
//         ].join(' ')}
//       >
//         <div
//           className="w-9 h-9 bg-white rounded-full flex items-center justify-center flex-shrink-0"
//           aria-hidden="true"
//         >
//           <User className="w-5 h-5 text-[#1565C0]" />
//         </div>
//         {expanded && (
//           <span className="font-nunito font-semibold text-sm">Meu Perfil</span>
//         )}
//       </button>
//     </div>
//   )
// }
// src/app/components/kidpark/AppSidebar.tsx

import { useNavigate, useLocation } from 'react-router'
import { LayoutDashboard, UserPlus, BarChart3, Users, User, Gamepad2 } from 'lucide-react'
import { Logo }    from './Logo'
import { useAuth } from '../../../contexts/AuthContext'

interface AppSidebarProps {
  expanded?: boolean
}

export function AppSidebar({ expanded = false }: AppSidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { can }  = useAuth()

  const w        = expanded ? 'w-[220px]' : 'w-16'
  const isActive = (path: string) => location.pathname === path

  const btn = (
    path:  string,
    icon:  React.ReactNode,
    label: string,
    color?: string,
  ) => {
    const active = isActive(path)
    return (
      <button
        key={path}
        onClick={() => navigate(path)}
        aria-label={label}
        aria-current={active ? 'page' : undefined}
        title={label}
        className={[
          'w-full px-4 py-3 flex items-center gap-3 transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset',
          'hover:bg-[#1976D2]',
          active ? 'bg-[#0D47A1] border-l-4 border-white' : '',
        ].join(' ')}
        style={{ color: color ?? 'white' }}
      >
        <span aria-hidden="true">{icon}</span>
        {expanded && (
          <span className="font-nunito font-semibold text-sm">{label}</span>
        )}
      </button>
    )
  }

  return (
    <div
      className={`${w} bg-[#1565C0] flex flex-col flex-shrink-0 transition-all duration-300`}
      role="complementary"
      aria-label="Menu lateral de navegação"
    >
      {/* Logo */}
      <div className="p-4 flex justify-center items-center h-16">
        {expanded
          ? <Logo variant="full" size="sm" />
          : <span className="text-white font-fredoka text-2xl" aria-label="KidPark">K</span>}
      </div>

      {/* Navegação principal */}
      <nav className="flex-1 py-4" role="navigation" aria-label="Menu principal">

        {btn('/dashboard', <LayoutDashboard className="w-7 h-7 flex-shrink-0" />, 'Dashboard')}

        {btn('/cadastro',  <UserPlus className="w-7 h-7 flex-shrink-0" />, 'Cadastro')}

        {/* Brinquedos — visível apenas para GERENTE */}
        {can('toys:write') && btn(
          '/brinquedos',
          <Gamepad2 className="w-7 h-7 flex-shrink-0" />,
          'Brinquedos',
          '#F9A825',
        )}

        {can('reports:read') && btn(
          '/relatorios',
          <BarChart3 className="w-7 h-7 flex-shrink-0" />,
          'Relatórios',
          '#E53935',
        )}

        {can('users:read') && btn(
          '/gerenciamento',
          <Users className="w-7 h-7 flex-shrink-0" />,
          'Gerenciamento',
          '#E65100',
        )}

      </nav>

      {/* Perfil */}
      <button
        onClick={() => navigate('/perfil')}
        aria-label="Meu Perfil"
        aria-current={isActive('/perfil') ? 'page' : undefined}
        className={[
          'p-4 flex items-center justify-center gap-3 text-white',
          'hover:bg-[#1976D2] transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset',
          isActive('/perfil') ? 'bg-[#0D47A1]' : '',
        ].join(' ')}
      >
        <div
          className="w-9 h-9 bg-white rounded-full flex items-center justify-center flex-shrink-0"
          aria-hidden="true"
        >
          <User className="w-5 h-5 text-[#1565C0]" />
        </div>
        {expanded && (
          <span className="font-nunito font-semibold text-sm">Meu Perfil</span>
        )}
      </button>
    </div>
  )
}
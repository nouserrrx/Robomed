import React, { Component, Suspense, type ReactNode } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { ToastProvider } from './context/ToastContext'

const Navbar = React.lazy(() => import('./components/layout/Navbar'))
const Footer = React.lazy(() => import('./components/layout/Footer'))
const Home = React.lazy(() => import('./pages/Home'))
const About = React.lazy(() => import('./pages/About'))
const Actions = React.lazy(() => import('./pages/Actions'))
const Projects = React.lazy(() => import('./pages/Projects'))
const Actualites = React.lazy(() => import('./pages/Actualites'))
const Galerie = React.lazy(() => import('./pages/Galerie'))
const Contact = React.lazy(() => import('./pages/Contact'))
const Connexion = React.lazy(() => import('./pages/Connexion'))
const Don = React.lazy(() => import('./pages/Don'))
const DonorPortal = React.lazy(() => import('./pages/DonorPortal'))
const VolunteerPortal = React.lazy(() => import('./pages/VolunteerPortal'))
const Transparence = React.lazy(() => import('./pages/Transparence'))
const Legal = React.lazy(() => import('./pages/Legal'))
const NotFound = React.lazy(() => import('./pages/NotFound'))

// Admin Components
const AdminLayout = React.lazy(() => import('./pages/admin/AdminLayout'))
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'))
const RequireAuth = React.lazy(() => import('./pages/admin/RequireAuth'))
const AdminOverview = React.lazy(() => import('./pages/admin/AdminOverview'))
const AdminMessages = React.lazy(() => import('./pages/admin/AdminMessages'))
const AdminProjets = React.lazy(() => import('./pages/admin/AdminProjets'))
const AdminEquipe = React.lazy(() => import('./pages/admin/AdminEquipe'))
const AdminDons = React.lazy(() => import('./pages/admin/AdminDons'))
const AdminGalerie = React.lazy(() => import('./pages/admin/AdminGalerie'))
const AdminStocks = React.lazy(() => import('./pages/admin/AdminStocks'))
const AdminUtilisateurs = React.lazy(() => import('./pages/admin/AdminUtilisateurs'))
const AdminProfil = React.lazy(() => import('./pages/admin/AdminProfil'))
const AdminActualites = React.lazy(() => import('./pages/admin/AdminActualites'))
const AdminLogs = React.lazy(() => import('./pages/admin/AdminLogs'))
const AdminBeneficiaires = React.lazy(() => import('./pages/admin/AdminBeneficiaires'))
const AdminDistributions = React.lazy(() => import('./pages/admin/AdminDistributions'))
const AdminCampagnes = React.lazy(() => import('./pages/admin/AdminCampagnes'))
const AdminBenevoles = React.lazy(() => import('./pages/admin/AdminBenevoles'))
const AdminRapports = React.lazy(() => import('./pages/admin/AdminRapports'))


class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 bg-red-100 text-red-900 min-h-screen">
          <h1 className="text-3xl font-bold mb-4">CRITICAL RENDER ERROR</h1>
          <pre className="bg-white p-4 rounded overflow-auto border border-red-300">
            {this.state.error && this.state.error.toString()}
            {'\n'}
            {this.state.error && this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Layout pour les routes publiques (Navbar + Footer)
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-light dark:bg-gray-900 transition-colors">
      <ErrorBoundary>
        <Suspense fallback={<div />}>
          <Navbar />
        </Suspense>
      </ErrorBoundary>
      <main className="flex-1">
        <ErrorBoundary>
          <Suspense fallback={<div className="p-10 text-2xl">Chargement...</div>}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Suspense fallback={<div />}>
        <Footer />
      </Suspense>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <ToastProvider>
              <Suspense fallback={<div className="p-10 text-2xl">Chargement...</div>}>
                <Routes>
                  {/* ── Admin Login Route ── */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* ── Protected Admin routes ── */}
                  <Route path="/admin" element={<RequireAuth />}>
                    <Route element={<AdminLayout />}>
                      <Route index element={<AdminOverview />} />
                      <Route path="campagnes" element={<AdminCampagnes />} />
                      <Route path="actualites" element={<AdminActualites />} />
                      <Route path="messages" element={<AdminMessages />} />
                      <Route path="projets" element={<AdminProjets />} />
                      <Route path="distributions" element={<AdminDistributions />} />
                      <Route path="equipe" element={<AdminEquipe />} />
                      <Route path="dons" element={<AdminDons />} />
                      <Route path="galerie" element={<AdminGalerie />} />
                      <Route path="stocks" element={<AdminStocks />} />
                      <Route path="beneficiaires" element={<AdminBeneficiaires />} />
                      <Route path="benevoles" element={<AdminBenevoles />} />
                      <Route path="rapports" element={<AdminRapports />} />
                      <Route path="utilisateurs" element={<AdminUtilisateurs />} />
                      <Route path="profil" element={<AdminProfil />} />
                      <Route path="logs" element={<AdminLogs />} />
                    </Route>
                  </Route>

                  {/* ── Public routes via PublicLayout ── */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/a-propos" element={<About />} />
                    <Route path="/nos-actions" element={<Actions />} />
                    <Route path="/projets" element={<Projects />} />
                    <Route path="/actualites" element={<Actualites />} />
                    <Route path="/galerie" element={<Galerie />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/connexion" element={<Connexion />} />
                    <Route path="/faire-un-don" element={<Don />} />
                    <Route path="/espace-donateur" element={<DonorPortal />} />
                    <Route path="/espace-benevole" element={<VolunteerPortal />} />
                    <Route path="/transparence" element={<Transparence />} />
                    <Route path="/mentions-legales" element={<Legal />} />
                    <Route path="*" element={<NotFound />} />
                  </Route>
                </Routes>
              </Suspense>
            </ToastProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App

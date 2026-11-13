import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { APP_IMAGES } from '../lib/assets';
import { authenticateUser, registerUser } from '../lib/store';
import { UserProfile } from '../types/simulation';

interface LoginViewProps {
  onLoginSuccess: (user: UserProfile, remember: boolean) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('candojaiver@gmail.com');
  const [password, setPassword] = useState('demo1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      const res = authenticateUser(email, password);
      if (res.error || !res.user) {
        setError(res.error ?? 'No fue posible iniciar sesión.');
        return;
      }
      onLoginSuccess(res.user, rememberMe);
    } else {
      const res = registerUser(name, email, password);
      if (res.error || !res.user) {
        setError(res.error ?? 'No fue posible crear la cuenta.');
        return;
      }
      onLoginSuccess(res.user, true);
    }
  };

  const handleDemoLogin = () => {
    const res = authenticateUser('candojaiver@gmail.com', 'demo1234');
    if (res.user) {
      onLoginSuccess(res.user, true);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#082215] text-white">
      {/* Left Hero Panel (Desktop) / Top Brand Banner (Mobile) */}
      <div className="relative lg:w-[56%] xl:w-[58%] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden min-h-[260px] lg:min-h-screen">
        <img
          src={APP_IMAGES.heroBridge}
          alt="Puente atirantado al atardecer"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#061A0F]/95 via-[#092919]/80 to-[#0D3B23]/75" />

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 backdrop-blur-sm">
            <BrandLogo className="w-9 h-7" />
          </div>
          <div>
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white block leading-tight">
              StructuSim
            </span>
            <span className="text-xs sm:text-sm text-emerald-200/85">
              Simulador de Estructuras y Estabilidad
            </span>
          </div>
        </div>

        {/* Hero Copy (Desktop prominent, concise on Mobile) */}
        <div className="relative z-10 mt-8 lg:mt-0 max-w-xl">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance leading-[1.12]">
            Diseña. Analiza. Construye.
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-emerald-100/90 leading-relaxed max-w-md">
            Simulador interactivo de puentes, torres eléctricas y edificaciones con cálculo matricial en tiempo real.
          </p>
          <p className="mt-4 hidden lg:block text-xs text-emerald-200/70">
            Analiza · Simula · Aprende · Ingeniería Estructural
          </p>
        </div>

        <div className="relative z-10 hidden lg:flex items-center justify-between text-xs text-emerald-200/65 pt-8 border-t border-emerald-500/20">
          <span>2026 StructuSim</span>
          <span>Móvil y Escritorio</span>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-5 sm:p-8 lg:p-12 bg-[#F3F6F4] dark:bg-[#07140D] text-slate-900 dark:text-slate-100 rounded-t-3xl lg:rounded-none -mt-6 lg:mt-0 relative z-20 shadow-2xl lg:shadow-none">
        <div className="w-full max-w-md">
          <div className="text-center lg:text-left mb-7">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-emerald-200/75">
              {mode === 'login'
                ? 'Ingresa tus datos para continuar con tus simulaciones'
                : 'Regístrate para guardar tu historial y análisis estructurales'}
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800/70 text-red-700 dark:text-red-200 text-sm"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1.5">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Andrés Cando"
                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-white dark:bg-[#0D2318] border border-slate-300 dark:border-emerald-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1.5">
                Correo electrónico o usuario
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-white dark:bg-[#0D2318] border border-slate-300 dark:border-emerald-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-emerald-100 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-10 pr-12 rounded-xl bg-white dark:bg-[#0D2318] border border-slate-300 dark:border-emerald-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="absolute right-2 top-1/2 -translate-y-1/2 min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-emerald-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                <label className="inline-flex items-center gap-2 cursor-pointer text-slate-600 dark:text-emerald-200/80 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-700 focus:ring-emerald-600"
                  />
                  Recordarme
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setRecoveryEmail(email);
                    setRecoverySent(false);
                    setShowRecoveryModal(true);
                  }}
                  className="font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full h-12 mt-2 rounded-xl bg-[#115E34] hover:bg-[#0D4A29] active:scale-[0.99] text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <span>{mode === 'login' ? 'Ingresar' : 'Registrarse'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {mode === 'login' && (
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full h-11 mt-3 rounded-xl border border-emerald-700/30 dark:border-emerald-700/60 bg-emerald-50/70 dark:bg-emerald-950/50 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50 text-emerald-900 dark:text-emerald-200 font-medium text-sm transition-colors cursor-pointer"
            >
              Entrar rápido como Andrés Cando (Demo)
            </button>
          )}

          <p className="mt-6 text-center text-sm text-slate-600 dark:text-emerald-200/75">
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes una cuenta?'}{' '}
            <button
              type="button"
              onClick={() => {
                setError(null);
                setMode(mode === 'login' ? 'register' : 'login');
              }}
              className="font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </p>
        </div>
      </div>

      {/* Password Recovery Modal */}
      {showRecoveryModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0D2318] border border-slate-200 dark:border-emerald-800/60 p-6 text-slate-900 dark:text-white shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-lg font-bold">Recuperar contraseña</h3>
              <button
                type="button"
                onClick={() => setShowRecoveryModal(false)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-emerald-900"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {recoverySent ? (
              <div className="py-4 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="text-sm text-slate-700 dark:text-emerald-100">
                  Se enviaron instrucciones de restablecimiento a <strong>{recoveryEmail || 'tu correo'}</strong>.
                  Para acceso inmediato, puedes usar la contraseña demo <span className="font-mono-tabular">demo1234</span>.
                </p>
                <button
                  type="button"
                  onClick={() => setShowRecoveryModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-medium"
                >
                  Entendido
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setRecoverySent(true);
                }}
                className="space-y-4"
              >
                <p className="text-sm text-slate-600 dark:text-emerald-200/80">
                  Ingresa tu correo registrado para restablecer el acceso a tu cuenta.
                </p>
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="correo@ejemplo.com"
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-[#081910] border border-slate-300 dark:border-emerald-800 text-sm"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRecoveryModal(false)}
                    className="px-4 py-2 rounded-xl text-sm text-slate-600 dark:text-emerald-200 hover:bg-slate-100 dark:hover:bg-emerald-900"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800"
                  >
                    Enviar enlace
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

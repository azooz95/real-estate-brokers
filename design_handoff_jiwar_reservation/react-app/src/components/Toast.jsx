import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { color, shadow } from '../theme/tokens.js';

const ToastContext = createContext(null);
let uid = 0;

const TONE = {
  success: { bg: color.emerald, icon: '✓' },
  error:   { bg: color.primary, icon: '⚠' },
};

// App-wide toast feed: every mutating action (save, delete, status change,
// copy…) should resolve into a visible success/error toast here instead of
// silently succeeding or failing — that silence is what reads as "did my
// click even register?" to the user.
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((x) => x.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const push = useCallback((type, message) => {
    const id = ++uid;
    setToasts((prev) => [...prev, { id, type, message }]);
    timers.current[id] = setTimeout(() => dismiss(id), 3400);
  }, [dismiss]);

  const apiRef = useRef({
    success: (message) => push('success', message),
    error: (message) => push('error', message),
  });

  return (
    <ToastContext.Provider value={apiRef.current}>
      {children}
      <div style={{ position: 'fixed', bottom: 20, insetInlineEnd: 20, zIndex: 999,
        display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', pointerEvents: 'none' }}>
        {toasts.map((toast) => {
          const tone = TONE[toast.type];
          return (
            <div key={toast.id} onClick={() => dismiss(toast.id)} className="toast-pop" style={{
              pointerEvents: 'auto', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
              padding: '13px 18px', borderRadius: 10, background: tone.bg, color: '#fff', fontSize: 13,
              fontWeight: 600, maxWidth: 360, boxShadow: shadow.modal,
            }}>
              <span style={{ fontSize: 15, lineHeight: 1 }}>{tone.icon}</span>
              <span>{toast.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

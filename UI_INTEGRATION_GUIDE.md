# Guía de Integración UI - Botón Gestor de Rutinas

## 📍 Dónde agregar el botón "Gestionar Rutinas"

Aquí hay algunos ejemplos de dónde y cómo agregar el botón para abrir el modal de gestión de rutinas.

---

## Opción 1: En el Navbar (Recomendado)

### Ubicación: `src/App.js` - Componente HomePage, dentro del `<nav>`

```jsx
// Línea ~176 en App.js, después de los navLinks
<div className="hidden md:flex space-x-12 text-lg items-center">
  {navLinks.map(link => (
    <a key={link.href} href={link.href} className="hover:text-[#2A7A87] transition-colors">{link.text}</a>
  ))}
  
  {/* AGREGAR ESTE BOTÓN */}
  {currentUser && (
    <button
      onClick={() => setIsRoutineManagerOpen(true)}
      className="bebas-font bg-[#379AA5]/20 border border-[#379AA5] text-[#379AA5] px-4 py-2 rounded-lg hover:bg-[#379AA5]/30 transition-all shadow-md tracking-wider"
    >
      MIS RUTINAS
    </button>
  )}
</div>
```

**Ventaja**: Siempre visible y accesible desde cualquier página.

---

## Opción 2: En el Menu Mobile (SwipeableMenu)

### Ubicación: `src/App.js` - Dentro del componente `<SwipeableMenu>`

```jsx
<SwipeableMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
  <ul className="flex flex-col space-y-8 text-center mt-24">
    {navLinks.map(link => (
      <li key={link.href}>
        <a 
          href={link.href} 
          onClick={() => setIsMenuOpen(false)} 
          className="bebas-font text-2xl text-gray-300 hover:text-white tracking-widest transition-colors"
        >
          {link.text}
        </a>
      </li>
    ))}
    
    {/* AGREGAR ESTE BOTÓN */}
    {currentUser && (
      <li>
        <button
          onClick={() => {
            setIsMenuOpen(false);
            setIsRoutineManagerOpen(true);
          }}
          className="bebas-font text-2xl text-[#379AA5] hover:text-[#2A7A87] tracking-widest transition-colors"
        >
          MIS RUTINAS
        </button>
      </li>
    )}
    
    <li>
      <Link 
        to="/login"
        onClick={() => setIsMenuOpen(false)} 
        className="bebas-font text-2xl text-[#379AA5] hover:text-[#2A7A87] tracking-widest transition-colors"
      >
        LOGIN
      </Link>
    </li>
  </ul>
  {/* ... resto del código ... */}
</SwipeableMenu>
```

**Ventaja**: Accesible en dispositivos móviles.

---

## Opción 3: En el Dropdown del Usuario (Recomendado)

### Ubicación: `src/App.js` - Dentro del dropdown menu del usuario

```jsx
{/* Dropdown Menu */}
{showUserMenu && (
  <div className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-md border border-gray-700 rounded-lg shadow-xl overflow-hidden z-[60]">
    
    {/* AGREGAR ESTE BOTÓN */}
    <button
      onClick={() => {
        setShowUserMenu(false);
        setIsRoutineManagerOpen(true);
      }}
      className="w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-[#379AA5]/20 hover:border-l-4 hover:border-[#379AA5] transition-all"
    >
      <svg className="w-5 h-5 text-[#379AA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span>Mis Rutinas</span>
    </button>

    {/* Botón existente de cerrar sesión */}
    <button
      onClick={async () => {
        await logout();
        setShowUserMenu(false);
      }}
      className="w-full flex items-center gap-3 px-4 py-3 text-left text-white hover:bg-[#379AA5]/20 hover:border-l-4 hover:border-[#379AA5] transition-all"
    >
      <svg className="w-5 h-5 text-[#379AA5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span>Cerrar Sesión</span>
    </button>
  </div>
)}
```

**Ventaja**: Relacionado con el usuario, muy intuitivo.

---

## Opción 4: En la página Mi Plan

### Ubicación: `src/components/MiPlan.js`

```jsx
// Agregar botón en la parte superior de la página Mi Plan
<div className="flex justify-between items-center mb-6">
  <h2 className="bebas-font text-4xl text-[#379AA5] tracking-wider">MI PLAN</h2>
  
  {currentUser && (
    <button
      onClick={() => setIsRoutineManagerOpen(true)}
      className="bebas-font flex items-center gap-2 bg-[#379AA5] text-white px-6 py-3 rounded-lg hover:bg-[#2A7A87] transition-all shadow-lg tracking-wider"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
      GESTIONAR RUTINAS
    </button>
  )}
</div>
```

**Ventaja**: Contextual, aparece donde el usuario gestiona su plan.

---

## Opción 5: Floating Action Button (FAB)

### Ubicación: `src/App.js` - A nivel global, fuera de Routes

```jsx
return (
  <>
    <ScrollToTop />
    <Routes>
      {/* ... rutas ... */}
    </Routes>
    
    {/* AGREGAR ESTE BOTÓN FLOTANTE */}
    {currentUser && (
      <button
        onClick={() => setIsRoutineManagerOpen(true)}
        className="fixed bottom-24 right-6 z-50 bg-[#379AA5] text-white p-4 rounded-full shadow-2xl hover:bg-[#2A7A87] transition-all hover:scale-110"
        title="Gestionar Rutinas"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </button>
    )}
    
    <PlanificadorModal {...props} />
    <RoutineManagerModal {...props} />
    <ScrollToTopButton />
  </>
);
```

**Ventaja**: Siempre visible, no interfiere con el diseño existente.

---

## Estado necesario en HomePage

Si agregas el botón en `HomePage`, necesitas pasar `setIsRoutineManagerOpen` como prop:

```jsx
// En App.js
<Route 
  path="/" 
  element={
    <HomePage 
      typewriterText={text} 
      loopNum={loopNum} 
      toRotate={toRotate}
      setIsRoutineManagerOpen={setIsRoutineManagerOpen} // AGREGAR ESTO
    />
  } 
/>

// En HomePage component
const HomePage = ({ 
  typewriterText, 
  loopNum, 
  toRotate, 
  setIsRoutineManagerOpen // AGREGAR ESTO
}) => {
  // ... resto del código
}
```

---

## Recomendación Final

**La mejor opción es combinar 2 ubicaciones:**

1. **Dropdown del usuario** (Opción 3) - Para escritorio
2. **Menu móvil** (Opción 2) - Para móviles

Esto proporciona la mejor experiencia en todos los dispositivos.

---

## Testing

Después de agregar el botón:

1. Inicia sesión
2. Click en "Mis Rutinas" / "Gestionar Rutinas"
3. El modal `RoutineManagerModal` debería abrirse
4. Prueba crear, renombrar, eliminar y cambiar entre rutinas

¡Listo! 🎉

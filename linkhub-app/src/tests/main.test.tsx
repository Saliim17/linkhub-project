import { describe, test, expect, vi, beforeEach } from 'vitest';

// 🔧 Mock render y createRoot con tipos explícitos
const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({
  render: mockRender,
}));

// ✅ Mock de react-dom/client con export default incluido
vi.mock('react-dom/client', () => ({
  createRoot: mockCreateRoot,
  default: { createRoot: mockCreateRoot }, // <-- Esto evita el error de Vitest
}));

// ✅ Mock del componente App
vi.mock('../App.tsx', () => ({
  default: () => <div>Mocked App</div>,
}));

describe('main.tsx', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '<div id="root"></div>';
  });

  test('should call ReactDOM.createRoot and render the App', async () => {
    await import('../main.tsx');

    const rootElement = document.getElementById('root');
    expect(rootElement).not.toBeNull();

    // Asegura que ReactDOM.createRoot se llame correctamente
    expect(mockCreateRoot).toHaveBeenCalledWith(rootElement);
    // Asegura que render se ejecute
    expect(mockRender).toHaveBeenCalledTimes(1);
  });
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import GrupoCard from './GrupoCard';

describe('GrupoCard', () => {
  const mockGrupo = {
    nombre: 'Pecho',
    slug: 'pecho',
    img: 'pecho.jpg',
  };

  test('debería renderizar el nombre del grupo y enlazar correctamente', () => {
    render(
      <MemoryRouter>
        <GrupoCard grupo={mockGrupo} />
      </MemoryRouter>
    );

    // Verifica que el nombre del grupo se renderiza en mayúsculas
    const nombreElement = screen.getByText('PECHO');
    expect(nombreElement).toBeInTheDocument();

    // Verifica que el componente es un enlace con el href correcto
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/pecho');
  });

  test('debería renderizar la imagen con el alt text correcto', () => {
    render(
      <MemoryRouter>
        <GrupoCard grupo={mockGrupo} />
      </MemoryRouter>
    );

    // Verifica que la imagen se renderiza con el alt text correcto
    const imgElement = screen.getByAltText('Entrenamiento de Pecho');
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', 'pecho.jpg');
  });
});
import { cn } from '../utils';

describe('cn utility', () => {
  test('should merge standard classes', () => {
    expect(cn('w-full', 'h-full')).toBe('w-full h-full');
  });

  test('should handle conditional classes', () => {
    expect(cn('w-full', true && 'h-full', false && 'text-red-500')).toBe('w-full h-full');
  });

  test('should handle arrays', () => {
    expect(cn(['w-full', 'h-full'])).toBe('w-full h-full');
  });

  test('should merge tailwind classes using tailwind-merge', () => {
    // tailwind-merge should resolve conflicts, e.g., p-2 overrides p-1
    expect(cn('p-1', 'p-2')).toBe('p-2');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  test('should handle undefined and null inputs', () => {
    expect(cn('w-full', undefined, null)).toBe('w-full');
  });
});

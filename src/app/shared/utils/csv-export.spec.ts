import { buildCsv, escapeCsvCell } from './csv-export';

describe('csv-export', () => {
  describe('escapeCsvCell', () => {
    it('leaves simple text unchanged', () => {
      expect(escapeCsvCell('hello')).toBe('hello');
    });

    it('wraps fields containing comma', () => {
      expect(escapeCsvCell('a, b')).toBe('"a, b"');
    });

    it('escapes embedded quotes', () => {
      expect(escapeCsvCell('say "hi"')).toBe('"say ""hi"""');
    });

    it('coerces numbers to string', () => {
      expect(escapeCsvCell(42)).toBe('42');
    });
  });

  describe('buildCsv', () => {
    it('joins header and rows with CRLF', () => {
      const csv = buildCsv(
        ['Name', 'Role'],
        [
          ['Ada', 'Admin'],
          ['Bob', 'User'],
        ],
      );
      expect(csv).toBe('Name,Role\r\nAda,Admin\r\nBob,User');
    });
  });
});

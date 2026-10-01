import { describe, it, expect, vi } from 'vitest';
import type pg from 'pg';
import { maskConnectionString, checkDatabaseHealth } from '../../src/db/pool.js';

describe('Database Pool Utilities (Unit)', () => {
  describe('maskConnectionString', () => {
    it('masks both username and password in connection URLs', () => {
      const input = 'postgresql://admin_user:super_secret_pw@db.example.com:5432/traceiq_prod';
      const masked = maskConnectionString(input);

      expect(masked).not.toContain('admin_user');
      expect(masked).not.toContain('super_secret_pw');
      expect(masked).toBe('postgresql://***:***@db.example.com:5432/traceiq_prod');
    });

    it('safely handles URLs without credentials', () => {
      const input = 'postgresql://localhost:5432/traceiq';
      const masked = maskConnectionString(input);

      expect(masked).toBe('postgresql://localhost:5432/traceiq');
    });

    it('handles malformed connection strings safely without throwing', () => {
      const input = 'not-a-valid-url';
      const masked = maskConnectionString(input);

      expect(masked).toBe('[malformed-connection-string]');
    });
  });

  describe('checkDatabaseHealth (Mocked)', () => {
    it('returns true when client connects and query resolves', async () => {
      const mockClient = {
        query: vi.fn().mockResolvedValue({ rows: [{ '?column?': 1 }] }),
        release: vi.fn(),
      };
      const mockPool = {
        connect: vi.fn().mockResolvedValue(mockClient),
      } as unknown as pg.Pool;

      const healthy = await checkDatabaseHealth(mockPool);

      expect(healthy).toBe(true);
      expect(mockPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith('SELECT 1');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('returns false safely when client connection fails', async () => {
      const mockPool = {
        connect: vi.fn().mockRejectedValue(new Error('Connection refused')),
      } as unknown as pg.Pool;

      const healthy = await checkDatabaseHealth(mockPool);

      expect(healthy).toBe(false);
      expect(mockPool.connect).toHaveBeenCalled();
    });
  });
});

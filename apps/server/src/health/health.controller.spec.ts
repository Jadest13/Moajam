import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  it('returns an ok status', () => {
    const result = new HealthController().check();

    assert.equal(result.status, 'ok');
    assert.equal(Number.isNaN(Date.parse(result.timestamp)), false);
  });
});

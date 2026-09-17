import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { maskOutputPhones, maskOutputText } from '../server/output';

describe('display-only phone masking', () => {
  it('masks nested transcript and evidence without changing private originals', () => {
    const original = { transcript: [{ text: 'Call +12025550123' }], evidence: ['(202) 555-0123'], id: 'case-123' };
    const shown = maskOutputPhones(original);
    assert.ok(!JSON.stringify(shown).includes('+12025550123'));
    assert.ok(!JSON.stringify(shown).includes('(202) 555-0123'));
    assert.equal(original.transcript[0].text, 'Call +12025550123');
    assert.equal(shown.id, original.id);
  });
  it('keeps dates and masks formatted/international numbers in text exports', () => {
    assert.equal(maskOutputText('2026-09-14T10:01:00Z'), '2026-09-14T10:01:00Z');
    for (const phone of ['+44 20 7946 0958', '202-555-0123', '2025550123'])
      assert.ok(!maskOutputText(phone).includes(phone));
  });
});

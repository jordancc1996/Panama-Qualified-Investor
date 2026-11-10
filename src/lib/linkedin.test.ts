import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  LINKEDIN_FIELD_ERROR,
  applyLinkedInToFormData,
  normalizeLinkedInUrl,
} from './linkedin.ts';

describe('normalizeLinkedInUrl', () => {
  it('allows an empty value', () => {
    assert.deepEqual(normalizeLinkedInUrl(''), { ok: true, value: '' });
    assert.deepEqual(normalizeLinkedInUrl('   '), { ok: true, value: '' });
  });

  it('normalizes /in/ profiles', () => {
    const expected = 'https://www.linkedin.com/in/yourname';
    const samples = [
      'linkedin.com/in/yourname',
      'www.linkedin.com/in/yourname',
      'https://linkedin.com/in/yourname/',
      'https://www.linkedin.com/in/yourname?trk=abc',
      'uk.linkedin.com/in/yourname',
      '  HTTPS://WWW.LINKEDIN.COM/IN/yourname#section  ',
    ];
    for (const sample of samples) {
      assert.deepEqual(normalizeLinkedInUrl(sample), { ok: true, value: expected }, sample);
    }
  });

  it('normalizes /pub/ profiles without visiting them', () => {
    assert.deepEqual(normalizeLinkedInUrl('https://www.linkedin.com/pub/jane-doe/1/2a3/456?trk=x'), {
      ok: true,
      value: 'https://www.linkedin.com/pub/jane-doe/1/2a3/456',
    });
  });

  it('rejects non-LinkedIn values', () => {
    for (const sample of ['facebook.com/x', 'hello', 'https://example.com/in/x']) {
      assert.deepEqual(normalizeLinkedInUrl(sample), { ok: false, error: LINKEDIN_FIELD_ERROR });
    }
  });
});

describe('applyLinkedInToFormData', () => {
  it('leaves an empty field in the payload', () => {
    const data = new FormData();
    data.set('email', 'a@b.com');
    data.set('linkedin_url', '');
    assert.equal(applyLinkedInToFormData(data), '');
    assert.equal(data.get('linkedin_url'), '');
  });

  it('writes the normalized URL', () => {
    const data = new FormData();
    data.set('linkedin_url', 'linkedin.com/in/yourname?trk=1');
    assert.equal(applyLinkedInToFormData(data), '');
    assert.equal(data.get('linkedin_url'), 'https://www.linkedin.com/in/yourname');
  });

  it('blocks invalid values', () => {
    const data = new FormData();
    data.set('linkedin_url', 'facebook.com/x');
    assert.equal(applyLinkedInToFormData(data), LINKEDIN_FIELD_ERROR);
    assert.equal(data.get('linkedin_url'), 'facebook.com/x');
  });
});

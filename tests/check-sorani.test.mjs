import { test } from 'node:test';
import assert from 'node:assert/strict';
import { check, fix } from '../skills/sorani/scripts/check-sorani.mjs';

const msgs = (t) => check(t).map((p) => p.msg);

test('clean Sorani passes', () => {
  assert.deepEqual(check('ئەم کتێبە زۆر باشە، دەیخوێنم.\nتۆ چی دەخوێنیت؟'), []);
});

test('Arabic yeh and kaf are flagged and fixed', () => {
  const bad = 'كتێبي من';
  assert.equal(check(bad).length, 2);
  assert.equal(fix(bad), 'کتێبی من');
  assert.deepEqual(check(fix(bad)), []);
});

test('teh marbuta, waw hamza and tatweel are flagged', () => {
  assert.ok(msgs('ماڵة').some((m) => m.includes('U+0629')));
  assert.ok(msgs('کؤڕ').some((m) => m.includes('U+0624')));
  assert.equal(fix('کـتێب'), 'کتێب');
});

test('word-final heh is flagged as a likely e', () => {
  assert.ok(msgs('ئەمه باشه').some((m) => m.includes('word-final')));
});

test('Latin punctuation between Kurdish words is flagged, English is left alone', () => {
  assert.equal(check('چۆنی?').length, 1);
  assert.equal(check('باشە, سوپاس').length, 1);
  assert.deepEqual(check('Hello, world? Yes; fine'), []);
});

test('mixed digit sets and mixed h letters are flagged', () => {
  assert.ok(msgs('ساڵی 2026 و ٢٠٢٦').some((m) => m.includes('digits')));
  assert.ok(msgs('ھەموو هەموو').some((m) => m.includes('U+06BE')));
});

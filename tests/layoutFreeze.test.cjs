'use strict';

// Plain-Node unit test (no Meteor) for the #6422 "Freeze Layout" rule.
// Run: node tests/layoutFreeze.test.cjs
//
// #6422: board admins kept accidentally dragging swimlanes and lists around
// while doing normal work. A board `freezeLayout` flag locks the layout so
// swimlanes/lists can no longer be reordered, while cards stay movable.
// isLayoutDragDisabled is the single rule the swimlane sortable, both list
// sortables and the server updateListSort guard all share, so it is worth a
// regression test on its own: freezing must disable layout drag regardless of
// permission, and an un-frozen board must behave exactly as before (gated only
// by permission). The card sortables never call this helper, which is how
// freezing the layout still leaves cards fully movable.

const assert = require('assert');
const { isLayoutDragDisabled } = require('../config/layoutFreeze');

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log('  ok -', name);
}

// Frozen board: layout drag is disabled even for a user who could otherwise
// move the layout (this is the whole point of the feature).
test('freeze disables layout drag even with permission', () => {
  assert.strictEqual(isLayoutDragDisabled(true, true), true);
});

// Frozen board + no permission: still disabled (both reasons apply).
test('freeze disables layout drag without permission', () => {
  assert.strictEqual(isLayoutDragDisabled(false, true), true);
});

// Un-frozen board + permission: enabled — unchanged from the old behaviour.
test('no freeze + permission keeps layout drag enabled', () => {
  assert.strictEqual(isLayoutDragDisabled(true, false), false);
});

// Un-frozen board + no permission: disabled by permission alone, as before.
test('no freeze + no permission stays disabled by permission', () => {
  assert.strictEqual(isLayoutDragDisabled(false, false), true);
});

// The flag is read straight off the board document, which may be missing the
// field (older boards) or carry a non-boolean — anything falsy means "not
// frozen", anything truthy means "frozen".
test('missing / undefined freezeLayout is treated as not frozen', () => {
  assert.strictEqual(isLayoutDragDisabled(true, undefined), false);
  assert.strictEqual(isLayoutDragDisabled(true, null), false);
});

test('truthy non-boolean freezeLayout is treated as frozen', () => {
  assert.strictEqual(isLayoutDragDisabled(true, 1), true);
  assert.strictEqual(isLayoutDragDisabled(true, 'yes'), true);
});

console.log(`\nlayoutFreeze: ${passed} passed`);

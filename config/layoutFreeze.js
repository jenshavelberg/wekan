// Pure, dependency-free helper (no Meteor imports) so it can be unit tested
// directly with plain Node. Shared by the client drag-disable code and the
// server-side list-reorder guard.
//
// #6422 ("Freeze Layout"): board admins kept accidentally dragging swimlanes
// and lists (columns) around while doing normal "user" work. A board-level
// `freezeLayout` flag lets an admin lock the layout: swimlanes and lists can no
// longer be reordered/moved, while cards stay fully movable.
//
// isLayoutDragDisabled centralizes the single rule both sides apply: layout
// drag is disabled when the user normally cannot move the layout (no
// permission) OR when the board layout is frozen. It deliberately knows nothing
// about cards — card sortables never consult freezeLayout, so freezing the
// layout never blocks card moves.

/**
 * @param {boolean} canMoveLayout whether the user may normally reorder the
 *   layout (board admin for swimlanes, board write access for lists)
 * @param {*} freezeLayout the board's freezeLayout flag (coerced to boolean)
 * @return {boolean} true when swimlane / list drag must be disabled
 */
function isLayoutDragDisabled(canMoveLayout, freezeLayout) {
  return !canMoveLayout || !!freezeLayout;
}

module.exports = { isLayoutDragDisabled };

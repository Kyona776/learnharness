import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isImeComposing } from "../src/core/keyboard.ts";

/**
 * The IME Enter bug: typing Japanese (or any IME language) and pressing
 * Enter to confirm a conversion candidate sent the half-typed message,
 * because the submit fields read every Enter as a send. The send/submit
 * fields now ask isImeComposing first and leave that Enter to the IME.
 */

function keydown(init: { key?: string; isComposing?: boolean; keyCode?: number }): KeyboardEvent {
	return { key: "Enter", isComposing: false, keyCode: 13, ...init } as KeyboardEvent;
}

describe("isImeComposing — the IME owns its confirming Enter", () => {
	it("Chromium/Firefox: the confirming Enter carries isComposing", () => {
		assert.equal(isImeComposing(keydown({ isComposing: true, keyCode: 229 })), true);
	});

	it("Safari: the confirming Enter lands after compositionend but keeps keyCode 229", () => {
		assert.equal(isImeComposing(keydown({ isComposing: false, keyCode: 229 })), true);
	});

	it("a plain Enter outside composition is not composing — it still submits", () => {
		assert.equal(isImeComposing(keydown({})), false);
	});
});

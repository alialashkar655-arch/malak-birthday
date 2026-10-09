import assert from 'assert';

console.log('Testing Server Architecture and Logic...');

// Test 1: Verify hashing function
import { hashPassword, verifyPassword } from './server/dist/db.js';

const pass = 'malak2026';
const hash = hashPassword(pass);
assert(verifyPassword(pass, hash), 'Password verification must pass');
assert(!verifyPassword('wrongpassword', hash), 'Wrong password must fail');
console.log('✔ Password hashing & timing-safe verification test passed');

// Test 2: Verify DB loader and defaults
import { db } from './server/dist/db.js';
const settings = db.getSettings();
assert.strictEqual(settings.recipientName, 'Malak', 'Default recipient must be Malak');
assert.strictEqual(settings.birthdayDate, '2026-11-20', 'Birthday must be 2026-11-20');
assert(verifyPassword('malak2026', settings.adminPasswordHash), 'Stored hash must verify for malak2026');

const data = db.getData();
assert(data.timeline.length >= 7, 'Timeline must have at least 7 default memories');
assert(data.dateQuestions.length >= 7, 'Date planner must have all 7 questions');
assert(data.compliments.length >= 5, 'Compliments pool must exist');
assert(data.loveLetters.openWhenNotes.length >= 5, 'Open when collection must have notes');

console.log('✔ Database seeds and integrity test passed');
console.log('All basic server tests succeeded!');

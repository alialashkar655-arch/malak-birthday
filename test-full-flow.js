import assert from 'assert';

async function runTests() {
  console.log('--- Testing Full System & Endpoints ---');

  // 1. Client serving
  const clientRes = await fetch('http://localhost:5173');
  assert.strictEqual(clientRes.status, 200, 'Client frontend must return 200');
  const clientHtml = await clientRes.text();
  assert(clientHtml.includes('Our Little Universe'), 'Title must be in HTML');
  assert(clientHtml.includes('Playfair+Display'), 'Google Fonts must be present');
  console.log('✔ Frontend served on http://localhost:5173 with proper title and fonts');

  // 2. Settings endpoint
  const settingsRes = await fetch('http://localhost:5000/api/settings');
  assert.strictEqual(settingsRes.status, 200);
  const settings = await settingsRes.json();
  assert.strictEqual(settings.recipientName, 'Malak', 'Recipient must be Malak');
  assert.strictEqual(settings.birthdayDate, '2026-11-20', 'Birthday must be 2026-11-20');
  assert.strictEqual(settings.timezone, 'Africa/Cairo', 'Timezone must be Africa/Cairo');
  assert.strictEqual(settings.adminPasswordHash, undefined, 'Password hash must not be leaked');
  console.log('✔ Settings API verified (Malak, Nov 20, 2026, Africa/Cairo, secure)');

  // 3. Timeline endpoint
  const timelineRes = await fetch('http://localhost:5000/api/timeline');
  const timeline = await timelineRes.json();
  assert(timeline.length >= 7, 'Must have at least 7 memories');
  assert(timeline.some((t) => t.title.includes('When We First Met')), 'First met memory must exist');
  assert(timeline.some((t) => t.title.includes('First Picture Together')), 'First picture must exist');
  console.log(`✔ Timeline verified with ${timeline.length} memories`);

  // 4. Gallery endpoint
  const galleryRes = await fetch('http://localhost:5000/api/gallery');
  const gallery = await galleryRes.json();
  assert(gallery.length >= 5, 'Gallery items must exist');
  console.log(`✔ Gallery verified with ${gallery.length} photo/video items`);

  // 5. Photobook endpoint
  const bookRes = await fetch('http://localhost:5000/api/photobook');
  const book = await bookRes.json();
  assert(book.coverTitle.includes('A Little Book of Us'), 'Book cover title must match');
  assert(book.secretPageQuote.includes('Every little moment led me to you'), 'Secret page quote must match');
  assert(book.pages.length >= 4, 'Book must have pages');
  console.log(`✔ Keepsake Photobook verified with cover & ${book.pages.length} pages`);

  // 6. Love Letters endpoint
  const lettersRes = await fetch('http://localhost:5000/api/letters');
  const letters = await lettersRes.json();
  assert(letters.mainLetter.title.includes("Things I Don't Say Enough"), 'Main letter title must match');
  assert(letters.openWhenNotes.length >= 5, 'Open when notes must exist');
  console.log(`✔ Love letters verified with ${letters.openWhenNotes.length} Open When notes`);

  // 7. Date Invitation endpoint
  const inviteRes = await fetch('http://localhost:5000/api/date-invitation');
  const invite = await inviteRes.json();
  assert(invite.choices.length === 3, 'Must have 3 positive choices');
  assert(invite.choices.some((c) => c.label.includes('HELL YEAH')), 'HELL YEAH choice must exist');
  console.log('✔ Date invitation verified with all 3 positive options');

  // 8. Date Questions endpoint
  const questionsRes = await fetch('http://localhost:5000/api/date-questions');
  const questions = await questionsRes.json();
  assert(questions.length === 7, 'Must have all 7 interactive date questions');
  console.log('✔ Date questions verified with 7 rich interactive steps');

  // 9. Simulate Malak submitting her dream date
  const submitRes = await fetch('http://localhost:5000/api/date-submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      invitationAnswerId: 'hell_yeah',
      invitationAnswerLabel: 'HELL YEAH!! ❤️🔥',
      dateType: ['picnic', 'dinner'],
      flowerColor: 'pink_roses',
      flowerType: ['roses', 'tulips'],
      foodChoice: ['pasta', 'desserts_coffee'],
      foodNotes: 'Extra iced matcha and tiramisu please!',
      preferredDate: '2026-11-20',
      preferredTimeOfDay: 'sunset',
      activities: ['cute_pics', 'watch_sunset', 'make_scrapbook'],
      personalNote: 'I cannot wait for our date, you are the sweetest! ♡'
    })
  });
  assert.strictEqual(submitRes.status, 201, 'Submission must return 201 Created');
  const submitJson = await submitRes.json();
  assert(submitJson.success, 'Submission must succeed');
  assert(submitJson.message.includes('wish list is officially in my hands'), 'Confirmation message must match');
  console.log('✔ Date plan submission test passed: Malak successfully sent her dream date!');

  // 10. Admin Authentication
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'malak2026' })
  });
  assert.strictEqual(loginRes.status, 200, 'Admin login must succeed');
  const { token } = await loginRes.json();
  assert(token, 'Token must be returned');
  console.log('✔ Admin login verified with session token');

  // 11. View Date Submissions as Admin
  const adminSubsRes = await fetch('http://localhost:5000/api/date-submissions', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert.strictEqual(adminSubsRes.status, 200);
  const submissions = await adminSubsRes.json();
  assert(submissions.length >= 1, 'Admin must see submitted date');
  const latestSub = submissions[0];
  assert.strictEqual(latestSub.invitationAnswerLabel, 'HELL YEAH!! ❤️🔥');
  assert(latestSub.foodNotes.includes('tiramisu'));
  console.log('✔ Admin retrieval of submitted date plan verified with complete choices & notes');

  // 12. Placeholder media serving check
  const placeholderRes = await fetch('http://localhost:5173/placeholders/hero_together.jpg');
  assert.strictEqual(placeholderRes.status, 200, 'Placeholder assets must serve 200');
  console.log('✔ Placeholder media assets verified (200 OK)');

  console.log('\n🎉 ALL 12 INTEGRATION TESTS PASSED PERFECTLY!');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});

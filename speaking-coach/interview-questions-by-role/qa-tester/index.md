# QA tester interview questions and how to answer them

QA and software tester interviews check how you think about risk. Expect to test a feature out loud (often a login page or an everyday object), describe a bug a developer pushed back on, explain when you automate and when you test by hand, and say what you do when a release is due and testing isn't done. Answer with what you'd test first and why.

By the Speaking Coach team at Sodhera Intelligence. Updated 2026-10-22. Source: https://www.orecci.com/speaking-coach/interview-questions-by-role/qa-tester/

## What a QA interviewer listens for

Anyone can list test types. What hiring managers want is evidence that you think like a tester: you look for what could go wrong, you rank it by how much it matters, and you communicate it so developers fix it rather than argue. Most questions are scenarios, so your answers will be spoken test plans. Organize them, or they turn into a long list of random checks.

## "How would you test this feature?"

Whether it's a login page, a password reset or "this pen", use the same structure out loud:

1. **Ask questions first:** who uses it, on what devices, what are the rules (password length, lockout after failed tries), what's changed recently?
2. **Happy path:** the normal use works.
3. **Negative cases:** wrong password, empty fields, expired reset link.
4. **Edge cases:** very long input, special characters, two tabs at once, slow network.
5. **Non-functional:** security (no hints whether the email exists), accessibility, performance, different browsers.
6. **Priority:** which of these you'd run first if you had one hour.

> Example answer for a password reset: "First I'd ask how long the link stays valid and whether old links stop working once a new one is sent. Then I'd test the normal flow end to end, including the email itself. Next, the risky cases: an expired link, a link used twice, and requesting a reset for an email that doesn't exist, which should show the same message so attackers can't tell which emails are registered. If I only had an hour, I'd do the normal flow and the security cases first, because that's where the real damage would be."

The last sentence, about what you'd do first, is what most candidates leave out.

## A bug developers pushed back on

"Tell me about a bug a developer said wasn't a bug." This checks whether you can disagree with evidence and without ego.

> Example answer: "I reported that our shopping cart total sometimes didn't update when you changed the quantity quickly. The developer closed it as 'can't reproduce'. Instead of reopening it with an angry comment, I recorded a short video, noted the exact steps and network speed, and found it happened on slow connections every time. I sat with him for ten minutes and showed it. He found a race condition and fixed it the same day. Since then I attach a recording to any bug that's hard to reproduce."

It's a [conflict question](/speaking-coach/interview-questions/tell-me-about-a-time-you-had-a-conflict/) in disguise: evidence and a calm conversation beat a comment war.

Severity versus priority often comes up here. Severity is how bad the impact is; priority is how soon it should be fixed. A typo on the homepage is low severity but may be high priority.

## Automation vs manual testing

There's no single right answer. Show that you choose based on cost and value.

| Automate when | Test manually when |
| --- | --- |
| The test runs on every build, like login or checkout | The feature is new and still changing every week |
| The steps are stable and the result is clear-cut | You're exploring to find bugs nobody thought of |
| It's tedious and error-prone by hand, like 50 data combinations | It's about look and feel or usability |
| A failure would be expensive to miss | The test would cost more to maintain than to run by hand |

> Example answer: "I automate the regression tests we run every release, like login, checkout and the main API calls. I keep exploratory testing manual, especially on new features, because that's where I find the bugs nobody wrote a test for."

## Release pressure

"The release is tomorrow and testing isn't finished." Interviewers want to hear that you inform the decision rather than block or rubber-stamp it.

> Example answer: "I'd tell the release owner exactly what's tested, what isn't, and what the risk is, in plain words: 'Checkout and login are fully tested. The new discount codes are only half tested, and that's where most of the code changed.' Then I'd suggest options: delay a day, release without discount codes behind a feature flag, or release with extra monitoring. It's not my call alone, but they should decide with full information."

Show you don't hide gaps, and that you don't treat yourself as the only gate.

## How to practice

Pick an everyday object or feature and test it out loud for two minutes, using the structure above. Then explain one real bug report as you would to a developer who disagrees. Speaking Coach's interviewer can play that developer and push back on what you said. Keep answers organized; [how to prioritize your work](/speaking-coach/interview-questions/how-do-you-prioritize-your-work/) has more on explaining your ranking.

## Questions people ask

### Do QA testers need to code?

It depends on the role. Manual testing roles may not require it, but many QA jobs ask for some automation or scripting. Be honest about your level and what you're learning.

### What should a good bug report include?

A clear title, steps to reproduce, expected and actual results, environment, severity, and a screenshot or recording. Developers should be able to reproduce it without asking you anything.

### How do I answer "How would you test a pen?"

Use the same structure as for software: ask who it's for, test normal use, then edge cases like cold, pressure and dropping it, then safety. They're checking your structure, not your knowledge of pens.

### How do I move from manual testing to automation?

Say what you've already automated, even small scripts, and what you're learning. A concrete next step sounds better than a general wish.

---
Speaking Coach on the App Store: https://apps.apple.com/app/id6767124039
Speaking Coach on Google Play: https://play.google.com/store/apps/details?id=com.sodhera.speakingcoach

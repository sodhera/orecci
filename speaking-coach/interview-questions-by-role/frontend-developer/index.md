# Front-end developer interview questions and how to answer them

Front-end interviews test whether you can explain UI decisions out loud. Expect to design a component while talking, walk through a browser bug you tracked down, describe how you handle a design handoff that doesn't quite work, and justify where state lives in your app. Name the options you considered, what you chose and the trade-off you accepted.

By the Speaking Coach team at Sodhera Intelligence. Updated 2026-10-22. Source: https://www.orecci.com/speaking-coach/interview-questions-by-role/frontend-developer/

## What's different about front-end interviews

Front-end loops usually mix a coding exercise, a UI or component design round, and behavioral questions. The common thread is that you build things people see and touch, so interviewers want to hear you think about users, designers and other developers at the same time. A silent candidate who writes correct code often scores lower than one who explains decisions as they go.

This page focuses on the four conversations that come up most. For coding rounds in general, see the [technical interview guide](/speaking-coach/interviews/technical-interview/).

## Talking through component design

"Design a reusable date picker" or "Build a dropdown that other teams will use" is a design question, not a typing test. Talk through it in this order:

1. **Clarify use:** "Who uses it? Single date or ranges? Mobile too? Does it need to work inside forms?"
2. **Define the API:** the props, the events it emits, what's controlled from outside versus kept inside.
3. **Structure:** the subcomponents, like input, popover, calendar grid.
4. **Accessibility:** keyboard navigation, focus management, screen reader labels.
5. **Edge cases:** time zones, locales, disabled dates, very small screens.

> Example line while designing: "I'll make the selected value controlled, so a parent form owns it, but keep whether the calendar is open as internal state. Nobody outside should need to care about that. If a team does need to open it from outside, we can add an optional prop later without breaking anyone."

Saying out loud what you're leaving out ("I won't handle ranges in the first version") shows judgment, not a gap.

## A browser bug

Interviewers want your debugging path, not a list of browser quirks.

> Example answer: "Our checkout button did nothing for some Safari users on older iPhones. I couldn't reproduce it on my machine, so I asked support for the exact device and version and used a real device from our test pool. The console showed a newer JavaScript method we were calling wasn't supported there. I added a fallback for that one call and a check in our build config for our supported browser list, so it would be caught before shipping next time."

The shape that works: the symptom, how you reproduced it, the evidence, the fix, and what you changed so it doesn't recur.

## Design handoff

"What do you do when a design can't be built exactly as drawn?" This is about collaboration. Avoid stories where you quietly built something different.

> Example answer: "A designer handed over a card layout where text sat over a photo. With real product names, some long, the text ran off the card. I built it quickly with real data, sent screenshots of the three worst cases, and suggested two options: truncate with a tooltip, or move the text below the image on small screens. She picked the second and updated the file. Now I ask for real content examples before I start."

Mention habits: asking about empty, loading and error states early, checking the design at narrow widths, and pairing with the designer for 15 minutes before building, not after. The [UX designer questions](/speaking-coach/interview-questions-by-role/ux-designer/) page shows the same conversation from the designer's side.

## State management choices

"Where should this state live?" and "Why did you use that library?" test whether you choose tools for a reason.

| State | Usually lives | Say why |
| --- | --- | --- |
| Whether a menu is open | Inside the component | Nothing else needs it |
| Form inputs before submit | The form component | Keeps it simple and local |
| Logged-in user, theme | App-wide context or store | Many parts of the app read it |
| Data from the server | A data-fetching or caching layer | Handles loading, errors and refresh |
| Filters and page number | The URL | Shareable, survives refresh |

> Example answer: "I start local and only lift state when two parts of the page need it. On my last project we'd put everything in a global store, including server data, and we had stale data bugs. We moved server data to a caching library and kept the store for the user session only. The store shrank to a fraction of its size and the stale bugs mostly disappeared."

There's rarely one right answer. What interviewers listen for is that you know the trade-off: more global state is easier to reach but harder to reason about.

## How to practice

Pick one component you've built and explain its API out loud in two minutes, as if to a new teammate. Then answer "Why not do it the other way?" for each choice. Speaking Coach's interviewer can play a senior engineer who follows up on what you actually said, and the Tough pressure level adds the interruptions you'll get in a real loop.

## Questions people ask

### Should I talk while coding in a front-end interview?

Yes. Say what you're about to do and why, briefly. If you go quiet to think, say "Give me a second to think about the structure" so the silence has a reason.

### Which framework should I talk about?

The one you know best, unless the job is specific. Explain concepts, like components, state and rendering, in a way that would transfer to another framework.

### How deep should accessibility answers go?

Name concrete practices: semantic elements, labels, focus management, keyboard support and contrast. One real fix you made beats a list of standards.

### What if I disagree with the interviewer's approach?

Say so politely and give your reason, then ask what they'd consider. A respectful technical disagreement is often exactly what they're testing.

---
Speaking Coach on the App Store: https://apps.apple.com/app/id6767124039
Speaking Coach on Google Play: https://play.google.com/store/apps/details?id=com.sodhera.speakingcoach

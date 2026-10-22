---
title: "Software engineer interview questions and how to answer them"
description: "The spoken parts of software engineer interviews: explaining a project, a bug you fixed, tradeoffs and code review conflict, with example answers."
answer: "Outside the coding rounds, software engineer interviews ask you to explain a project you built, a bug you tracked down, a tradeoff you made and a disagreement in code review. Answer each with your own part in it, the options you weighed and a result you can measure, in about two minutes, and expect follow-up questions that go one level deeper."
breadcrumb: "Software engineer"
updated: 2026-10-22
practice_heading: "Explain your project to an interviewer who digs in"
practice_prompt: "Interview me for a backend software engineer role. Ask me to walk you through a project I built, then ask why I chose that design."
questions:
  - Walk me through a project you're proud of.
  - What was your specific contribution to that project?
  - Tell me about a hard bug you fixed.
  - Tell me about a technical tradeoff you made and why.
  - What would you do differently if you built it again?
  - Tell me about a disagreement in a code review.
  - How do you decide when code is good enough to ship?
  - Tell me about a time you had to learn a new technology quickly.
  - How do you explain a technical decision to someone non-technical?
  - Tell me about a production incident you were involved in.
  - Why do you want to work on this team?
related:
  - /speaking-coach/interviews/technical-interview/
  - /speaking-coach/interviews/behavioral-interview/
  - /speaking-coach/interview-questions/tell-me-about-a-time-you-explained-something-complex/
  - /speaking-coach/interview-questions-by-role/frontend-developer/
  - /speaking-coach/interview-questions-by-role/engineering-manager/
---
## The rounds where you talk, not type

Engineering loops usually include at least one conversation with no code at all: a behavioral round, a project deep dive or a hiring manager chat. Strong coders often do worst here, because they describe everything the team built and nothing about what they decided.

Interviewers in these rounds are scoring three things: can you explain technical work clearly, did *you* make real decisions, and how do you behave when engineers disagree. This page covers the spoken answers. For thinking out loud while you code, see the [technical interview guide](/speaking-coach/interviews/technical-interview/).

## Walking through a project

Use this order, and keep the first pass to about two minutes:

1. **The problem, in user terms.** "Checkout was timing out for about one in twenty orders at peak."
2. **Your role.** "I owned the payment service changes. Two others did the front end."
3. **The key decision.** One design choice and the alternative you rejected.
4. **The result.** Latency, errors, cost, time saved. Use a real number or say you didn't measure it.
5. **What you'd change.** This invites the follow-up you're ready for.

Say "I" for what you did and "we" for what the team did. Interviewers listen closely for the switch.

## A bug you fixed

A good debugging story is a narrowing-down story. The interviewer wants your reasoning at each step, not just the root cause.

Example answer (made-up details):

> "Our mobile app showed some users another day's step count, but only after midnight and only in some time zones. I couldn't reproduce it locally, so I added logging around the sync and saw the server was bucketing by UTC while the app sent local dates. My first fix converted on the client, which broke users who travel. So I changed the API to send a time zone with each sync and bucket on the server. I added a test that runs the sync at 11:59 p.m. in three zones. The bug reports stopped that week."

What makes it work: the symptom, the failed first idea, the evidence that changed your mind and the test that stops it coming back.

## Tradeoffs

"Tell me about a tradeoff" is asking whether you see costs, not just choices. Name the options, the criteria, what you chose and what you gave up.

| Part | Example |
| --- | --- |
| Options | Add a cache in front of the database, or rewrite the slow query |
| Criteria | Time to ship, risk of stale data, long-term maintenance |
| Choice | Rewrite the query; caching would show customers outdated stock |
| What you gave up | Two extra days of work and a less dramatic speed-up |

Close with whether it was right in hindsight. "If I did it again I'd add the cache later for the read-heavy pages" shows judgment, not weakness.

## Code review conflict

This is a conflict question in disguise. Show that you separate the code from the person, use evidence and know when to let go.

> "A senior engineer asked me to replace a simple loop with an abstraction he'd written elsewhere. I thought it made the code harder to read for a one-off case. Instead of going back and forth in comments, I asked for ten minutes on a call. He explained two other places that would need the same logic soon, which I hadn't known. We agreed to use his abstraction and add a short comment on why. I learned to ask about context before arguing about style."

Answers where you won the argument are fine too, as long as you show you listened first. See also [disagreeing with your manager](/speaking-coach/interview-questions/tell-me-about-a-time-you-disagreed-with-your-manager/).

## Mistakes to avoid

- **Listing technologies instead of decisions.** "React, Node, Postgres, Redis" is not an answer.
- **Hiding behind "we".** If they can't tell what you did, they will assume you didn't.
- **Going too deep too early.** Start at the level a product manager would follow, then go deeper when asked.
- **No numbers at all.** If you didn't measure the result, say what you would have measured.

The project walkthrough is worth saying out loud several times, because the follow-ups are where it gets hard. In Speaking Coach you can add your CV and the AI interviewer asks about the projects on it, then follows up on what you actually said.

## Questions people ask

### How technical should my project explanation be?

Start at a level a non-engineer could follow, then go deeper when the interviewer asks. That shows you can do both, and lets them choose where to dig.

### What if my best project was a team project?

That's normal. Be precise about which part you owned, which decisions were yours and which you influenced.

### I'm a new graduate. What project should I talk about?

Pick a course, internship or personal project where you made a real design choice and hit a real problem. See [how to talk about your final year project](/speaking-coach/interview-questions/tell-me-about-your-final-year-project/).

### Should I prepare different stories for each company?

Prepare four or five stories, such as a project, a bug, a tradeoff, a conflict and a failure, and reuse them. Change which one you lead with based on the team's work.

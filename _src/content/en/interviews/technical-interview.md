---
title: "How to prepare for a technical interview: thinking out loud"
description: "In a technical interview your reasoning is scored as much as your answer. How to narrate your thinking, ask clarifying questions, handle silence and admit gaps."
answer: "In a technical interview, the interviewer is scoring how you reason as much as whether you reach the answer, so think out loud: restate the problem, ask clarifying questions, say your plan before you start, narrate key decisions as you work, and check your result. When you don't know something, say so plainly and explain how you would find out."
breadcrumb: "Technical interview"
updated: 2026-10-22
order: 6
practice_heading: "Practice explaining your reasoning out loud"
practice_prompt: "Give me a medium technical problem for a backend engineer role. Let me talk through my approach out loud and ask me why I made each choice."
related:
  - /speaking-coach/interview-questions-by-role/software-engineer/
  - /speaking-coach/interview-questions-by-role/data-analyst/
  - /speaking-coach/guides/answer-question-you-dont-know/
  - /speaking-coach/guides/how-to-explain-things-simply/
---
## Why talking matters as much as solving

A silent candidate who reaches the right answer leaves the interviewer guessing: was it understanding, memory or luck? A candidate who talks through a half-finished solution shows exactly how they think, and gives the interviewer the chance to nudge them.

This applies to coding interviews, system design, data and SQL exercises, engineering calculations and troubleshooting scenarios for IT roles. The skill is the same: make your reasoning audible.

Most people find this hard. Solving and speaking compete for attention, so they go quiet for two minutes, then explain everything at the end. It's a skill you can practise like any other.

## A five-step loop to narrate

Use the same loop for every problem. Having a fixed order means you don't have to decide what to say.

| Step | What you do | What it sounds like |
| --- | --- | --- |
| 1. Restate | Repeat the problem in your own words | "So I need to return the first customer who ordered twice in the same day. Is that right?" |
| 2. Clarify | Ask about inputs, limits and edge cases | "Can the list be empty? Roughly how big can it get?" |
| 3. Plan | Say your approach before you start | "I'll start with a simple version, then improve it if we have time." |
| 4. Work | Narrate decisions, not every keystroke | "I'm using a set here so lookups stay fast." |
| 5. Check | Test with an example and edge cases | "Let me run the empty list through this… that returns nothing, which is what we want." |

## Clarifying questions that show judgement

Clarifying questions are not a sign of weakness. Real tasks are underspecified, and interviewers often leave gaps on purpose to see if you notice. Good ones:

- **Inputs:** "What types can this take? Could there be duplicates or missing values?"
- **Scale:** "Are we talking hundreds of rows or millions?"
- **Priorities:** "Is speed more important here, or readability?"
- **Output:** "If there's no match, should I return nothing or raise an error?"
- **Constraints:** "Can I use a standard library function for sorting, or should I write it?"

Two or three questions is usually enough. Asking ten before you start can look like stalling.

## What to say when you go quiet

Sometimes you need to think in silence. That's fine if you say so first:

> "I'm going to take 20 seconds to think about edge cases."

> "Let me sketch this on paper before I explain."

When you come back, summarise: "Okay. I think the tricky case is when two orders have the same timestamp."

If you're stuck, say what you've tried. "I know a brute-force way that checks every pair. That works but it's slow. I'm trying to see if sorting first helps." Interviewers often give a hint at that point, and taking a hint well is a good signal.

## Admitting gaps

You will hit something you don't know. How you handle it is part of the test. There's a full guide to [answering when you don't know](/speaking-coach/guides/answer-question-you-dont-know/), but in a technical setting:

| Situation | Weak response | Strong response |
| --- | --- | --- |
| You've never used the tool | Bluff through it | "I haven't used Kafka directly. I've used RabbitMQ for queues, so I'd expect similar concepts. Here's how I'd reason about it." |
| You forgot a function name | Freeze | "I don't remember the exact method name. I'll call it "findFirst" and we can check it later." |
| You realise your approach is wrong | Keep going quietly | "Wait, this breaks if the list is sorted backwards. Let me step back." |
| A concept question you can't answer | "I don't know." Full stop | "I'm not sure. My guess is X, because Y. I'd confirm it in the docs." |

Catching your own mistake out loud is a strength, not a weakness. It's what good engineers do in code review.

## Example: narrating a small problem

Problem: "Given a list of customer email addresses, return the ones that appear more than once." A made-up example of how it might sound.

> "So I want every email that shows up at least twice. Should I treat uppercase and lowercase as the same? *[Interviewer: yes.]* Okay, I'll lowercase everything first. And trim spaces, since sign-up forms often add them. My plan: go through the list once, count each email in a dictionary, then return the ones with a count above one. That's one pass, so it should be fine even for a large list. Writing it now… I'm lowercasing and trimming here, counting here. Let me test: two copies of 'ana@example.com', one in capitals. Lowercasing makes them match, count is two, so it's returned. Empty list returns an empty result. I think that's correct. If memory were tight, I could sort first instead, but that's slower."

Notice it's not a commentary on every character. It's the decisions: the assumption, the plan, the reason for a choice, the test.

## How to practise

1. **Solve problems out loud alone**, recording yourself on your phone. Play it back and note every silence longer than about 15 seconds.
2. **Use the five-step loop on every problem** until it's automatic.
3. **Do mock interviews with a friend** who stays quiet unless you ask, then gives one hint if you're stuck.
4. **Explain a past project** to someone non-technical in two minutes. If they follow it, your interviewer will too. See [how to explain things simply](/speaking-coach/guides/how-to-explain-things-simply/).

For the non-coding parts of the day, such as explaining your projects and answering follow-ups, Speaking Coach can play an interviewer who asks why you made each choice, and the feedback shows your pace and long pauses.

## Questions people ask

### What does "think out loud" mean in a technical interview?

It means saying your reasoning as you work: what you understand, what you're assuming, which approach you're choosing and why, and how you're checking it. Not every keystroke, just the decisions.

### Is it okay to ask questions during a technical interview?

Yes, and it's expected. Clarifying questions about inputs, scale and edge cases show judgement. Two or three before you start is a good amount.

### What if I can't solve the problem?

Keep talking through what you've tried and why it doesn't work yet. A clear partial solution with good reasoning can score better than a silent correct one.

### How do I stop going silent when I concentrate?

Announce the silence: "Give me 20 seconds to think." Then summarise what you concluded. Practise this on every problem until it's a habit.

### Should I write a brute-force solution first?

Often yes. Say it out loud, note its weakness, then improve it. It shows you can get to something working before optimising.

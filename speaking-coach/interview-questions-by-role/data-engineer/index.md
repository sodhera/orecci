# Data engineer interview questions and how to answer them

Data engineer interviews ask you to design a pipeline out loud, describe a time bad data reached a dashboard, choose between batch and streaming for a real case, and explain how you work with analysts who depend on your tables. Start every answer from who uses the data and how fresh it must be, then name your choices and their trade-offs.

By the Speaking Coach team at Sodhera Intelligence. Updated 2026-10-22. Source: https://www.orecci.com/speaking-coach/interview-questions-by-role/data-engineer/

## What data engineering interviews look for

Most data engineering loops include SQL or coding, a pipeline or system design round, and behavioral questions. The design round is where people lose ground, because they start drawing tools before asking what the data is for. Interviewers want to hear you reason from the use case: who reads the data, how fresh it must be, what happens when it's wrong, and what it costs.

## Designing a pipeline out loud

"Design a pipeline that gets app events into the warehouse." Use a steady order and say each step:

1. **Requirements:** who uses it, for what, how fresh (daily, hourly, seconds), how much data, how long to keep it.
2. **Ingestion:** how events arrive, and what happens if the source sends duplicates or arrives late.
3. **Storage layers:** raw data kept as received, then cleaned, then modeled tables for analysts.
4. **Transformations:** where they run, how they're tested, how they're scheduled.
5. **Reliability:** reruns that don't double-count, alerts on failures and on suspicious volumes.
6. **Consumers:** the tables analysts use, documentation, and who owns them.

> Example line while designing: "Since the requirement is a daily dashboard, I'd start with batch. I'd land raw events partitioned by date and never modify them, so we can always rebuild. The cleaned layer dedupes on event ID. Every job overwrites its date partition rather than appending, so if it fails halfway and reruns, we don't get double counts."

That last point, safe reruns (idempotency), is one of the most common follow-ups. Say it before they ask.

## Data quality failures

"Tell me about a time bad data reached a dashboard." Interviewers want ownership, fast communication and a lasting fix.

> Example answer: "Our weekly revenue dashboard showed a 20 percent jump one Monday. The sales team was about to celebrate. I traced it to an upstream change: the payments team started sending refunds as separate events, and our pipeline counted them as new orders. I posted in the analytics channel that the number was wrong before anyone presented it, fixed the logic and backfilled the week. Then I added a check that alerts if daily revenue moves more than a set amount from the last four weeks' average, and we agreed with the payments team to announce schema changes in advance."

Name the checks you use: row counts, null and uniqueness checks on keys, freshness, and comparisons to known totals.

## Batch vs streaming

"When would you choose streaming?" There's no single right answer. Show you choose by need and cost.

| Choose batch when | Choose streaming when |
| --- | --- |
| Reports are read daily or hourly | Decisions happen in seconds, like fraud checks or live inventory |
| Correctness matters more than speed | A delay costs real money or harms users |
| The team is small and needs simplicity | You have people to run and monitor it all the time |
| Data arrives in files or exports | Data arrives as a constant flow of events |

> Example answer: "I default to batch, because it's simpler to test, rerun and explain. On my last team, marketing asked for a real-time dashboard. When I asked what they'd do differently minute by minute, the answer was nothing; they checked it every morning. We moved the job to hourly, which was cheaper, and everyone was happy. For fraud scoring, I'd go to streaming, because a delayed decision is a lost payment."

## Working with analysts

Analysts are your customers. "An analyst says your numbers don't match finance's" is a common scenario.

> Example answer: "I'd sit with the analyst and compare one small slice, one day and one product, between the two numbers. Most mismatches come from definitions, like gross versus net, time zone, or when a refund counts. Once we find it, I'd write the agreed definition in the table documentation and tell everyone who uses it, so we don't have the same argument next month."

Mention habits that build trust: documented tables, a clear owner for each, announcing changes, and asking analysts what questions they're trying to answer before building. The [data analyst questions](/speaking-coach/interview-questions-by-role/data-analyst/) page shows the same relationship from their side.

## How to practice

Talk through one pipeline design out loud in about ten minutes, then have someone throw failures at it: "The source sends the same file twice. Now what?" Speaking Coach's interviewer follows up on what you actually said, which is good practice for those follow-ups. The [technical interview guide](/speaking-coach/interviews/technical-interview/) covers thinking aloud in general.

## Questions people ask

### How much SQL will a data engineer interview include?

Usually a lot: joins, aggregations, window functions and debugging a query. Practice explaining your query out loud as you write it.

### Should I name specific tools in a design round?

Name them when it helps, with a reason. The interviewer cares more about the shape and trade-offs than the brand of each box.

### What's the best way to describe a pipeline I built?

Start with the business purpose, then the data volume and freshness, then the design and one problem you solved. Two minutes is enough before they ask questions.

### How do I explain a data issue to non-technical people?

Lead with what's wrong, what it affects and when it'll be fixed. Explain the cause in one sentence, without tool names.

---
Speaking Coach on the App Store: https://apps.apple.com/app/id6767124039
Speaking Coach on Google Play: https://play.google.com/store/apps/details?id=com.sodhera.speakingcoach

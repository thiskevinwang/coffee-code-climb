---
title: "Balancing Work, Hobbies, and Learning"
date: "2020-10-22T13:07:20.934Z"
description: "Reporting in for 2020 Q4"
tags: ["software engineering", "rock climbing", "rust", "learning", "work"]
# image: db-image.png
---

## Work—60%

Since my last post in July, I've been mostly busy with work. I transitioned from a frontend role to a fullstack role and have been working things like Node and Kotlin microservices, greenfield projects, and internal tools.

### DevOps-y stuff

I made an internal tool—a CMS of sorts, with NextJS, PgTyped, AWS RDS—that has a Jenkins cron job to write snapshots of RDS data to a versioned S3 item, every hour. I set up another Jenkins job to run on pull-request updates and post a diff between an in-code file and that S3 item to Slack.

### Writing Specs and Getting Rejected

I was tasked with spec'ing out a `Kotlin` feature-flagging & A/B-testing micro-service. This was met with a lot of criticism, and eventually 86'd. In the end, it was a great exercise and learning experience in Kotlin—I Dockerized my first Kotlin API Server—and in learning to communicate the value add of a service or new project to staff-level engineers (aka, people who really know their sh\*t).

### Library Work

I also picked up some internal library work, which has been a new realm for me.

## Hobbies—15%

Life outside of work has been mostly routine, but I do have some goals that I'm working towards.

### 🧗🏻‍♂️ Bouldering

I've been acquiring some new [rock climbing projects](https://www.instagram.com/p/CGilbOwjWXY/).

- **"Homefront Arete" - Bradley, CT**
  - I didn't know where the finish holds were, and gave up at the jug.
- **"Rocking Chair Direct - Haycock, PA**
  - This thing is just nails. I have all the moves to the lip in 1 dialed piece. The rest is a mystery.
- **"Unleaded" - Ice Pond, NY**
  - I've never touched this, but have been wanting to for a long time. Time to stop procrastinating.
- **"Air Jordan" - Lost City, NY**
  - Just a cool climb that I saw within my very first year of climbing. I should work it, and finish it.

### 👨🏻‍💻 Coding

I've been working on things, trying to gain a better understanding of lower level systems. See [rust-raspberry-pi-twitter-bot](https://twitter.com/thekevinwang/status/1316729277514018817?s=20).

## Learning—15%

I finally made the switch from `fish` to `zsh` (+`oh-my-zsh`). There were too many small discrepancies that made `fish` a pain point. All company documentation for CLI commands were written as `bash` functions. `fish` has an entirely different syntax and though I managed to port some over to `fish`, others were too difficult, given my limited knowledge, and just resulted in lowered productivity. So to _go with the flow_, I switched over to `zsh`. After setting up multiple plugins, I have no complaints 🥳.

I revisited my Raspberry Pi, after

## Misc Life Things—10%

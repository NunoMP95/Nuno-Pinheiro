---
title: Scheduling Optimisation Engine · Case study
description: How a 12-month manual planning process became a service that generates a deconflicted schedule across 21 sites.
order: 1
label: Case study · Public sector · NDA-safe
heading: From 9 months of spreadsheets to a digital scheduling solution
project: Scheduling Optimisation Engine (SOE)
facts:
  - term: Role
    detail: UX Designer, then Lead UX Designer
  - term: Timeline
    detail: Dec 2021 to present
  - term: Users
    detail: 100+ across 6 roles, 21 sites
  - term: Team
    detail: BAs, a Service Designer, FE & BE Devs
contents:
  - { id: overview, label: Overview }
  - { id: research, label: Research }
  - { id: design, label: Design }
  - { id: testing, label: Testing }
  - { id: launch, label: Adoption }
  - { id: outcomes, label: Outcomes }
---

{% csSection "overview", "01 · Overview" %}
## Overview

Training Schedulers (TSs) had to produce an training schedule across 21 sites, with every resource and dependency fitting a set of planning constraints. An earlier system had been built for this, but people stopped using it because it was flawed. They went back to spreadsheets and emails, and the planning of feasible schedule took about 9 months.

The manual schedule planning was a tidious job which didn't allow the allocation of resource in advance, Schedulers would only do this 8 weeks prior.

The new system takes in a large set training and course data, and generates a schedule that deconflicts resources and dependencies automatically. I joined as the only UX designer on the build and became Lead UX Designer in the last year.
{% endcsSection %}

{% csSection "problem", "02 · The problem" %}
## The problem

- **Slow, manual planning.** 9 months of spreadsheets and emails to reach one feasible schedule.
- **Low trust.** Users had already abandoned one system, so this one had to earn their confidence.
- **Complexity.** 6 user roles, 21 sites and many dependencies and constraints.
- **Standards.** The service had to meet the client's design standards, GDS and WCAG 2.2.
{% endcsSection %}

{% csSection "research", "03 · Research" %}
## Mapping the whole service

### Process-mapping workshops

Working with 2 business analysts and a service designer, I presented a draft process map to stakeholders to validate it and fill knowledge gaps. In workshops, stakeholders placed sticky notes wherever they felt they belonged. I then translated those business-as-usual notes into user requirements the team could design and build.

### Service Blueprint

The Blueprint showed what the screens alone would have hidden:

- back-end data calculations the engine considers
- background processes running alongside the workflow
- business activities that were out of scope
- handovers and approvals between user roles

{% figure "/images/case-studies/scheduling-optimisation-engine/SOE Service Blueprint.png", "Redacted Service Blueprint", "Simplified recreation of the service blueprint structure: each role's steps mapped against frontstage, backstage and support processes." %}
{% endcsSection %}

{% csSection "design", "04 · Design" %}
## Designing faster, more consistently

Wireframing took too long, components didn't match across the design team, and developers ended up building inconsistent versions. I built a UI kit aligned to the client's standards.

<div class="cs-cards">
  <div class="cs-card"><span class="cs-num">50+</span><p>components, from tables and icons to banners, inputs and dropdowns</p></div>
  <div class="cs-card"><span class="cs-num">3</span><p>people use it: me, an associate UX designer and the service designer</p></div>
  <div class="cs-card"><span class="cs-num">✓</span><p>click and hover interactions pre-mapped, so designers only change the text</p></div>
</div>

Each component is labelled with when to use it. <span class="todo">Add: time saved, e.g. prototype build time before and after. Note that how-to-use docs are still to be written.</span>

### The hardest problem: changing a live schedule

Planners need to change parts of an existing schedule, adding, removing or editing items, while every resource stays deconflicted. Rather than pushing back on costly requirements, I found workarounds and tested them with users to see which gave the most value without too much time or effort.

<p class="todo">Add: how you solved it, e.g. a preview of changes, conflict warnings or confirmation steps.</p>
{% endcsSection %}

{% csSection "testing", "05 · Testing and accessibility" %}
## What testing changed

Usability testing uncovered further requirements and scheduling rules nobody had considered. That caused friction: users felt testing something that didn't yet produce feasible results wasn't worth their time. So we validated the new requirements, made sure developers understood them, and tested internally before taking the product back to the client for UAT.

<blockquote class="cs-quote">The audit found poor colour contrast, confusing form labels, and colours that were hard to perceive for users with dyslexia. A deeper audit is planned.</blockquote>
{% endcsSection %}

{% csSection "launch", "06 · Launch and adoption" %}
## Designing for adoption

The old system failed because people didn't use it, so adoption was a design problem too.

<ol class="cs-phases" aria-label="Delivery phases">
  <li><small>01</small>Discovery</li><li><small>02</small>Design and build</li><li><small>03</small>UAT</li><li><small>04</small>Live pilot</li><li><small>05</small>Dual running</li>
</ol>

- Ran adoption training workshops, which also uncovered bugs and improvements.
- Wrote 5 support materials: an end-to-end workflow guide, a Change Request guide, an FAQ built from questions raised in UAT, pilot and dual running, a best-practice and troubleshooting guide, and a video demo.
- Tracked 96 tickets during dual running: questions, bugs, improvements and new requirements. The most important were anything stopping users doing what they could already do in spreadsheets.
- Improvements identified included Gantt chart functionality, a dashboard with infinite scroll and a more concise solution metrics page.
{% endcsSection %}

{% csSection "outcomes", "07 · Outcomes" %}
## Outcomes

<ul class="cs-stats">
  <li><span class="cs-big">21</span><span>sites planned in one service</span></li>
  <li><span class="cs-big">100+</span><span>users across 6 roles</span></li>
  <li><span class="cs-big">96</span><span>dual-running tickets tracked</span></li>
  <li><span class="cs-big todo">?</span><span>time to a feasible schedule (was 12 months)</span></li>
</ul>

<p class="todo">Add: how many users actively use it compared with the old system, and whether the 96 tickets and audit issues were resolved.</p>
{% endcsSection %}

{% csSection "learned", "08 · Reflection" %}
## What I learned

- <span class="todo">Draft for you to review:</span> keep research findings visible. Some requirements raised early were deprioritised and later requested by users.
- <span class="todo">Add 1–2 more: what leading the UX taught you, and what you'd measure earlier next time.</span>
{% endcsSection %}

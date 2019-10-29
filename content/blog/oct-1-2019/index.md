---
title: "Number of Sundays on the First of the Month, in the 20th Century"
date: "2019-10-01T00:57:16.192Z"
description: "Revisiting a coding interview question that I failed, 6 months ago."
tags:
  [
    "sundays",
    "first",
    "month",
    "20th century",
    "algorithm",
    "coding",
    "interview",
    "exercise",
    "programming",
    "for loop",
    "typescript",
    "javascript",
  ]
# image: coffee.png
---

## TL;DR + Solution

Revisiting a coding interview question that I failed, 6 months ago.

There are **171 Sundays** that fall on the first of the month, in the 20th century, but that is irrelevannt.

```ts
// sundays.ts
//
// excute this with
// ts-node sundays.ts

const isLeapYear = (year: number): boolean => {
  let result = false
  if (year % 4 === 0) result = true
  if (year % 100 === 0) result = false
  if (year % 400 === 0) result = true
  return result
}

const REG_YEAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const LEAP_YEAR = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const getDaysInYear = (year: number): number[] =>
  isLeapYear(year) ? LEAP_YEAR : REG_YEAR

function main() {
  let sundayCounter = 0
  let currentDay = 1 + (isLeapYear(1900) ? 366 : 365)

  for (let i = 1901; i <= 2000; i++) {
    const days = getDaysInYear(i)
    days.forEach(num => {
      currentDay += num
      currentDay = currentDay % 7
      if (currentDay === 0) sundayCounter += 1
    })
  }

  console.log(sundayCounter) // logs your answer to console output
  return sundayCounter
}

main()
```

## Personal Reflecting

About 6 months ago, I was trying to balance learning programming, an unpaid web development internship 3 days a week, and a continuous job hunt, all at once. It was hectic. Now, I'm reflecting on a coding interview question that I failed during that time.

It is totally worth noting that my interviewer was so encouraging, and the experience was overall very pleasant and educational. Had he not been so kind, I might've gave up on self-teaching programming, for a week or two, or indefinitely...

Thanks S.P.!

### The Interview Question

> Without using any date/time libraries, figure out how many Sundays fell on the first day of the month during the twentieth century: **January 1, 1901 to December 31, 2000**
>
> Dec 31, 1899 was a Sunday
>
> On years evenly divisible by 4, February has 29 days, except on a century, unless the year is divisble by 400. On all other years February has 28 days.

### Struggles + Attempt

Looking back, I had no idea where to begin tackling this. I was missing a few key points in my understanding.

1. Modulus is my friend
2. How do I establish a _starting point_?
3. Expect "nested for-loops"

#### ✖ Establishing a Starting Point

I was able to establish the helper functions that I'd need to call on each iteration, but I wasn't able draw the line from Jan 1, 1900 to Jan 1, 1901, to establish my starting point.

If I take an array of days from Sunday...Saturday

```ts
// 0 === sunday
// 6 === saturday
const days = [0, 1, 2, 3, 4, 5, 6]
```

That means Monday === 1. But what I was missing was that Monday could also equal 8, 71, 106, and (n \* 7) + 1. All I needed to do was add 365 to my reference point and "modulo" by 7 to get the day-of-week of my starting point.

```ts
// Monday - Dec 31, 1899
const clue = 0

// Monday - Jan 1, 1900
const reference = 1

// 1900 is a regular year, so it has 365 days
// Tuesday - Jan 1, 1901
const currentDay = (reference + 365) % 7 // 2
```

#### ✖ Visualizing the Days Per Month

This is how I visualized the days for a regular year.

```ts
let currentDay = /* some value I never resolved */
const REG_YEAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
```

But I couldn't seem to figure out how to check if Sunday was on the first day of each. If I visualized it differently, it might've helped. Like:

```ts
const ALSO_REG_YEAR = [3, 0, 3, 2, 3, 2, 3, 3, 2, 3, 2, 3]
const LEAP_YEAR = [3, 1, 3, 2, 3, 2, 3, 3, 2, 3, 2, 3]
```

And "for each of these, increment your current day. If it, modulo 7 equals 0, increment your sunday counter."

#### ✖ I Ran Out of Time

After an hour, I think my code looked something like this, but 100x messier:

```ts
const isLeapYear = (year: number): boolean => {
  let result = false
  if (year % 4 === 0) result = true
  if (year % 100 === 0) result = false
  if (year % 400 === 0) result = true
  return result
}

const REG_YEAR = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const LEAP_YEAR = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

const getDaysInYear = (year: number): number[] =>
  isLeapYear(year) ? LEAP_YEAR : REG_YEAR

function main() {
  let sundayCounter = 0

  /**
   * I never established a starting 'index' for my
   * function to base off of.
   */
  let currentDay = undefined

  for (let i = 1901; i <= 2000; i++) {
    const days = getDaysInYear(i)

    for (let j = 0; j < 12; j++) {
      /**
       * I couldn't figure out what to do with the number of days
       * in each month, and undefined starting point.
       *
       * I also couldn't figure out the logic for when I should
       * increment my sundayCounter
       */
    }
  }

  return sundayCounter
}
```

I gave a good effort, my interviewer commended me for explaining my processes clearly as well as getting really close to the solution, but in the end, I couldn't solve the task, and thus, didn't pass the cut-off point for what they were looking for in a junior engineer.

I left the interview defeated, but happy and inspired... and I immediately googled the solution.

## Today, Looking Back

I tried solving this, and honestly it still gave me a tough time.

### What's the Time Complexity?

Even now, 6 months of full-time frontend engineering (_psh, css, am I rite? lolz_) later, I'm not confident in how the time-complexity should be notated... **_O(n)_**? There is a nested for-loop, but the inner for loop only doesn't grow with the outer (if the outer were to grow).

### Any Other Approaches?

One of my brother's friends said,

> there are only 14 different ways to have a calendar

Leap/Non-leap (2) \* each day of the week falling on Jan 1 (7) = (14).

So for the sake of learning, I'll find time to go back and make an alternate function, using this approach.

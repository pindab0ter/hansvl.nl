---
title: Power shutoff automation in Factorio
slug: power-shutoff-automation-in-factorio
date: 2024-04-07T12:03:10+02:00
description: How to automate the shutoff of your coal power plants in Factorio.
categories:
  - Gaming
series:
  - Factorio
cover:
  src: accumulator-ui_cover.png
  title: Accumulator UI
  alt: A UI element showing an accumulator sending a signal in Factorio.
draft: false
---

# Our goal

In Factorio, when you start building solar panels, you will quickly start to resent the coal power
plants constantly burning fuel when they shouldn’t be. Let’s assume you have
[accumulators](https://wiki.factorio.com/Accumulator) to store the power your solar panels provide,
and that you have enough to get you through the night. Most of the time, at least.

The accumulators provide the current charge percentage as a signal, so like the good Factorio
engineer you are, you connect your accumulator to your
[offshore pump](https://wiki.factorio.com/Offshore_pump) and set it to enable only when the
accumulators are below some charge level. Luckily all accumulators in a power network always have
the same amount of charge.

![Simple automation](simple-automation.jpg "The offshore pump is shut off because the accumulators have enough charge.")

This works, but this results in the power level hovering around 30%, with the steam engines
flickering on and off as the accumulators charge and discharge.

![Coal power flickering](coal-power-flickering.jpg "The chart shows the coal power turning off and on around the 30% mark.")

We can do better. We can have the offshore pump turn on, and then have it run until it reaches a
certain percentage—say 80%. We can already turn the offshore pump on, but how do we decide when to
shut it off again?

Factorio offers several [combinators](https://wiki.factorio.com/Combinators) to work with basic
signal logic. So what we could do is turn the pump on and then use an `AND` gate to turn the pump
off when the pump is on and the accumulator charge is over 80%.

Unfortunately, neither the offshore pump, the boiler nor the steam turbines provide us with a
signal[^signals] to tell us whether they’re on or off.

# Flip-flops

Enter [flip-flops](<https://simple.wikipedia.org/wiki/Flip-flop_(electronics)>). Flip-flops, also
known as latches, are electronic circuits with two possible stable states, `1` or `0`, on or off.
Being stable means they ‘remember’ their state, which is why these are building blocks of computer
memory. This is, in effect, a 1-bit memory cell.

Please note that I do not have any electrical engineering background, and as such I will be talking
about these from a programming perspective, not an electrical one. With that out of the way:

Flip-flops have two inputs, and one output. The inputs are called ‘set’ and ‘reset’. When a signal
is sent to the _set_ input, the input turns on if it wasn't already. If you then send a signal to
the _reset_ input, it turns off again.

For a visual explanation by one of my favourite YouTubers Sebastian Lague, please watch this
timestamped section of the video called
[How Do Computers Remember?](https://youtu.be/I0-izyq6q5s?t=73).

# Implementing a flip-flop in Factorio

With Factorio’s combinators, we have all the tools to build our own flip-flop. We’re setting out to
remember whether the offshore pump is providing water to our coal generator, to be able to determine
when to shut it off again.

![Factorio flip-flop](factorio-flip-flop.png "A flip-flop implemented using Factorio’s combinators.")

The accumulator is sending a signal to two arithmetic combinators.

1. The accumulator signal is sent to a decider combinator that outputs 1 when that signal is `<`
   30%. This is our `set` signal.
2. The accumulator signal is also sent to a decider combinator that outputs 1 when the signal is
   `>=` 80%. This is our `reset` signal.
3. This arithmetic combinator performs a boolean `OR` (`|`) on the `set` signal and the output of
   this flip-flop. This combination is what causes the steady state, as you will see.
4. This decider combinator takes the reset signal and performs a boolean `NOT` (`!=`) on the signal.
   This way, if no signal is sent to the `reset` input, we send a `1` and vice versa.
5. This final decider combinator performs a boolean `AND` on the output of the `set` and the
   (`NOT`ed) `reset` signal. As long as the signal is `set` and `NOT reset`, we output `1`.

   This `1` is also sent back to the `OR` combinator `3`, which will keep the flip-flop in the `1`
   state.

The final step is to send the output of that final decider combinator—the output of our flip-flop—to
our offshore pump, and voilà! We have successfully buffered our signal!

![Generator is on when it should be!](generator-on-when-it-should-be.png "The coal generator is on, even though there is more than 30% charge in the accumulators.")

---

**Update (2024-05-10):**

When reading through the
[Circuit network cookbook](https://wiki.factorio.com/Tutorial:Circuit_network_cookbook#Latches), I
found out that you can make a flip-flop using just one decider combinator. By running a signal wire
from the output back to the input, you can create a flip-flop that remembers its state.

![Single decider flip-flop](single-decider-flip-flop.png "A flip-flop implemented using a single decider combinator.")

The only downside of this approach is that the output signal (in this case `S`) is always the same
as the input signal, rather than allowing you to choose any signal you want.

[^signals]:
    A nice overview of which devices send and/or receive which signals can be found
    [here](https://wiki.factorio.com/Circuit_network#Devices).

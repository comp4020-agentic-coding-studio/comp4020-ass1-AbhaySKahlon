# Assignment 1 reflection

**What was the breakthrough that moved the work forward?**

The breakthrough wasn't a feature, it was noticing when "add more detail" was
the wrong instruction to give. Early on I kept asking the agent to make the
illustrated Earth, ISS and Moon scenes look more convincing, and each pass
added geometry without adding believability. The actual turning point was
deciding to throw that approach away and use real NASA photographs instead —
and, separately, realising the oversized information card was competing with
the scenes rather than supporting them, so the fix was to shrink the UI, not
polish it. The seams between atmosphere sections taught me the same lesson a
different way: a colour-matching pass didn't work, and only looking at the
actual rendered pixels in Playwright showed the SVG fills were opaque and
physically causing the cut. In every case, the fix that worked was a diagnosis
followed by a structural change, not another round of tweaking the same
approach.

**What did this work change about who I want to be as a software developer?**

I've stopped treating the agent's first output as done. I now direct it with a
narrow, checkable scope, verify the actual rendered page instead of trusting a
description of it, and use `pnpm check` and Playwright as the thing that tells
me if a change is real — not my impression of the diff. More specifically, I
want to keep the habit of asking "is this approach fundamentally wrong" before
asking "can this be tweaked further," because every genuine improvement in
this project came from answering that question honestly and being willing to
delete work that wasn't going to get there.

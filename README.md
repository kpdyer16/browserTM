Browser TM™

It's a toy implementation of a Turing Machine.. in a web browser, vanilla HTML, CSS, and JS
This makes it runnable offline with no extra work.
All the fun without the bloat :)

The Turing Machine will be programmable and runnable in real time,
and the tape will is animated as it runs

# TM Syntax

// ignore white space
<state_definition>: <state_name>: <transition_definition> <state_definition>
<transition_definition>: <tape_symbol>, <state_name>, <tape_symbol>, <tape_head_direction> <transition_definition>
<tape_symbol>: any single non-white space character
<state_name>: \[A-Za-z0-9_]+
<tape_head_direction>: \[LRSlrs<>]

# Example TM
// reads the tape from left to right until an empty tape cell has been reached,
// replacing any a's encountered with b's, and vice versa.
start_state:
  a, start_state, b, R
  b, start_state, a, R
  \_, H, \_, S

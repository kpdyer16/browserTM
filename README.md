Browser TM™<sup>™</sup><sup><sup>™</sup></sup>
Note: not actually trademarked

It's a toy implementation of a Turing Machine.. in a web browser, vanilla HTML, CSS, and JS
This adds portability, it can be downloaded and run offline, and it's bare-bones, no bloat.

On a technical level, it's more aptly called a Universal Turing Machine, as described by Alan Turing. It takes an encoding of a Turing Machine (a "program" in our TM language) and an initial tape as input, and runs that Turing Machine with the tape given as input. 

As of now, it's a working implementation, but it could be improved upon by writing a proper TM language compiler, tools to create a compiler for a custom TM language, ability to import and export programs, better control over TMs that have gone rogue, performance optimizations, and more.

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

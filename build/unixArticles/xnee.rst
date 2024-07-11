xnee/cnee mouse automation
==========================

GNU Xnee/cnee is a program that can record and playback mouse and keyboard inputs in x11 environments. Keyboard playback is at the normal rate, however we can playback mouse inputs at faster rates. 

| The example below plays the mouse input back at 4x the input speed.
| Record mouse movements ``cnee --record -o mouse_test --mouse``
| Playback mouse movements at 4x speed ``cnee --replay -f mouse_test --speed-percent 25``

| We can also record and play back keyboard movements, but they only run at input speed.
| Record keyboard input ``cnee --record -o keyboard_test``
| Playback keyboard input ``cnee --replay -f keyboard_test``

# Musical Screen Lock

## What is it?

Musical Screen Lock application is a React-Native based application. User can set a musical pattern for device's lock screen and unlock the device with it. It doesn't only support melodies of patterns, but it also measures lengths and distances between notes.


## Features

- [x] Can store melodies and note lengths at the same time
- [x] Takes input 4 or 5 times, so it ensures the length ratios of each note
- [x] Stores note lengths as ratios, so as long as user keeps the same melody, faster or slower he/she plays it doesn't change the result.
- [x] Note lengths have .35 error tolerence to ignore small differences
- [x] Program also has a free play mode, in case user wants to just play the instruments
- [x] Has bongo drums as the instrument
- [x] Application also supports a PIN code pattern in order to help users if they forget their patterns.
- [ ] More instruments will be added
- [ ] Can manage phones default lock privileges and disable them
- [ ] IOS doesn't support third party screen locks, so main feature will be available in Android only
- [ ] Application will prevent all other sscreens to stay on front until pattern is entered.

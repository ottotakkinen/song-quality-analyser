# Audio File Quality Analyser

Audio File Quality Analyser is a simple website to determine whether an audio file is suitable for use. Analysis is done client side which means that the website also works in offline mode (in the future).

This is a hobby project for me to check my audio files before adding them to my DJ library.


## Live Site

This project is live on Netlify here:

[https://song-quality.netlify.app/](https://song-quality.netlify.app/ "Live Site")


## Technologies

HTML/CSS/JS

[Meyda.js](https://meyda.js.org/) for Fast Fourier Transforms client side
## About

This project is mostly for .mp3 files, since lossless audio extensions don't suffer from the same problems. The main idea is to be able to drop an mp3 file from a DJ pool or similar service to the website to filter out bad quality files.

Checking the bitrate of the file is not enough in all cases. Once a file has been rendered as a lower bitrate version, the quality can not be increased even if the file was rerendered at a higher bitrate.

To combat this, the website runs the audio file through a FFT (Fast Fourier Transform) and then analyses the frequency spectrum to figure out the maximum frequency. From this frequency the quality of the file can be quite accurately estimated.

Analysis of different mp3 bitrates by Søren B. Nørgaard [here](http://soerenbnoergaard.dk/project_mp3_comparison.html).

## Todo

- Refactoring everything
- UI design
- Waveform optimization
- Fixing randomly grading files lower than they are


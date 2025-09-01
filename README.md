# Audio Converter for VSCode

A VSCode extension that allows you to convert audio files to WAV or MP3 formats with customizable settings directly from the file explorer.

## Features

- **Right-click conversion**: Convert audio files by right-clicking in the file explorer
- **Multiple formats supported**: Input formats include MP3, WAV, FLAC, AAC, OGG, M4A, WMA, AIFF, AU
- **Output formats**: Convert to WAV or MP3
- **Customizable settings**:
  - Sample rate: 8000, 16000, 22050, 44100, 48000, 96000 Hz
  - Channels: Mono (1) or Stereo (2)
  - For WAV: Bit depth (16, 24, 32-bit PCM)
  - For MP3: Bitrate (128, 192, 256, 320 kbps)
- **Progress indication**: Real-time conversion progress with cancellation support
- **Error handling**: Comprehensive error messages and cleanup

## Requirements

This extension requires **FFmpeg** to be installed on your system and available in your PATH.

### Installing FFmpeg

- **Windows**: Download from [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
- **macOS**: `brew install ffmpeg`
- **Linux**: `sudo apt install ffmpeg` (Ubuntu/Debian) or equivalent for your distribution

## Usage

1. Right-click on any supported audio file in the VSCode file explorer
2. Choose from the conversion options:
   - **Convert to WAV**: Quick conversion with default settings (44.1kHz, stereo, 16-bit)
   - **Convert to MP3**: Quick conversion with default settings (44.1kHz, stereo, 320kbps)
   - **Convert Audio with Options**: Choose custom settings for format, sample rate, channels, and quality

The converted file will be saved in the same directory with "_converted" appended to the filename.

## Extension Settings

This extension does not contribute any VSCode settings.

## Known Issues

- FFmpeg must be installed and available in system PATH
- Large files may take significant time to convert
- Some exotic audio formats may not be supported

## Release Notes

### 0.0.1

Initial release with basic audio conversion functionality.
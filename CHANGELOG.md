# Change Log

All notable changes to the "audio-converter" extension will be documented in this file.

## [0.0.1] - 2025-01-09

### Added
- Initial release of Audio Converter extension
- Right-click context menu for audio file conversion
- Support for multiple input formats: MP3, WAV, FLAC, AAC, OGG, M4A, WMA, AIFF, AU
- Convert to WAV with customizable settings (sample rate, channels, bit depth)
- Convert to MP3 with customizable settings (sample rate, channels, bitrate)
- Quick conversion options with preset quality settings
- Custom sample rate input with validation (8000-192000 Hz)
- Real-time progress indication with cancellation support
- Comprehensive error handling and cleanup
- Submenu structure for cleaner context menu organization

### Features
- **Quick Convert to WAV**: 44.1kHz, Stereo, 16-bit PCM
- **Quick Convert to MP3**: 44.1kHz, Stereo, 320kbps
- **Custom Settings**: Full control over output format and quality
- **Progress Tracking**: Visual progress bar with percentage and cancellation
- **Error Handling**: Automatic cleanup of partial files on failure
- **FFmpeg Integration**: Leverages FFmpeg for high-quality audio conversion

### Requirements
- FFmpeg must be installed and available in system PATH

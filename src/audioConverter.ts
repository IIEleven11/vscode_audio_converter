import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';

export interface WavOptions {
    sampleRate: number;
    channels: number;
    bitDepth: number;
}

export interface Mp3Options {
    sampleRate: number;
    channels: number;
    bitrate: number;
}

export class AudioConverter {
    private ffmpegPath: string | null = null;

    constructor() {
        this.initializeFFmpeg();
    }

    private async initializeFFmpeg(): Promise<void> {
        try {
            // Try to find ffmpeg in system PATH
            const { spawn } = require('child_process');
            const ffmpegProcess = spawn('ffmpeg', ['-version']);
            
            ffmpegProcess.on('error', () => {
                vscode.window.showWarningMessage(
                    'FFmpeg not found in system PATH. Please install FFmpeg for audio conversion to work.',
                    'Download FFmpeg'
                ).then(selection => {
                    if (selection === 'Download FFmpeg') {
                        vscode.env.openExternal(vscode.Uri.parse('https://ffmpeg.org/download.html'));
                    }
                });
            });

            ffmpegProcess.on('close', (code: number) => {
                if (code === 0) {
                    this.ffmpegPath = 'ffmpeg';
                    console.log('FFmpeg found in system PATH');
                }
            });
        } catch (error) {
            console.error('Error initializing FFmpeg:', error);
        }
    }

    public async convertToWav(inputPath: string, options: WavOptions): Promise<string> {
        if (!this.ffmpegPath) {
            throw new Error('FFmpeg is not available. Please install FFmpeg to use this extension.');
        }

        // Validate input file exists
        if (!fs.existsSync(inputPath)) {
            throw new Error(`Input file does not exist: ${inputPath}`);
        }

        const outputPath = this.generateOutputPath(inputPath, 'wav');

        return vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Converting to WAV...",
            cancellable: true
        }, async (progress, token) => {
            return new Promise<string>((resolve, reject) => {
                const command = ffmpeg(inputPath)
                    .audioFrequency(options.sampleRate)
                    .audioChannels(options.channels)
                    .format('wav')
                    .audioCodec('pcm_s16le'); // 16-bit PCM

                // Adjust codec based on bit depth
                if (options.bitDepth === 24) {
                    command.audioCodec('pcm_s24le');
                } else if (options.bitDepth === 32) {
                    command.audioCodec('pcm_s32le');
                }

                // Handle cancellation
                token.onCancellationRequested(() => {
                    command.kill('SIGKILL');
                    reject(new Error('Conversion was cancelled by user'));
                });

                command
                    .on('start', (commandLine) => {
                        console.log('FFmpeg command:', commandLine);
                        progress.report({ increment: 0, message: "Starting conversion..." });
                    })
                    .on('progress', (progressInfo) => {
                        if (progressInfo.percent) {
                            const percent = Math.round(progressInfo.percent);
                            progress.report({
                                increment: percent,
                                message: `Converting... ${percent}%`
                            });
                        }
                    })
                    .on('end', () => {
                        progress.report({ increment: 100, message: "Conversion completed!" });
                        console.log('WAV conversion completed successfully');
                        resolve(outputPath);
                    })
                    .on('error', (err) => {
                        console.error('WAV conversion error:', err);
                        // Clean up partial output file
                        if (fs.existsSync(outputPath)) {
                            try {
                                fs.unlinkSync(outputPath);
                            } catch (cleanupErr) {
                                console.error('Failed to clean up partial file:', cleanupErr);
                            }
                        }
                        reject(new Error(`WAV conversion failed: ${err.message}`));
                    })
                    .save(outputPath);
            });
        });
    }

    public async convertToMp3(inputPath: string, options: Mp3Options): Promise<string> {
        if (!this.ffmpegPath) {
            throw new Error('FFmpeg is not available. Please install FFmpeg to use this extension.');
        }

        // Validate input file exists
        if (!fs.existsSync(inputPath)) {
            throw new Error(`Input file does not exist: ${inputPath}`);
        }

        const outputPath = this.generateOutputPath(inputPath, 'mp3');

        return vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Converting to MP3...",
            cancellable: true
        }, async (progress, token) => {
            return new Promise<string>((resolve, reject) => {
                const command = ffmpeg(inputPath)
                    .audioFrequency(options.sampleRate)
                    .audioChannels(options.channels)
                    .audioBitrate(`${options.bitrate}k`)
                    .format('mp3')
                    .audioCodec('libmp3lame');

                // Handle cancellation
                token.onCancellationRequested(() => {
                    command.kill('SIGKILL');
                    reject(new Error('Conversion was cancelled by user'));
                });

                command
                    .on('start', (commandLine) => {
                        console.log('FFmpeg command:', commandLine);
                        progress.report({ increment: 0, message: "Starting conversion..." });
                    })
                    .on('progress', (progressInfo) => {
                        if (progressInfo.percent) {
                            const percent = Math.round(progressInfo.percent);
                            progress.report({
                                increment: percent,
                                message: `Converting... ${percent}%`
                            });
                        }
                    })
                    .on('end', () => {
                        progress.report({ increment: 100, message: "Conversion completed!" });
                        console.log('MP3 conversion completed successfully');
                        resolve(outputPath);
                    })
                    .on('error', (err) => {
                        console.error('MP3 conversion error:', err);
                        // Clean up partial output file
                        if (fs.existsSync(outputPath)) {
                            try {
                                fs.unlinkSync(outputPath);
                            } catch (cleanupErr) {
                                console.error('Failed to clean up partial file:', cleanupErr);
                            }
                        }
                        reject(new Error(`MP3 conversion failed: ${err.message}`));
                    })
                    .save(outputPath);
            });
        });
    }

    private generateOutputPath(inputPath: string, format: string): string {
        const parsedPath = path.parse(inputPath);
        const outputFileName = `${parsedPath.name}_converted.${format}`;
        return path.join(parsedPath.dir, outputFileName);
    }

    public isFFmpegAvailable(): boolean {
        return this.ffmpegPath !== null;
    }
}

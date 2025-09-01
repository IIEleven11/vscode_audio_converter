import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { AudioConverter } from './audioConverter';

export function activate(context: vscode.ExtensionContext) {
    console.log('Audio Converter extension is now active!');

    const audioConverter = new AudioConverter();

    // Register command for converting to WAV with default settings
    let convertToWavCommand = vscode.commands.registerCommand('audioConverter.convertToWav', async (uri: vscode.Uri) => {
        if (!uri) {
            vscode.window.showErrorMessage('No file selected');
            return;
        }

        try {
            const outputPath = await audioConverter.convertToWav(uri.fsPath, {
                sampleRate: 44100,
                channels: 2,
                bitDepth: 16
            });
            vscode.window.showInformationMessage(`File converted successfully: ${outputPath}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Conversion failed: ${error}`);
        }
    });

    // Register command for converting to MP3 with default settings
    let convertToMp3Command = vscode.commands.registerCommand('audioConverter.convertToMp3', async (uri: vscode.Uri) => {
        if (!uri) {
            vscode.window.showErrorMessage('No file selected');
            return;
        }

        try {
            const outputPath = await audioConverter.convertToMp3(uri.fsPath, {
                sampleRate: 44100,
                channels: 2,
                bitrate: 320
            });
            vscode.window.showInformationMessage(`File converted successfully: ${outputPath}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Conversion failed: ${error}`);
        }
    });

    // Register command for converting with custom options
    let convertWithOptionsCommand = vscode.commands.registerCommand('audioConverter.convertWithOptions', async (uri: vscode.Uri) => {
        if (!uri) {
            vscode.window.showErrorMessage('No file selected');
            return;
        }

        try {
            const options = await showConversionOptionsDialog();
            if (!options) {
                return; // User cancelled
            }

            let outputPath: string;
            if (options.format === 'wav') {
                outputPath = await audioConverter.convertToWav(uri.fsPath, {
                    sampleRate: options.sampleRate,
                    channels: options.channels,
                    bitDepth: options.bitDepth
                });
            } else {
                outputPath = await audioConverter.convertToMp3(uri.fsPath, {
                    sampleRate: options.sampleRate,
                    channels: options.channels,
                    bitrate: options.bitrate
                });
            }

            vscode.window.showInformationMessage(`File converted successfully: ${outputPath}`);
        } catch (error) {
            vscode.window.showErrorMessage(`Conversion failed: ${error}`);
        }
    });

    context.subscriptions.push(convertToWavCommand, convertToMp3Command, convertWithOptionsCommand);
}

async function showConversionOptionsDialog(): Promise<ConversionOptions | undefined> {
    // Format selection
    const format = await vscode.window.showQuickPick(['wav', 'mp3'], {
        placeHolder: 'Select output format'
    });
    if (!format) return undefined;

    // Sample rate selection - allow custom input
    const sampleRateInput = await vscode.window.showInputBox({
        prompt: 'Enter sample rate in Hz (e.g., 44100, 48000, 96000)',
        value: '44100',
        validateInput: (value) => {
            const num = parseInt(value);
            if (isNaN(num) || num < 8000 || num > 192000) {
                return 'Please enter a valid sample rate between 8000 and 192000 Hz';
            }
            return null;
        }
    });
    if (!sampleRateInput) return undefined;
    const sampleRate = parseInt(sampleRateInput);

    // Channels selection
    const channelsStr = await vscode.window.showQuickPick(['1', '2'], {
        placeHolder: 'Select channels (1=Mono, 2=Stereo)'
    });
    if (!channelsStr) return undefined;
    const channels = parseInt(channelsStr);

    let bitDepth = 16;
    let bitrate = 320;

    if (format === 'wav') {
        // Bit depth selection for WAV
        const bitDepthStr = await vscode.window.showQuickPick(['16', '24', '32'], {
            placeHolder: 'Select bit depth'
        });
        if (!bitDepthStr) return undefined;
        bitDepth = parseInt(bitDepthStr);
    } else {
        // Bitrate selection for MP3
        const bitrateStr = await vscode.window.showQuickPick(['128', '192', '256', '320'], {
            placeHolder: 'Select bitrate (kbps)'
        });
        if (!bitrateStr) return undefined;
        bitrate = parseInt(bitrateStr);
    }

    return {
        format: format as 'wav' | 'mp3',
        sampleRate,
        channels,
        bitDepth,
        bitrate
    };
}

interface ConversionOptions {
    format: 'wav' | 'mp3';
    sampleRate: number;
    channels: number;
    bitDepth: number;
    bitrate: number;
}

export function deactivate() {}

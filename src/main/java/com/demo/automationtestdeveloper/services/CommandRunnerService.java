package com.demo.automationtestdeveloper.services;

import com.demo.automationtestdeveloper.exceptions.CommandRunnerException;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Service
@Slf4j
public class CommandRunnerService {

    public static void runCommand(@NonNull String command) throws CommandRunnerException {
        log.debug("Running command: {}", command);
        try {
            Process process = Runtime.getRuntime().exec(command);
            process.waitFor();

            logInputStream(process);
            logErrorStream(process);
            log.debug("Command ran successfully: {}", command);
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            throw new CommandRunnerException(String.format("Exception occurred while running command: %s Exception: %s",
                    command, e.getMessage()));
        }
    }

    public static String runCommandAndGetInputStreamOutput(@NonNull String command) throws CommandRunnerException {
        log.debug("Running command: {}", command);
        StringBuilder sb = new StringBuilder();
        try {
            Process process = Runtime.getRuntime().exec(command);
            process.waitFor();

            // Collect input stream output
            try (BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = br.readLine()) != null) {
                    sb.append(line).append("\n");
                    log.debug(line);
                }
            }
            logErrorStream(process);
            log.debug("Command ran successfully: {}", command);
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            throw new CommandRunnerException(String.format("Exception occurred while running command: %s Exception: %s",
                    command, e.getMessage()));
        }
        return sb.toString();
    }

    private static void logInputStream(Process process) throws IOException {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
            String line;
            while ((line = br.readLine()) != null) {
                log.debug("INPUT_STREAM: " + line);
            }
        }
    }

    private static void logErrorStream(Process process) throws IOException {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(process.getErrorStream()))) {
            String line;
            while ((line = br.readLine()) != null) {
                log.error("ERROR_STREAM: " + line);
            }
        }
    }
}

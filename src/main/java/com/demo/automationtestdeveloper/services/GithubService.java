package com.demo.automationtestdeveloper.services;

import com.demo.automationtestdeveloper.exceptions.CommandRunnerException;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
@Slf4j
public class GithubService {

    @Value("${command.mvn}")
    private String mavenCommand;

    @Value("${main-repo.url}")
    private String mainRepoCloneUrl;

    @Value("${main-repo.clone-branch}")
    private String mainRepoCloneBranch;

    @Value("${main-repo.clone-dir}")
    private String mainRepoCloneDir;

    private String cleanMainRepoCmd = "%s clean -PcleanMainRepo";
    private String mainRepoCloneCmd = "git clone --branch=%s %s %s";
    private static final String gitUsernameCmd = "git config --global user.name";
    private static final String createBranchCmd = "git -C %s branch %s";
    private static final String checkoutBranchCmd = "git -C %s checkout %s";

    @PostConstruct
    void init() {
        this.cleanMainRepoCmd = String.format(cleanMainRepoCmd, mavenCommand);
        this.mainRepoCloneCmd = String.format(mainRepoCloneCmd, mainRepoCloneBranch, mainRepoCloneUrl, mainRepoCloneDir);
    }

    public void reCloneMainRepo() throws CommandRunnerException {
        // Clean main repo
        log.debug("Cleaning main repo...");
        CommandRunnerService.runCommand(cleanMainRepoCmd);

        // Clone main repo
        log.debug("Cloning main repo...");
        CommandRunnerService.runCommand(mainRepoCloneCmd);
    }

    public String getGitUserName() throws CommandRunnerException {
        log.debug("Getting git username...");
        String username = CommandRunnerService.runCommandAndGetInputStreamOutput(gitUsernameCmd);
        username = username.trim();
        if (StringUtils.isEmpty(username)) {
            throw new CommandRunnerException("Cannot get git username. Please set your username by running in command-prompt: git config --global user.name \"<lanId>\"");
        }
        return username;
    }

    public void createLocalBranch(@NonNull String branchName) throws CommandRunnerException {
        log.debug("Creating branch...");
        CommandRunnerService.runCommand(String.format(createBranchCmd, mainRepoCloneDir, branchName));
    }

    public void checkoutBranch(@NonNull String branchName) throws CommandRunnerException {
        log.debug("Checking out to branch...");
        CommandRunnerService.runCommand(String.format(checkoutBranchCmd, mainRepoCloneDir, branchName));
    }
}

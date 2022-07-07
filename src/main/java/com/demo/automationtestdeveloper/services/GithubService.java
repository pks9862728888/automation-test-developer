package com.demo.automationtestdeveloper.services;

import com.demo.automationtestdeveloper.exceptions.CommandRunnerException;
import lombok.extern.slf4j.Slf4j;
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
}

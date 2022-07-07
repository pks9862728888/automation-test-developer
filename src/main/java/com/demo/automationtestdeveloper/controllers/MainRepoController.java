package com.demo.automationtestdeveloper.controllers;

import com.demo.automationtestdeveloper.dto.CreateBranchDTO;
import com.demo.automationtestdeveloper.exceptions.CommandRunnerException;
import com.demo.automationtestdeveloper.services.GithubService;
import com.demo.automationtestdeveloper.utils.DateTimeUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/app/v1/repo")
@Slf4j
public class MainRepoController {

    @Autowired
    private GithubService githubService;

    @GetMapping("/reload-main-repo")
    public ResponseEntity<String> reloadMainRepo() throws CommandRunnerException {
        githubService.reCloneMainRepo();
        return new ResponseEntity<>("OK", HttpStatus.OK);
    }

    @PostMapping("/create-and-checkout-local-branch/{name}")
    public ResponseEntity<CreateBranchDTO> createBranchInMainRepo(@PathVariable("name") String branchName) throws CommandRunnerException {
        // Clean branch name
        branchName = branchName.toLowerCase().trim()
                .replaceAll("\\p{Space}|\\{Punct}", "-");

        // Make branch name unique
        branchName = String.format("%s-%s-%s",
                branchName, githubService.getGitUserName(), DateTimeUtils.getCurrentZonedTimestamp("yyyyMMdd-hhmmss"));

        // Create branch
        githubService.createLocalBranch(branchName);

        // Checkout branch
        githubService.checkoutBranch(branchName);

        return new ResponseEntity<>(new CreateBranchDTO(branchName), HttpStatus.CREATED);
    }

}

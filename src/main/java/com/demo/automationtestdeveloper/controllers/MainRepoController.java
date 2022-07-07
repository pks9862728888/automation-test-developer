package com.demo.automationtestdeveloper.controllers;

import com.demo.automationtestdeveloper.exceptions.CommandRunnerException;
import com.demo.automationtestdeveloper.services.GithubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/app/v1/repo")
public class MainRepoController {

    @Autowired
    private GithubService githubService;

    @GetMapping("/reload-main-repo")
    public void reloadMainRepo() throws CommandRunnerException {
        githubService.reCloneMainRepo();
    }

}

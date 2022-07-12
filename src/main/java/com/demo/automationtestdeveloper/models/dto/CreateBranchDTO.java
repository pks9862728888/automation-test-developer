package com.demo.automationtestdeveloper.models.dto;

import lombok.Data;

import java.io.Serializable;

@Data
public class CreateBranchDTO implements Serializable {

    private String branchName;

    public CreateBranchDTO(String branchName) {
        this.branchName = branchName;
    }
}

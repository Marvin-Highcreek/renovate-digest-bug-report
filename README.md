# renovate-digest-bug-report


When wusing the aws-machine-image manager I encountered a Bug. 

Using groupSlug to create dynamic branch names for our ami deployment instead of correctly using "renovate/all-ami-updates-dev" it falls back to this branch name: "renovate/ami_id-1.x."

From the documentation here https://docs.renovatebot.com/configuration-options/#branchtopic I can see how the branch name is being concatenated. 

![CleanShot 2024-09-13 at 13 45 40](https://github.com/user-attachments/assets/2b0ca0e2-4821-4bd5-a052-3a9568e2ff54)


"{{{depNameSanitized}}}-{{{newMajor}}}{{#if separateMinorPatch}}{{#if isPatch}}.{{{newMinor}}}{{/if}}{{/if}}.x{{#if isLockfileUpdate}}-lockfile{{/if}}"

When looking at our logs I can see this. 


```
{
  "bucket": "non-major",
  "newVersion": "ami-123",
  "newValue": "ami-123",
  "newDigest": "amazon-eks-node-1.29-vxxx",
  "releaseTimestamp": "XXX",
  "newMajor": 1,
  "newMinor": 0,
  "newPatch": 0,
  "updateType": "patch",
  "branchName": "renovate/ami_id-1.x"
}
```

So it is becoming clear to me why the branchname is named like it is but why the groupslug gets ignored is beyond me. 

To mitigate this, because we really need different branch names, I did this. 

```
{
  packageRules: [
    {
      matchPackageNames: ["ami-*"],
      groupName: `all AMI updates for ${process.env.AWS_ACCOUNT}`,
      groupSlug: `all-ami-updates-${process.env.AWS_ACCOUNT}`,
      branchNameStrict: "true",
      branchTopic: "{{{depNameSanitized}}}-{{{newDigest}}}-{{{newValue}}}",
    }
  ],
}
```
The result was still "branchName": "renovate/ami_id-1.x" .

When removing the {{{newDigest}}} part this solution works, so writing 

```
{
  packageRules: [
    {
      matchPackageNames: ["ami-*"],
      groupName: `all AMI updates for ${process.env.AWS_ACCOUNT}`,
      groupSlug: `all-ami-updates-${process.env.AWS_ACCOUNT}`,
      branchNameStrict: "true",
      branchTopic: "{{{depNameSanitized}}}-{{{newValue}}}",
    }
  ],
}
```
works and I get "branchName": "renovate/ami_id-ami-123".

Also placing branchTopic outside the package rules works

```
module.exports = {
  ...baseConfig,
  branchTopic: "{{{depNameSanitized}}}-{{{newDigest}}}-{{{newValue}}}",

packageRules: [
    {
      matchPackageNames: ["ami-*"],
      groupName: `all AMI updates for ${process.env.AWS_ACCOUNT}`,
      groupSlug: `all-ami-updates-${process.env.AWS_ACCOUNT}`,
      branchNameStrict: "true",
    }
  ],
}
```
and i even get the digest into the branch name like = "branchName": "renovate/ami_id-amazon-eks-node-1.29-vxxxx-xxxx-ami-123"

So it feels like there is an bug/error in how the digest gets read and renovate reverts to the default wich doesnt include the patch version.

This is a "new" problem with version 38

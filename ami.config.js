const baseConfig = require("./base.config");

module.exports = {
  ...baseConfig,
  enabledManagers: ["custom.regex"],

  commitMessageSuffix: `in ${process.env.FOO} account`,
  //branchTopic: "{{{depNameSanitized}}}-{{{newDigest}}}-{{{newValue}}}",  // when i add this the branch name gets changed

  customManagers: [
    {
      customType: "regex",
      fileMatch: ["(^|/)terragrunt.hcl"],
      matchStrings: [
        ".*amiFilter=(?<packageName>.*?)\n(.*currentImageName=(?<currentDigest>.*?)\n)?(.*  \n)?.*?(?<depName>[a-zA-Z0-9-_:]*)[ ]*?[:|=][ ]*?[\"|']?(?<currentValue>ami-[a-z0-9]{17})[\"|']?.*",
      ],
      datasourceTemplate: "aws-machine-image",
      versioningTemplate: "aws-machine-image",
    },
  ],

  packageRules: [
    {
      matchPackageNames: ["ami-*"],
      groupName: `all AMI updates for ${process.env.FOO}`,
      groupSlug: `all-ami-updates-${process.env.FOO}`, // This is not working, I dont see why 
      branchNameStrict: "true",
      //branchTopic: "{{{depNameSanitized}}}-{{{newDigest}}}-{{{newValue}}}", // if added this is not working, branch name is still "branchName": "renovate/ami_id-1.x"
      //branchTopic: "{{{depNameSanitized}}}-{{{newValue}}}", // if added this is working branch name is  "branchName": "renovate/ami_id-ami-123"
    }
  ],
};

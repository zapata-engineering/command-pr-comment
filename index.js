const github = require('@actions/github');
const core = require('@actions/core');
const parse = require('shell-quote/parse');
const { spawnSync } = require('node:child_process');


// most @actions toolkit packages have async methods
async function run() {
  const cmd = core.getInput('command');
  const messageTemplate = core.getInput('template');
  const updateText = core.getInput('update-text');
  const githubToken = core.getInput('github-token');

  const octokit = github.getOctokit(githubToken);
  const context = github.context;

  if (!context.payload.pull_request) {
    core.error("This action only runs on Pull Requests");
    return;
  }

  var comment = null;
  var message = "";

  // If we have text to check, we will search the PR for a comment with this text
  if (updateText){
    try {
      for await (const response of octokit.paginate.iterator(
        octokit.rest.issues.listComments,
        {
          issue_number: context.issue.number,
          owner: context.repo.owner,
          repo: context.repo.repo,
        }
      )) {
        comment = response.data.find((comment) => comment.body.includes(updateText));
        if (comment) break;
      }
    } catch (_) {
      // Unable to find the comment, or an error occurred
      // Continue and make a new comment
    }
  }

  // Next, we execute the user's command
  const splitCmd = parse(cmd);
  const proc = spawnSync(splitCmd[0], splitCmd.slice(1));
  const cmdOut = proc.stdout.toString();

  // If there's a template, we replace %command% with the output of the command
  // Otherwise, we return a code block with the command output
  if(messageTemplate){
    message = messageTemplate.replace("%command%", cmdOut);
  } else {
    message = `\n\`\`\`${cmdOut}\n\`\`\``;
  }
  console.log(message);

  // If we found a comment, we update it
  // Otherwise we create a new comment
  try {
    if (comment) {
      await octokit.rest.issues.updateComment({
        owner: context.repo.owner,
        repo: context.repo.repo,
        comment_id: comment.id,
        body: message,
      });
    } else {
      await octokit.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: message
      });
    }
  } catch (error) {
    core.setFailed(`Error with making comment - ${error.name}: ${error.message}`);
  }
}

run();

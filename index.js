const fs = require('fs');
const path = require('path');
const core = require('@actions/core')

function gatherPathsRecursive(dir, baseDir, allPaths) {
    fs.readdirSync(dir).forEach(fileName => {
        const filePath = path.join(dir, fileName);
        if (fs.lstatSync(filePath).isDirectory()) {
            gatherPathsRecursive(filePath, baseDir, allPaths);
        } else {
            allPaths.push(path.relative(baseDir, filePath));
        }
    });
}

function gatherPathsLongestFirst(baseDir) {
    allPaths = [];
    gatherPathsRecursive(baseDir, baseDir, allPaths);
    allPaths.sort((a, b) => {
        // sort longest first
        const lengthCmp = b.length - a.length;
        if (lengthCmp != 0) {
            return lengthCmp;
        } else {
            // if same length then sort alphabetically
            return a.localeCompare(b)
        }
    });
    return allPaths;
}

try {
    const limit = core.getInput('limit') || 150

    core.info(`Checking for paths exceeding limit=${limit}`)
    allPaths = gatherPathsLongestFirst('.');

    // print every path that exceeds the limit
    let failed = false;
    for (const filePath of allPaths) {
        if (filePath.length > limit) {
            failed = true
            core.setFailed(`Path length=${filePath.length} exceeds limit=${limit}: ${filePath}`);
        } else {
            break;
        }
    }

    // just FYI, here's you're longest path
    if (!failed && allPaths.length > 0) {
        longestPath = allPaths[0]
        core.info(`Longest path length=${longestPath.length}: ${longestPath}`)
    }
} catch (error) {
    core.setFailed(error.message)
}

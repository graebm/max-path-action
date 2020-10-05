const fs = require('fs');
const path = require('path');

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

const core = require('@actions/core')
const github = require('@actions/github')

try {
    const limit = core.getInput('limit')

    core.info(`Checking for paths exceeding limit=${limit}`)
    allPaths = gatherPathsLongestFirst('.');

    // print every path that exceeds the limit
    let failed = false;
    for (const filePath of allPaths) {
        if (filePath.length > limit) {
            errMsg = `Path length=${filePath.length} exceeds limit=${limit}: ${filePath}`;
            if (!failed) {
                failed = true;
                core.setFailed(errMsg);
            }
            core.error(errMsg);
        } else {
            break;
        }
    }
} catch (error) {
    core.setFailed(error.message)
}

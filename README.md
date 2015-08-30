# Brain Browser
============
Brain browser is a web-based image viewer for local brain images.

## How to install
You will first need [npm](https://nodejs.org/), the node package manager, which comes with both node itself and npm. You can install by compiling from source. I would not recommend package managers node/npm as they seem to be out of date (Ubuntu was). Make sure that both `node` and `npm` are on your path:

      which npm
      which node

Now you can easily install the brain-browser from the node package manager!

      sudo npm install brain-browser -g

The `-g` flag indicates a global install, which typically places the executable in /usr/local/bin. To find it:

      which bb


## How to run
When browsing around your brain images, simply type `bb` to run the executable, and point your browser to

      http://localhost:9099

## Additional arguments
You can specify a port, or to exclude files of a particular type:

    -p, --port <port>        Port to run the file-browser. Default value is 8088
    -e, --exclude <exclude>  File extensions to exclude (for multiple, do -e .js -e .css)


[brain-browser.png](brain-browser.png)

### Troubleshooting

      /usr/bin/env: node: No such file or directory

This usually indicates that node cannot be found on your path.

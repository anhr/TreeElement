/**
 * JavaScript source code
 * Author: Andrej Hristoliubov
 * email: anhr@mail.ru
 * About me: http://anhr.ucoz.net/AboutMe/
 * source: https://github.com/anhr/TreeElement
 * Licences: GPL, The MIT License (MIT)
 * Copyright: (c) 2015 Andrej Hristoliubov
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * Revision:
 *  2017-05-29, : 
 *       + init.
 *
 */
var myTreeView = {
    expanded: ' expanded',
    btoggle: 'b-toggle',
    createTree: function (elTree, tree) {
        tree.forEach(function (branch) {
            myTreeView.appendBranch(elTree, branch)
        });
    },
    createBranch: function (options)
    {
        var el = document.createElement((typeof options.tagName == 'undefined') ? "div" : options.tagName);
        if ((typeof options.className != 'undefined'))
            el.className = options.className;
        el.innerHTML =
            '<span class="treeView" onclick="javascript: myTreeView.onclickBranch(this)" '
                    + ((typeof options.title == 'undefined') ? '' : 'title="' + options.title + '"') + '>'
                + '<span class="triangle">▶</span>'
                + '<span class="name">' + options.name + '</span>'
            + '</span>'
        ;
        var elA = el.querySelector('.treeView');
        elA.params = options.params;
        return el;
    },
    onclickBranch: function (a) {
        consoleLog("onclickBranch()");
        var elBranch = a.parentElement.querySelector('.branch')
        var triangle;
        var isOpened = elBranch ?
            (
                (elBranch.className.indexOf(this.btoggle) == -1) ?
                true :
                ((elBranch.className.indexOf(this.expanded) != -1) ? true : false)
            )
            : false;
        if (isOpened) {
            if (a.branchElement.className.indexOf(this.btoggle) != -1)
                a.branchElement.className = a.branchElement.className.replace(this.expanded, '');
            else a.parentElement.removeChild(elBranch);
            triangle = '▶';
            isOpened = false;
            if (typeof a.params.onCloseBranch != 'undefined')
                a.params.onCloseBranch(a);
        } else {
            if (typeof a.branchElement == 'undefined') {
                if (typeof a.params == "undefined")
                    a.params = {};
                if (typeof a.params.createBranch == "function")
                    a.branchElement = a.params.createBranch();
                else {
                    if (typeof a.params.tree == "undefined")
                        a.params.tree = [];
                    if (typeof a.params.tree == "object") {
                        var el = document.createElement("div");
                        if (a.params.tree.length == 0)
                            consoleError('empty branch');
                        a.params.tree.forEach(function (branch) {
                            var elBranch = document.createElement("div");
                            if (typeof branch.branch == "function") {
                                var branch = branch.branch();
                                switch (typeof branch) {
                                    case "string":
                                        elBranch.innerHTML = branch;
                                        break;
                                    case "object":
                                        elBranch.appendChild(branch);
                                        break;
                                    default: consoleError('invalid typeof branch: ' + typeof branch);
                                }
                            }
                            else elBranch.innerHTML = branch.name;
                            el.appendChild(elBranch);
                        });
                        a.branchElement = el;
                    } else consoleError('invalid a.params.tree: ' + a.params.tree);
                }
                var indexBranch = a.branchElement.className.indexOf('branch');
                if ((indexBranch == -1) || (indexBranch == a.branchElement.className.indexOf('branchLeft')))
                    a.branchElement.className += ' branch';
                if (a.params.animate && (a.branchElement.className.indexOf(this.btoggle) == -1))
                    a.branchElement.className += ' ' + this.btoggle;
                if ((typeof a.params.noBranchLeft == 'undefined') || !a.params.noBranchLeft)
                    a.branchElement.className += ' branchLeft';
            }
            if (!elBranch) {
                a.parentElement.appendChild(a.branchElement);
                if (a.params.scrollIntoView || ((typeof a.params.branch != 'undefined') && (a.params.branch.scrollIntoView)))
                    setTimeout(function () { a.branchElement.scrollIntoView(); }, 0);
            }

            if (a.branchElement.className.indexOf(this.btoggle) != -1)
                setTimeout(function () { a.branchElement.className += myTreeView.expanded; }, 0);

            triangle = '▼';
            isOpened = true;
            if (typeof a.params.onOpenBranch != 'undefined')
                a.params.onOpenBranch(a);
            if ((typeof a.params.branch != 'undefined') && (typeof a.params.branch.onOpenBranch != 'undefined'))
                a.params.branch.onOpenBranch(a);
        }
        a.querySelector('.triangle').innerHTML = triangle;
        if ((typeof a.params.branch != 'undefined') && (typeof a.params.branch.onclickBranch != 'undefined'))
            a.params.branch.onclickBranch(a);
        return isOpened;
    },
    appendBranch: function (elTree, branch) {
        elTree.appendChild(myTreeView.createBranch(
            {
                name: branch.name,
                params:
                {
                    createBranch: function () {
                        var el;
                        if (typeof branch.branch == "function")
                            el = branch.branch();
                        else {
                            el = document.createElement("div");
                            var res = false;
                            if (typeof branch.branch == "string") {
                                el.innerText = branch.branch;
                                res = true;
                            }
                            if (this.branch.tree) {
                                this.branch.tree.forEach(function (branch) {
                                    myTreeView.appendBranch(el, branch);
                                });
                                res = true;
                            }
                            if (!res)
                                consoleError("Invalid branch");
                        }
                        if (el.className != '')
                            el.className += ' ';
                        el.className += (branch.animate ? " " + myTreeView.btoggle : "");
                        return el;
                    },
                    branch: branch
                },
                title: branch.title,
                tagName: branch.tagName,
                className: branch.className
            }
        ));
    },
    AddNewBranch: function (elTree, branch) {
        if (typeof elTree == "string")
            elTree = document.getElementById(elTree);
        var elTreeView = elTree.querySelector('.treeView');
        var elBranch = elTree.querySelector('.branch');
        if (!elBranch)
            elBranch = elTreeView.branchElement;//branch exists but hidden
        if (elBranch) {
            if (typeof branch.branch == "function") {
                var elNewBranch;
                var branch = branch.branch();
                switch (typeof branch) {
                    case "string":
                        elNewBranch = document.createElement('div');
                        elNewBranch.innerHTML = branch;
                        break;
                    case "object":
                        elNewBranch = branch;
                        break;
                    default: consoleError('invalid typeof branch: ' + typeof branch);
                }
                elBranch.appendChild(elNewBranch);
            } else if (typeof branch.name == "string") {
                var elNewBranch = document.createElement('div');
                elNewBranch.innerHTML = branch.name;
                elBranch.appendChild(elNewBranch);
            } else consoleError('invalid typeof branch.branch: ' + typeof branch.branch);
        } else {
            if (typeof elTreeView.params == "undefined")
                elTreeView.params = {};
            if (typeof elTreeView.params.tree == "undefined")
                elTreeView.params.tree = [];
            elTreeView.params.tree.push(branch);
        }
    }
}

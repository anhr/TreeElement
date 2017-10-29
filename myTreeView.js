/**
 * JavaScript source code
 * Author: Andrej Hristoliubov
 * email: anhr@mail.ru
 * About me: http://anhr.ucoz.net/AboutMe/
 * source: https://github.com/anhr/TreeElement
 * example: http://anhr.ucoz.net/TreeElement/
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
            if (typeof branch.branch == "object"){
                branch.branch.parentElement.removeChild(branch.branch);
                if (branch.branch.style.display == "none")
                    branch.branch.style.display = '';
            }
        });
    },
    createBranch: function (options)
    {
        var el = document.createElement((typeof options.tagName == 'undefined') ? "div" : options.tagName);
        if ((typeof options.className != 'undefined'))
            el.className = options.className;
        var treeViewTagName = typeof options.treeViewTagName == 'undefined' ? 'span' : options.treeViewTagName;
        if (typeof options.name == 'function') {
            el.appendChild(options.name());
            return el;
        }
        el.innerHTML =
            '<' + treeViewTagName + ' class="treeView" onclick="javascript: myTreeView.onclickBranch(this)" '
                    + ((typeof options.title == 'undefined') ? '' : 'title="' + options.title + '"') + '>'
                + '<span class="triangle">▶</span>'
                + '<span class="name">' + options.name + '</span>'
            + '</' + treeViewTagName + '>'
        ;
        var elA = el.querySelector('.treeView');
        elA.params = options.params;
        return el;
    },
    onclickBranch: function (a) {
        consoleLog("onclickBranch()");
        var parentElement = ((typeof a.params.branch != 'undefined') && (typeof a.params.branch.parentElement != 'undefined')) ?
            a.params.branch.parentElement : (typeof a.params.parentElement == 'undefined') ? a.parentElement : a.params.parentElement;
        if (typeof parentElement == "string")
            parentElement = document.getElementById(parentElement);
        var elBranch = parentElement.querySelector('.branch')
        var triangle;
        var isOpened = elBranch ?
            (
                (elBranch.className.indexOf(this.btoggle) == -1) ?
                true :
                ((elBranch.className.indexOf(this.expanded) != -1) ? true : false)
            )
            : false;
        if (isOpened) {
            if ((typeof a.branchElement != 'undefined') && (a.branchElement.className.indexOf(this.btoggle) != -1))
                a.branchElement.className = a.branchElement.className.replace(this.expanded, '');
            else parentElement.removeChild(elBranch);
            triangle = '▶';
            isOpened = false;
            if (typeof a.params.onCloseBranch != 'undefined')
                a.params.onCloseBranch(a);
        } else {
            if (typeof a.branchElement == 'undefined') {
                if (typeof a.params == "undefined")
                    a.params = {};
                switch(typeof a.params.createBranch){
                    case "function":
                        a.branchElement = a.params.createBranch(a);
                        break;
                    case "string":
                        a.branchElement = document.getElementById(a.params.createBranch);
                        if (a.branchElement == null) {
                            a.branchElement = document.createElement("div");
                            a.branchElement.innerText = a.params.createBranch;
                        }
                        break;
                    case "undefined"://tree
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
                                            elBranch = branch;
                                            break;
                                        default: consoleError('invalid typeof branch: ' + typeof branch);
                                    }
                                } else {
                                    elBranch.innerHTML = branch.name;
                                    if (branch.branchId)
                                        elBranch.branchId = branch.branchId;
                                }
                                el.appendChild(elBranch);
                            });
                            delete a.params.tree;
                            a.branchElement = el;
                        } else consoleError('invalid a.params.tree: ' + a.params.tree);
                        break;
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
                parentElement.appendChild(a.branchElement);
                if (a.params.scrollIntoView || ((typeof a.params.branch != 'undefined') && (a.params.branch.scrollIntoView)))
                    setTimeout(function () { a.branchElement.scrollIntoView(); }, 0);
            }

            if ((a.branchElement.className.indexOf(this.btoggle) != -1) && (a.branchElement.className.indexOf(this.expanded) == -1))
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
        else if (typeof a.params.onclickBranch != 'undefined')
            a.params.onclickBranch(a);
        return isOpened;
    },
    appendBranch: function (elTree, branch) {
        if (typeof elTree == "string")
            elTree = document.getElementById(elTree);
        var parentElement;
        switch (typeof branch.parentElement) {
            case "undefined":
                break;
            case "string":
                parentElement = document.getElementById(branch.parentElement);
                break;
            case "object":
                parentElement = branch.parentElement;
                break;
            default: consoleError("Invalid typeof branch.parentElement: " + typeof branch.parentElement);
        }
        var branchClass = "branch";
        if (parentElement && (parentElement.className.indexOf(branchClass) == -1))
            parentElement.className += " " + branchClass;
        elTree.appendChild(myTreeView.createBranch(
            {
                name: branch.name,
                params:
                {
                    createBranch: function () {
                        var el;
                        switch (typeof branch.branch) {
                            case "function":
                                el = branch.branch();
                                break;
                            case "object":
                                el = branch.branch;
                                break;
                            default:
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
                if (typeof branch.branchId != "undefined")
                    elNewBranch.branchId = branch.branchId;//for branch removing
                elBranch.appendChild(elNewBranch);
            } else consoleError('invalid typeof branch.branch: ' + typeof branch.branch);
        } else {
            if (typeof elTreeView.params == "undefined")
                elTreeView.params = {};
            if (typeof elTreeView.params.tree == "undefined")
                elTreeView.params.tree = [];
            elTreeView.params.tree.push(branch);
        }
    },
    isBranchExists: function (branchId, elTree){
        if (typeof elTree == "string")
            elTree = document.getElementById(elTree);
        var elTreeView = elTree.querySelector('.treeView');
        if (elTreeView == null)
            return false;
        var tree = elTreeView.params.tree;
        if (typeof tree == 'undefined') {
            var elBranches = elTree.querySelector('.branch');
            var childNodes = elBranches == null ? elTreeView.branchElement.childNodes : elBranches.childNodes;
            for (var i = childNodes.length - 1; i >= 0; i--) {
                var elBranch = childNodes[i];
                var elTreeViewChild = elBranch.querySelector('.treeView');
                var boDeleteBranch = false;
                if (elTreeViewChild) {
                    if (elTreeViewChild.params.branchId == branchId)
                        return true;
                } else if (typeof elBranch.branchId == 'undefined') {
                    consoleError('elBranch.branchId: ' + elBranch.branchId);
                    if (elBranch.innerText == branchId)
                        return true;
                } else {
                    if (elBranch.branchId == branchId)
                        return true;
                }
            }
        } else {
            for (var i = tree.length - 1; i >= 0; i--) {
                var branch = tree[i];
                if (typeof branch.branchId == 'undefined') {
                    consoleError('branch.branchId: ' + branch.branchId);
                    if (branch.name == branchId)
                        return true;
                } else if (branch.branchId == branchId)
                    return true;
            }
        }
        return false;
    },
    removeBranch: function (branchId, elTree) {
        if (typeof elTree == "string")
            elTree = document.getElementById(elTree);
        var elTreeView = elTree.querySelector('.treeView');
        if (elTreeView == null)
            return res;
        var tree = elTreeView.params.tree;
        var res = false;//Branch is not detected and not removed
        if (typeof tree == 'undefined') {
            var elBranches = elTree.querySelector('.branch');
            var childNodes = elBranches == null ? elTreeView.branchElement.childNodes : elBranches.childNodes;
            for (var i = childNodes.length - 1; i >= 0; i--) {
                var elBranch = childNodes[i];
                var elTreeViewChild = elBranch.querySelector('.treeView');
                var boDeleteBranch = false;
                if (elTreeViewChild) {
                    if (elTreeViewChild.params.branchId == branchId)
                        boDeleteBranch = true;
                } else if (typeof elBranch.branchId == 'undefined') {
                    consoleError('elBranch.branchId: ' + elBranch.branchId);
                    if (elBranch.innerText == branchId)
                        boDeleteBranch = true;
                } else {
                    if (elBranch.branchId == branchId)
                        boDeleteBranch = true;
                }
                if (boDeleteBranch) {
                    elBranch.parentElement.removeChild(elBranch);
                    res = true;
                }
            }
        } else {
            for (var i = tree.length - 1; i >= 0; i--) {
                var branch = tree[i];
                var boDeleteBranch = false;
                if (typeof branch.branchId == 'undefined') {
                    consoleError('branch.branchId: ' + branch.branchId);
                    if (branch.name == branchId)
                        boDeleteBranch = true;
                } else if (branch.branchId == branchId)
                    boDeleteBranch = true;
                if (boDeleteBranch) {
                    tree.splice(i);
                    res = true;
                }
            }
        }
        return res;
    },
    removeAllBranches: function (elTree) {
        if (typeof elTree == "string")
            elTree = document.getElementById(elTree);
        var res = false;//Branch is not detected and not removed
        var elTreeView = elTree.querySelector('.treeView');
        if (elTreeView == null)
            return res;
        var tree = elTreeView.params.tree;
        if (typeof tree == 'undefined') {
            var elBranches = elTree.querySelector('.branch');
            var childNodes = elBranches == null ? elTreeView.branchElement.childNodes : elBranches.childNodes;
            for (var i = childNodes.length - 1; i >= 0; i--) {
                var elBranch = childNodes[i];
                elBranch.parentElement.removeChild(elBranch);
                res = true;
            }
        } else {
            if (tree.length > 0)
                res = true;
            elTreeView.params.tree = [];
        }
        return res;
    },
    onclickCloseBranch: function (event) {
        if (!event) event = window.event;
        var el = event.target || event.srcElement;
        var elParent = el.parentElement.parentElement;
        var elTreeView = elParent.querySelector('.treeView');
        if (elTreeView.parentElement != elParent)
            consoleError('incorrect treeView');
        myTreeView.onclickBranch(elTreeView);
    },
    onCloseBranchAnywhere: function (event) {
        if (!event) event = window.event;
        var el = event.target || event.srcElement;
        el.parentElement.elTreeView.onclick();
    }
}

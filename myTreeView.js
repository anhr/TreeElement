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
    createTree: function (elTree, tree) {
        tree.forEach(function (branch) {
            myTreeView.appendBranch(elTree, branch)
        });
    },
    createBranch: function (options)
    {
        var el = document.createElement((typeof options.tagName == 'undefined') ? "div" : options.tagName);
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
                (elBranch.className.indexOf('b-toggle') == -1) ?
                true :
                ((elBranch.className.indexOf(' expanded') != -1) ? true : false)
            )
            : false;
        if (isOpened) {
            if (a.branchElement.className.indexOf('b-toggle') != -1)
                a.branchElement.className = a.branchElement.className.replace(' expanded', '');
            else a.parentElement.removeChild(elBranch);
            triangle = '▶';
            isOpened = false;
            if (typeof a.params.onCloseBranch != 'undefined')
                a.params.onCloseBranch(a);
        } else {
            if (typeof a.branchElement == 'undefined')
                a.branchElement = a.params.createBranch();
            if (!elBranch) {
                if (a.branchElement.className.indexOf(' branch') == -1)
                    a.branchElement.className += ' branch';
                if (a.branchElement.className.indexOf(' branchLeft') == -1)
                    a.branchElement.className += ' branchLeft';
                a.parentElement.appendChild(a.branchElement);
            }

            if (a.branchElement.className.indexOf('b-toggle') != -1)
                a.branchElement.className += ' expanded';

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
                        el.className += (branch.animate ? " b-toggle" : "");
                        return el;
                    },
                    branch: branch
                },
                title: branch.title,
                tagName: branch.tagName
            }
        ));
    }
}

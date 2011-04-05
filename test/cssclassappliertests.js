xn.test.suite("CSS Class Applier module tests", function(s) {
    s.tearDown = function() {
        document.getElementById("test").innerHTML = "";
    };

    s.test("isAppliedToRange tests", function(t) {
        var applier = rangy.createCssClassApplier("test");

        var testEl = document.getElementById("test");
        testEl.innerHTML = 'Test <span id="one" class="test">One</span> x <span id="two" class="test">Two <span id="three">Three</span> two</span> test';
        var oneEl = document.getElementById("one"), twoEl = document.getElementById("two"), threeEl = document.getElementById("three");
        var range = rangy.createRangyRange();

        range.selectNode(oneEl);
        t.assert(applier.isAppliedToRange(range));

        range.selectNodeContents(oneEl);
        t.assert(applier.isAppliedToRange(range));

        range.selectNode(twoEl);
        t.assert(applier.isAppliedToRange(range));

        range.selectNode(threeEl);
        t.assert(applier.isAppliedToRange(range));

        range.selectNode(testEl);
        t.assertFalse(applier.isAppliedToRange(range));

        range.selectNodeContents(testEl);
        t.assertFalse(applier.isAppliedToRange(range));

        range.setStart(testEl.firstChild, 4);
        range.setEndAfter(oneEl);
        t.assertFalse(applier.isAppliedToRange(range));

        range.setStart(testEl.firstChild, 5);
        t.assert(applier.isAppliedToRange(range));

        range.setEnd(oneEl.nextSibling, 0);
        t.assert(applier.isAppliedToRange(range));

        range.setEnd(oneEl.nextSibling, 1);
        t.assertFalse(applier.isAppliedToRange(range));
    });

    s.test("toggleRange simple test 1", function(t) {
        var applier = rangy.createCssClassApplier("test", true);
        var testEl = document.getElementById("test");
        testEl.innerHTML = 'Test <span id="one" class="test">One</span> test';
        var oneEl = document.getElementById("one");
        var range = rangy.createRangyRange();
        range.selectNodeContents(oneEl);
        applier.toggleRange(range);

        t.assertEquals(testEl.childNodes.length, 3);
        t.assertEquals(testEl.firstChild.data, "Test ");
        t.assertEquals(testEl.lastChild.data, " test");
        t.assertEquals(testEl.childNodes[1].tagName, "SPAN");
        t.assertEquals(testEl.childNodes[1].id, "one");
        t.assertEquals(testEl.childNodes[1].className, "");
        t.assertEquals(testEl.childNodes[1].childNodes.length, 1);
        t.assertEquals(testEl.childNodes[1].firstChild.data, "One");

        applier.toggleRange(range);
        t.assertEquals(testEl.childNodes.length, 3);
        t.assertEquals(testEl.firstChild.data, "Test ");
        t.assertEquals(testEl.lastChild.data, " test");
        t.assertEquals(testEl.childNodes[1].tagName, "SPAN");
        t.assertEquals(testEl.childNodes[1].id, "one");
        t.assertEquals(testEl.childNodes[1].className, "test");
        t.assertEquals(testEl.childNodes[1].childNodes.length, 1);
        t.assertEquals(testEl.childNodes[1].firstChild.data, "One");
    });

    s.test("toggleRange simple test 2", function(t) {
        var applier = rangy.createCssClassApplier("test", true);
        var testEl = document.getElementById("test");
        testEl.innerHTML = 'Test <span id="one" class="test other">One</span> test';
        var oneEl = document.getElementById("one");
        var range = rangy.createRangyRange();
        range.selectNodeContents(oneEl);
        applier.toggleRange(range);

        t.assertEquals(testEl.childNodes.length, 3);
        t.assertEquals(testEl.firstChild.data, "Test ");
        t.assertEquals(testEl.lastChild.data, " test");
        t.assertEquals(testEl.childNodes[1].tagName, "SPAN");
        t.assertEquals(testEl.childNodes[1].id, "one");
        t.assertEquals(testEl.childNodes[1].className, "other");
        t.assertEquals(testEl.childNodes[1].childNodes.length, 1);
        t.assertEquals(testEl.childNodes[1].firstChild.data, "One");

        applier.toggleRange(range);
        t.assertEquals(testEl.childNodes.length, 3);
        t.assertEquals(testEl.firstChild.data, "Test ");
        t.assertEquals(testEl.lastChild.data, " test");
        t.assertEquals(testEl.childNodes[1].tagName, "SPAN");
        t.assertEquals(testEl.childNodes[1].id, "one");
        t.assertEquals(testEl.childNodes[1].className, "other test");
        t.assertEquals(testEl.childNodes[1].childNodes.length, 1);
        t.assertEquals(testEl.childNodes[1].firstChild.data, "One");
    });

    s.test("toggleRange nested in other class test", function(t) {
        var applier = rangy.createCssClassApplier("test", true);
        var testEl = document.getElementById("test");
        testEl.innerHTML = 'Before <span id="one" class="other">One</span> after';
        var oneEl = document.getElementById("one");
        var range = rangy.createRangyRange();
        range.setStart(oneEl.firstChild, 1);
        range.setEnd(oneEl.firstChild, 2);
        applier.toggleRange(range);

        t.assertEquals(oneEl.childNodes.length, 3);
        t.assertEquals(oneEl.className, "other");
        t.assertEquals(oneEl.firstChild.data, "O");
        t.assertEquals(oneEl.lastChild.data, "e");
        t.assertEquals(oneEl.childNodes[1].tagName, "SPAN");
        t.assertEquals(oneEl.childNodes[1].className, "test");
        t.assertEquals(oneEl.childNodes[1].childNodes.length, 1);
        t.assertEquals(oneEl.childNodes[1].firstChild.data, "n");

        //t.assertEquals(testEl.innerHTML, 'Before <span id="one" class="other">O<span class="test">n</span>e</span> after');
    });

    s.test("toggleRange range inside class test", function(t) {
        var applier = rangy.createCssClassApplier("test", true);
        var testEl = document.getElementById("test");
        testEl.innerHTML = 'Before <span id="one" class="test">One</span> after';
        var oneEl = document.getElementById("one");
        var range = rangy.createRangyRange();
        range.setStart(oneEl.firstChild, 1);
        range.setEnd(oneEl.firstChild, 2);
        applier.toggleRange(range);

        t.assertEquals(oneEl.childNodes.length, 1);
        t.assertEquals(oneEl.className, "test");
        t.assertEquals(oneEl.firstChild.data, "O");
        //alert(testEl.innerHTML);
        t.assertEquals(oneEl.nextSibling.data, "n");
        t.assertEquals(oneEl.nextSibling.nextSibling.tagName, "SPAN");
        t.assertEquals(oneEl.nextSibling.nextSibling.className, "test");
        t.assertEquals(oneEl.nextSibling.nextSibling.childNodes.length, 1);
        t.assertEquals(oneEl.nextSibling.nextSibling.firstChild.data, "e");

        //t.assertEquals(testEl.innerHTML, 'Before <span id="one" class="test">O</span>n<span class="test">e</span> after');
    });

    function iterateNodes(node, func, includeSelf) {
        if (includeSelf) {
            func(node);
        }
        for (var i = 0, children = node.childNodes, len = children.length; i < len; ++i) {
            iterateNodes(children[i], func, true);
        }
    }

    function createRangeInHtml(containerEl, html) {
        containerEl.innerHTML = html;
        var range = rangy.createRange(), foundStart = false;
        iterateNodes(containerEl, function(node) {
            if (node.nodeType == 3) {
                var openBraceIndex = node.data.indexOf("{");
                if (openBraceIndex != -1) {
                    node.data = node.data.slice(0, openBraceIndex) + node.data.slice(openBraceIndex + 1);
                    range.setStart(node, openBraceIndex);
                    foundStart = true;
                }
                var closeBraceIndex = node.data.indexOf("}");
                if (closeBraceIndex != -1) {
                    node.data = node.data.slice(0, closeBraceIndex) + node.data.slice(closeBraceIndex + 1);
                    range.setEnd(node, closeBraceIndex);
                }
                var pipeIndex = node.data.indexOf("|");
                if (pipeIndex == 0) {
                    node.data = node.data.slice(1);
                    range[foundStart ? "setEnd" : "setStart"](node.parentNode, rangy.dom.getNodeIndex(node));
                    foundStart = true;
                } else if (pipeIndex == node.length) {
                    node.data = node.data.slice(0, -1);
                    range[foundStart ? "setEnd" : "setStart"](node.parentNode, rangy.dom.getNodeIndex(node) + 1);
                    foundStart = true;
                }

                pipeIndex = node.data.indexOf("|");
                if (pipeIndex == 0) {
                    node.data = node.data.slice(1);
                    range.setEnd(node.parentNode, rangy.dom.getNodeIndex(node));
                } else if (pipeIndex == node.length) {
                    node.data = node.data.slice(0, -1);
                    range.setEnd(node.parentNode, rangy.dom.getNodeIndex(node) + 1);
                }

                // Clear empty text node
                if (node.data.length == 0) {
                    node.parentNode.removeChild(node);
                }
            }
        }, false);
        return range;
    }

    function getSortedClassName(el) {
        return el.className.split(/\s+/).sort().join(" ");
    }

    function htmlAndRangeToString(containerEl, range) {
        function insertRangeBoundary(node, offset, isStart) {
            if (node.nodeType == 3) {
                var str = isStart ? "{" : "}";
                node.data = node.data.slice(0, offset) + str + node.data.slice(offset);
            } else if (node.nodeType == 1) {
                var textNode = document.createTextNode("|");
                if (offset == node.childNodes.length) {
                    node.appendChild(textNode);
                } else {
                    node.insertBefore(textNode, node.childNodes[offset]);
                }
            }
        }

        function getHtml(node, includeSelf) {
            var html = "";
            if (node.nodeType == 1) {
                html = "<" + node.tagName.toLowerCase();
                if (node.id) {
                    html += ' id="' + node.id + '"';
                }
                if (node.className) {
                    html += ' class="' + getSortedClassName(node) + '"';
                }
                html += ">";

                for (var i = 0, children = node.childNodes, len = children.length; i < len; ++i) {
                    html += getHtml(children[i], true);
                }
                html += "</" + node.tagName.toLowerCase() + ">";
            } else if (node.nodeType == 3) {
                html += node.data;
            }
            return html;
        }

        insertRangeBoundary(range.endContainer, range.endOffset, false);
        insertRangeBoundary(range.startContainer, range.startOffset, true);

        return getHtml(containerEl, false);
    }

    s.test("Blah", function(t) {
        var testEl = document.getElementById("test");
        var range = createRangeInHtml(testEl, 'Before <span id="one" class="test">{One}</span> after');
        alert(range.inspect());
        alert(htmlAndRangeToString(testEl, range));
    });

}, false);